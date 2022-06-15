import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { contract_address } from "../utils/consts";
import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import { BigNumber, ethers } from "ethers";
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
    console.log(
      "Data in Job Card -> " + tokenID + " " + JSON.stringify(jobData)
    );
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

  return (
    <li className="card col-span-1 flex flex-col  bg-base-300 rounded-lg shadow-xl">
      {metadata && job ? (
        <>
          <figure>
            <img src={metadata.image} alt="Work" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              {metadata?.description}
              {/* <div className="badge badge-secondary">NEW</div> */}
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
                <BurnButton tokenID={tokenID} />
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
