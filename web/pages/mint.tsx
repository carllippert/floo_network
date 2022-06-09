import { useEffect } from "react";
import { useNetwork, useContractRead } from "wagmi";

import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import Layout from "../components/layout";
import JobCard from "../components/jobcard";
import MintForm from "../components/mintForm";
import { contract_address } from "../utils/consts";
const chain = 31337;

const Mint = () => {
  const { switchNetwork, activeChain } = useNetwork({
    chainId: chain,
  });

  const contractRead = useContractRead(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
    },
    "tokenURI",
    {
      args: "1",
    }
  );

  useEffect(() => {
    if (activeChain?.id !== chain) {
      if (switchNetwork) {
        switchNetwork(chain);
      }
    }
  }, [activeChain]);

  return (
    <Layout>
      <div className="flex gap-10 mt-12">
        <div className="artboard bg-base-200">
          <MintForm />
        </div>

        <div className="w-full">
          {contractRead ? (
            <JobCard data={contractRead.data} error={contractRead.error} />
          ) : (
            "no read well"
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Mint;
