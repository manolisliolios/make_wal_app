import { useSuiClient } from "@mysten/dapp-kit";
import { useMemo } from "react";
import { WalrusClient} from "@mysten/walrus";

export function useWalrusClient() {

    const suiClient = useSuiClient();

    const walrusClient = useMemo(() => {
        if (!suiClient) return null;

        return new WalrusClient({
            suiClient,
            network: "mainnet",
            storageNodeClientOptions: {
                timeout: 60_000,
            },
        });
    }, [suiClient]);

    return walrusClient;
}
