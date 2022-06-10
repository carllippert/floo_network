import { useState } from "react";
import type { NextPage } from "next";
import { useContractRead } from "wagmi";
import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import Layout from "../components/layout";
import JobCard from "../components/jobcard";
import { contract_address } from "../utils/consts";

const Jobs: NextPage = () => {
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

  return (
    <Layout>
        {contractRead ? (
            <JobCard data={contractRead.data} error={contractRead.error} />
          ) : (
            "no read well"
          )}
    </Layout>
  );
};

export default Jobs;
