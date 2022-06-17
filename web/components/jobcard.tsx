import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { contract_address } from "../utils/consts";
import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import ClaimButton from "./claimbutton";
import CancelButton from "./cancelbutton";
import FinishButton from "./finishbutton";
import { useAppContext } from "../context/appContext";
import { formatEther } from "ethers/lib/utils";

export const zeroAddress = "0x0000000000000000000000000000000000000000";

export type Job = {
  tokenID: string;
  recipient: string;
  executorFee: string;
  creatorFee: string;
  recruiterFee: string;
  deadline: number;
  tokenURI: string;
  claimer: string;
  recruiter: string;
  canceller: string;
  executer: string;
};

const JobCard = ({ tokenID }: { tokenID: string }) => {
  let { ethPrice } = useAppContext();

  let [metadata, setMetadata] = useState<any>(null);
  let [loading, setLoading] = useState(false);
  let [cancelled, setCancelled] = useState(false);
  let [finished, setFinished] = useState(false);

  const { data: account } = useAccount();

  let [job, setJob] = useState<Job>({
    tokenID,
    recipient: "",
    executorFee: "",
    creatorFee: "",
    recruiterFee: "",
    deadline: 0,
    tokenURI: "",
    claimer: "",
    recruiter: "",
    canceller: "",
    executer: "",
  });

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

  const { data: jobStatusData } = useContractRead(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
    },
    "getJobStatus",
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
    if (jobData) {
      //take array make into struct and set in state.
      let newJob: Job = {
        ...job,
        recipient: jobData[0],
        executorFee: formatEther(jobData[1]),
        creatorFee: formatEther(jobData[2]),
        recruiterFee: formatEther(jobData[3]),
        deadline: jobData[4],
        tokenURI: jobData[5],
      };

      setJob(newJob);
      console.log("Job ?=> " + tokenID + " " + JSON.stringify(job, null, 3));
    }
  }, [jobData]);

  useEffect(() => {
    console.log("Job Status", JSON.stringify(jobStatusData));
    //  return (_claimer, _canceller, _recruiter);
    if (jobStatusData) {
      setJob({
        ...job,
        claimer: jobStatusData[0],
        canceller: jobStatusData[1],
        recruiter: jobStatusData[2],
        executer: jobStatusData[3],
      });
      if (jobStatusData[1] !== zeroAddress) {
        //job has been cancelled by nonzeroaddress
        setCancelled(true);
      }
      if (jobStatusData[3] !== zeroAddress) {
        setFinished(true);
      }
    }
  }, [jobStatusData]);

  return (
    <li
      className={`${cancelled ? "border-8 border-orange-400" : ""} ${
        finished ? "border-8 border-green-400" : ""
      } card col-span-1 flex flex-col rounded-lg shadow-xl bg-base-200 `}
    >
      {metadata && job ? (
        <>
          <figure>
            <img src={metadata.image} alt="Work" />
          </figure>
          <div className="card-body">
            {cancelled ? (
              <div className="badge bg-orange-400 text-white font-bold">
                Cancelled
              </div>
            ) : null}
            {account?.address === job.recipient ? (
              <div className="badge badge-secondary">Ours</div>
            ) : null}
            {job.executer !== zeroAddress ? (
              <div className="badge bg-green-400 text-white font-bold">
                Finished
              </div>
            ) : null}
            <h2 className="card-title">{metadata?.description}</h2>
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
                <ClaimButton job={job} />
                <CancelButton job={job} />
              </div>
              <div>
                <FinishButton job={job} />
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
