import { Web3Auth } from "@web3auth/modal";
import { useState, useEffect } from "react";
import type { SafeEventEmitterProvider} from "@web3auth/base";
import { CHAIN_NAMESPACES } from "@web3auth/base";

const clientId =
  "BBylt7N3Oo9ok5WedPsZyV27AtpZg9eqCWCND19Qud6M4vStQQxp2_Ea8fb2HatF2ghJh3AJUF33M_hE7UkoAmk"; // get from https://dashboard.web3auth.io

export default function Authentication() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  useEffect(() => {
    const init = async () => {
      console.log("init web 3");

      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.OTHER,
            // Testnet
            chainId: "0x13881",
            rpcTarget: "https://rpc.ankr.com/polygon_mumbai", // This is the public RPC we have added, please pass on your own endpoint while creating an app
            // Mainnet
            // chainId: "0x89",
            // rpcTarget: "https://rpc-mainnet.matic.network", // This is the public RPC we have added, please pass on your own endpoint while creating an app
          },
        });

        setWeb3auth(web3auth);

        await web3auth.initModal();

        if (web3auth.provider) {
          setProvider(web3auth.provider);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);
  const login = async () => {
    console.log({ web3auth });

    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
  };
  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log(user);
  };
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      {provider ? (
        <button onClick={getUserInfo}>Get User Info</button>
      ) : (
        <button onClick={login}>Web3Auth</button>
      )}
    </div>
  );
};
