import { Sandpack } from "@codesandbox/sandpack-react";
import { htmlFile } from "./demo";
import { Button } from "@radix-ui/themes";
import { useWalrusClient } from "../hooks/useWalrusClient";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useState } from "react";

import "../../node_modules/@mysten/walrus/walrus_wasm_bg.wasm?init";


export function CodePreview() {
  const files = {
    "/index.html": htmlFile,
  };

  const [blobId, setBlobId] = useState<string | null>(null);

  const activeAccount = useCurrentAccount();
  const walrusClient = useWalrusClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const client = useSuiClient();

  const upload = async () => {
    if (!walrusClient) return;
    if (!activeAccount) return;

    let file, encoded;

    try {
      file = new TextEncoder().encode(htmlFile);
    }catch (error){
      console.error("text ecnoded failed")
      console.error(error);
      return;
    }

    try {
      encoded = await walrusClient.encodeBlob(file);
    }catch (error){
      console.error("encode blob failed")
      console.error(error);
      return;
    }

    // console.log(encoded);
    const registerBlobTransaction = await walrusClient.registerBlobTransaction({
			blobId: encoded.blobId,
			rootHash: encoded.rootHash,
			size: file.length,
			deletable: true,
			epochs: 3,
			owner: activeAccount.address,
		});

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
