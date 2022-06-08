import { useEffect } from "react";
import {
  useContract,
  useSigner,
  useNetwork,
  useAccount,
  useContractRead,
} from "wagmi";

import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import Layout from "../components/layout";
import JobCard from "../components/jobcard";
const contract_address = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const chain = 31337;
const metadata_url =
  "https://ctinsvafusekcbpznpfr.supabase.co/storage/v1/object/public/nft-metadata/metadata.json";

const Mint = () => {
  const { data: signer } = useSigner();
  const { data: account } = useAccount();

  const { switchNetwork, activeChain } = useNetwork({
    chainId: chain,
  });

  const contractRead = useContractRead(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
    },
    "tokenURI",
    {
      args: "1",
    }
  );

  const contract = useContract({
    addressOrName: contract_address,
    contractInterface: MLS_NFT_CONTRACT.abi,
    signerOrProvider: signer,
  });

  const mint = async () => {
    if (signer && account) {
      let res = await contract.mintTo(account.address, metadata_url);
      console.log(res);
    }
  };

  useEffect(() => {
    if (activeChain?.id !== chain) {
      if (switchNetwork) {
        switchNetwork(chain);
      }
    }
  }, [activeChain]);

  return (
    <Layout>
      <button onClick={mint} className="btn btn-primary">
        Mint!
      </button>
      <div className="pt-20">
        {contractRead ? (
          <JobCard data={contractRead.data} error={contract.error} />
        ) : (
          "no read well"
        )}
      </div>
    </Layout>
  );
};

export default Mint;
