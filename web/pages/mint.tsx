import { useEffect } from "react";
import { useContract, useSigner, useNetwork } from "wagmi";

import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import Layout from "../components/layout";

const contract_address = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
const chain = 31337;

const Mint = () => {
  const { data: signer } = useSigner();

  const { switchNetwork, activeChain } = useNetwork({
    chainId: chain,
  });

  const contract = useContract({
    addressOrName: contract_address,
    contractInterface: MLS_NFT_CONTRACT.abi,
    signerOrProvider: signer,
  });

  useEffect(() => {
    if (activeChain?.id !== chain) {
      if (switchNetwork) {
        switchNetwork(chain);
      }
    }
  }, [activeChain]);

  return <Layout>Mint some shit</Layout>;
};

export default Mint;
