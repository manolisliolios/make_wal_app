import { useSuiClient } from "@mysten/dapp-kit";
import { useMemo } from "react";
import { WalrusClient} from "../../sdk/walrus/src/client";
import { SuiClient } from "@mysten/sui/client";

export function useWalrusClient(client: SuiClient) {

    const walrusClient = useMemo(() => {

        return new WalrusClient({
            suiClient: client,
            network: "mainnet",
            storageNodeClientOptions: {
                timeout: 60_000,
            },
        });
    }, [client]);

    return walrusClient;
}
