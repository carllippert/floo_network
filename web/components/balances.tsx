import { useContractRead, useAccount } from "wagmi";
import { contract_address } from "../utils/consts";
import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";

type Balances = {
  claimable: number;
  reclaimable: number;
  locked: number;
};

const Balances = () => {
  const [balances, setBalances] = useState<Balances>();
  const { data: account } = useAccount();

  const { data: balanceData } = useContractRead(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
    },
    "getBalances",
    {
      args: account?.address,
    }
  );

  useEffect(() => {
    if (balanceData && !balances) {
      console.log("Balances", balanceData);
      let newBalances: Balances = {
        claimable: parseInt(BigNumber.from(balanceData[0])._hex),
        reclaimable: parseInt(BigNumber.from(balanceData[1])._hex),
        locked: parseInt(BigNumber.from(balanceData[2])._hex),
      };

      setBalances(newBalances);
    }
  }, [balanceData]);

  return (
    <div className="stats shadow bg-base-200">
      <div className="stat">
        <div className="stat-title">Claimable Royalties</div>
        <div className="stat-value text-primary">{balances?.claimable}ETH</div>
        <div className="stat-desc">Primarily Work Completed</div>
      </div>

      <div className="stat">
        <div className="stat-title">Reclaimable Royalties</div>
        <div className="stat-value text-secondary">
          {balances?.reclaimable}ETH
        </div>
        <div className="stat-desc">Outstanding Unclaimed Jobs</div>
      </div>

      <div className="stat">
        <div className="stat-title">Locked Royalties</div>
        <div className="stat-value text-error">{balances?.locked}ETH</div>
        <div className="stat-desc">Currently Claimed Jobs</div>
      </div>
    </div>
  );
};

export default Balances;
