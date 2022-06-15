import { useSigner, useAccount, useContractWrite } from "wagmi";
import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import { contract_address } from "../utils/consts";

const BurnButton = ({
  tokenID,
  recipient,
}: {
  tokenID: string;
  recipient: string;
}) => {
  const { data: account } = useAccount();
  const { data: signer } = useSigner();

  const { write: burnToken } = useContractWrite(
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

  const burn = async () => {
    console.log("BURN");
    await burnToken({
      args: [tokenID],
    });
  };

  return (
    <button
      onClick={burn}
      disabled={account?.address !== recipient}
      className="btn btn-secondary disabled:bg-base-200"
    >
      Burn 🔥
    </button>
  );
};

export default BurnButton;
