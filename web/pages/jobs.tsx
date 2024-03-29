import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useContractRead } from "wagmi";
import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import Layout from "../components/layout";
import JobCard from "../components/jobcard";
import { contract_address } from "../utils/consts";
import { BigNumber, ethers } from "ethers";

type FakeJob = {
  tokenID: string;
};
const Jobs: NextPage = () => {
  let [jobsCount, setJobsCount] = useState(0);
  let [fakeJobs, setFakeJobs] = useState<FakeJob[]>([]);

  const { data } = useContractRead(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
    },
    "getCurrentTokenId"
  );

  useEffect(() => {
    if (data) {
      let number = BigNumber.from(data);

      let parsed = parseInt(number._hex);

      console.log("CurrentTokenID", parsed);

      setJobsCount(parsed);

      let fakeJobs: FakeJob[] = [];
      for (let i = 0; i < jobsCount; i++) {
        fakeJobs.push({ tokenID: String(i + 1) });
      }
      setFakeJobs(fakeJobs);
    }
  }, [data]);

  return (
    <Layout>
      {data ? (
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 my-6"
        >
          {fakeJobs.map((job, index) => {
            return <JobCard key={job.tokenID} tokenID={job.tokenID} />;
          })}
        </ul>
      ) : (
        "No Jobs"
      )}
    </Layout>
  );
};

export default Jobs;
