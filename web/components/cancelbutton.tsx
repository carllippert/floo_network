import { useSigner, useAccount, useContractWrite } from "wagmi";
import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import { contract_address } from "../utils/consts";
import { Job } from "./jobcard";

const CancelButton = ({ job }: { job: Job }) => {
  const { data: account } = useAccount();
  const { data: signer } = useSigner();

  const { write: cancelToken } = useContractWrite(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
      signerOrProvider: signer,
    },
    "cancelJob",
    {
      onSettled(data, error) {
        console.log("Settled", data, error);
      },
    }
  );

  const cancel = async () => {
    console.log("Cancel");
    await cancelToken({
      args: [job.tokenID],
    });
  };

  return (
    <button
      onClick={cancel}
      disabled={account?.address !== job.recipient}
      className="btn btn-secondary disabled:bg-base-200"
    >
      Cancel
    </button>
  );
};

export default CancelButton;
