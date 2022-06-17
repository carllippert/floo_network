import { useSigner, useAccount, useContractWrite } from "wagmi";
import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import { contract_address } from "../utils/consts";
import { Job, zeroAddress } from "./jobcard";

const FinishButton = ({ job }: { job: Job }) => {
  const { data: account } = useAccount();
  const { data: signer } = useSigner();

  const { write: finishToken } = useContractWrite(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
      signerOrProvider: signer,
    },
    "finishJob",
    {
      onSettled(data, error) {
        console.log("Settled", data, error);
      },
    }
  );

  const finish = async () => {
    await finishToken({
      args: [job.tokenID, account?.address],
      //token, executer
    });
  };

  return (
    <div>
      {job.claimer === account?.address || job.claimer === zeroAddress ? (
        <button onClick={finish} className="btn btn-success">
          FINISH
        </button>
      ) : null}
    </div>
  );
};

export default FinishButton;
