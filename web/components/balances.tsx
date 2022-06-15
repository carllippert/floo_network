import { useContractRead, useAccount } from "wagmi";
import { contract_address } from "../utils/consts";
import MLS_NFT_CONTRACT from "../../contracts/out/NFT.sol/NFT.json";
import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useAppContext } from "../context/appContext";
import numeral from "numeral";

type Balances = {
  claimable: string;
  reclaimable: string;
  locked: string;
};

const ethToUsdc = (eth: BigNumber, ethPrice: number) => {
  let claimableRaw = eth;
  // console.log("claimableRaw", eth);
  let claimableHex = claimableRaw._hex;
  // console.log("claimableHex", claimableHex);
  let claimableBigNumber = BigNumber.from(claimableHex);
  // console.log("claimableBigNumber", claimableBigNumber);
  let claimable = ethers.utils.formatUnits(claimableRaw, "ether");
  // console.log("claimable", claimable);
  // let number = parseFloat(claimable);
  // console.log("usdc", number);

  let real = numeral(claimable).format("0,0.00");
  // console.log("real", real);

  return real;
};

const Balances = () => {
  let { ethPrice } = useAppContext();
  const [balances, setBalances] = useState<Balances>();
  const { data: account } = useAccount();

  const { data: balanceData } = useContractRead(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
    },
    "getBalances",
    {
      args: [account?.address],
    }
  );

  useEffect(() => {
    if (balanceData && !balances) {
      console.log("Balances", balanceData);

      let newBalances: Balances = {
        claimable: ethToUsdc(balanceData[0], ethPrice),
        reclaimable: ethToUsdc(balanceData[1], ethPrice),
        locked: ethToUsdc(balanceData[2], ethPrice),
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
