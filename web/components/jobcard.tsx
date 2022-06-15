import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { contract_address } from "../utils/consts";
import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import ClaimButton from "./claimbutton";
import BurnButton from "./burnbutton";
import { useAppContext } from "../context/appContext";
import { formatEther } from "ethers/lib/utils";

let zeroAddress = "0x0000000000000000000000000000000000000000";

type Job = {
  recipient: string;
  executorFee: string;
  creatorFee: string;
  recruiterFee: string;
  deadline: number;
  tokenURI: string;
};

const JobCard = ({ tokenID }: { tokenID: string }) => {
  let { ethPrice } = useAppContext();

  let [metadata, setMetadata] = useState<any>(null);
  let [loading, setLoading] = useState(false);
  let [burnt, setBurnt] = useState(false);

  const { data: account } = useAccount();

  let [job, setJob] = useState<Job>();

  const { data: jobData } = useContractRead(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
    },
    "getJob",
    {
      args: tokenID,
    }
  );

  const { data: claimData } = useContractRead(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
    },
    "getClaimStatus",
    {
      args: tokenID,
    }
  );

  const { data: ownerData } = useContractRead(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
    },
    "getOwner",
    {
      args: tokenID,
    }
  );

  const fetchMeta = async () => {
    try {
      setLoading(true);
      console.log("TokenURI -> " + job?.tokenURI);
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
    if (job) {
      fetchMeta();
    }
  }, [job]);

  useEffect(() => {
    // console.log(
    //   "Data in Job Card -> " + tokenID + " " + JSON.stringify(jobData)
    // );
    if (jobData && !job) {
      //take array make into struct and set in state.
      let job: Job = {
        recipient: jobData[0],
        executorFee: formatEther(jobData[1]),
        creatorFee: formatEther(jobData[2]),
        recruiterFee: formatEther(jobData[3]),
        deadline: jobData[4],
        tokenURI: jobData[5],
      };

      setJob(job);
      console.log("Job ?=> " + tokenID + " " + JSON.stringify(job, null, 3));
    }
  }, [jobData]);

  useEffect(() => {
    if (String(ownerData) === zeroAddress) {
      setBurnt(true);
    }
  }, [ownerData]);

  return (
    <li
      className={`${
        burnt ? "border-8 border-orange-400" : ""
      } card col-span-1 flex flex-col rounded-lg shadow-xl bg-base-200 `}
    >
      {metadata && job ? (
        <>
          <figure>
            <img src={metadata.image} alt="Work" />
          </figure>
          <div className="card-body">
            {burnt ? "BURNT" : null}
            <h2 className="card-title">
              {metadata?.description}
              {account?.address === job.recipient ? (
                <div className="badge badge-secondary">Ours</div>
              ) : null} 
            </h2>
            <div className="card-actions">
              <div>
                <div>Pays</div>

                <div className="badge badge-outline">
                  {job.executorFee}
                  ETH
                </div>
              </div>
              <div>
                <div> Creator App Reward</div>
                <div className="badge badge-outline">{job.creatorFee}</div>
              </div>
              <div>
                <div>Recruiter App Reward</div>
                <div className="badge badge-outline">{job.recruiterFee}</div>
              </div>
              <div className="flex gap-2 mt-2">
                <ClaimButton
                  tokenID={tokenID}
                  claimedBy={claimData ? String(claimData) : zeroAddress}
                />
                <BurnButton tokenID={tokenID} recipient={job.recipient} />
              </div>
            </div>
          </div>
        </>
      ) : (
        "No Metadata"
      )}
    </li>
  );
};

export default JobCard;
