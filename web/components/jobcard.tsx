import { useEffect, useState } from "react";
import { Result } from "ethers/lib/utils";
import { useContractRead } from "wagmi";
import { contract_address } from "../utils/consts";
import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import { BigNumber } from "ethers";

type Job = {
  recipient: string;
  executorFee: number;
  creatorFee: number;
  recruiterFee: number;
  deadline: number;
  tokenURI: string;
};

const JobCard = ({ tokenID }: { tokenID: string }) => {
  //{ data, error }: { data: Result | undefined; error: any }
  let [metadata, setMetadata] = useState(null);
  let [loading, setLoading] = useState(false);
  let [job, setJob] = useState<Job | null>(null);

  const { data } = useContractRead(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
    },
    "getJob",
    {
      args: tokenID,
    }
  );

  const fetchMeta = async () => {
    try {
      setLoading(true);
      let res = await fetch(String(job?.tokenURI));
      let json = await res.json();

      setMetadata(json);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Data in Job Card -> " + JSON.stringify(data));
    if (data) {
      //take array make into struct and set in state.
      let job: Job = {
        recipient: data[0],
        executorFee: parseInt(BigNumber.from(data[1])._hex),
        creatorFee: parseInt(BigNumber.from(data[2])._hex),
        recruiterFee: parseInt(BigNumber.from(data[3])._hex),
        deadline: parseInt(BigNumber.from(data[4])._hex),
        tokenURI: String(data[5]),
      };

      setJob(job);

      fetchMeta();
    }
  }, [data]);

  return (
    <div className="card w-96 bg-base-300 shadow-xl">
      {metadata ? (
        <figure>
          <img src={metadata?.image} alt="Work" />
        </figure>
      ) : null}

      <div className="card-body">
        <h2 className="card-title">
          Yeah buddy
          <div className="badge badge-secondary">NEW</div>
        </h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">Fashion</div>
          <div className="badge badge-outline">Products</div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
