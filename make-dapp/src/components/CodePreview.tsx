import { Sandpack } from "@codesandbox/sandpack-react";
import { htmlFile } from "./demo";
import { Button } from "@radix-ui/themes";
import { useWalrusClient } from "../hooks/useWalrusClient";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useState } from "react";

import "../../sdk/walrus-wasm/web/walrus_wasm_bg.wasm?init";
import init from "../../sdk/walrus-wasm/web/walrus_wasm";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

init();


export function CodePreview() {
  const files = {
    "/index.html": htmlFile,
  };

  const [blobId, setBlobId] = useState<string | null>(null);

  const client = new SuiClient({
    url: getFullnodeUrl("mainnet"),
    network: "mainnet",
  })

  const activeAccount = useCurrentAccount();
  const walrusClient = useWalrusClient(client);
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const upload = async () => {
    if (!walrusClient) return;
    if (!activeAccount) return;

    const file = new TextEncoder().encode(htmlFile);

    const encoded = await walrusClient.encodeBlob(file);

    console.log(encoded);

    // console.log(encoded);
    const registerBlobTransaction = await walrusClient.registerBlobTransaction({
			blobId: encoded.blobId,
			rootHash: encoded.rootHash,
			size: file.length,
			deletable: true,
			epochs: 3,
			owner: activeAccount.address,
		});

    registerBlobTransaction.setSender(activeAccount.address);

    const response = await signAndExecute({
      transaction: registerBlobTransaction,
    });
  
    const { objectChanges, effects } = await client.waitForTransaction({
			digest: response.digest,
			options: { showObjectChanges: true, showEffects: true },
		});

    if (effects?.status.status !== 'success') {
			throw new Error('Failed to register blob');
		}

		const blobType = await walrusClient.getBlobType();

		const blobObject = objectChanges?.find(
			(change) => change.type === 'created' && change.objectType === blobType,
		);

		if (!blobObject || blobObject.type !== 'created') {
			throw new Error('Blob object not found');
		}

		const confirmations = await walrusClient.writeEncodedBlobToNodes({
			blobId: encoded.blobId,
			metadata: encoded.metadata,
			sliversByNode: encoded.sliversByNode,
			deletable: true,
			objectId: blobObject.objectId,
		});

		const certifyBlobTransaction = await walrusClient.certifyBlobTransaction({
			blobId: encoded.blobId,
			blobObjectId: blobObject.objectId,
			confirmations,
			deletable: true,
		});

		const { digest: certifyDigest } = await signAndExecute({
			transaction: certifyBlobTransaction,
		});

		const { effects: certifyEffects } = await client.waitForTransaction({
			digest: certifyDigest,
			options: { showEffects: true },
		});

		if (certifyEffects?.status.status !== 'success') {
			throw new Error('Failed to certify blob');
		}

    setBlobId(encoded.blobId);
  }

  return (
    <div>
      <Sandpack files={files} theme="light" template="static" />

      <Button onClick={upload}>Upload blob on Walrus</Button>

      {blobId && <div>Blob ID: {blobId}</div>}
    </div>
  );
}
