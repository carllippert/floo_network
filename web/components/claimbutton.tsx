import { useEffect, useState } from "react";
import { useSigner, useAccount, useBlockNumber, useContractWrite } from "wagmi";
import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import { contract_address, metadata_url } from "../utils/consts";

const ClaimButton = ({ tokenID }: { tokenID: string }) => {
  const [claimed, setClaimed] = useState(false);
  const { data: signer } = useSigner();
  const { data: account } = useAccount();

  const claimSettled = (data: any, error: any) => {
    console.log("Settled", { data, error });
  };

  const { data, isError, isLoading, write } = useContractWrite(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
      signerOrProvider: signer,
    },
    "claimJob",
    {
      onSettled(data, error) {
        claimSettled(data, error);
      },
    }
  );

    useEffect(() => {
      //TODO: fetch or set claim status
  }, []);

  return <button className="btn btn-primary">Claim Job</button>;
};

export default ClaimButton;
