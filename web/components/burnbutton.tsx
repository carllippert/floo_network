import { useAccount } from "wagmi";

const BurnButton = ({
  tokenID,
  recipient,
}: {
  tokenID: string;
  recipient: string;
}) => {
  const { data: account } = useAccount();

  const burn = () => {
    console.log("BURN");
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
