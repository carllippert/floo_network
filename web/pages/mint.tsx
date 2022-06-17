import { useEffect } from "react";
import { useNetwork } from "wagmi";
import Layout from "../components/layout";
import MintForm from "../components/mintForm";
const chain = 31337;
const { MerkleTree } = require("merkletreejs");
const SHA256 = require("crypto-js/sha256");

const Mint = () => {
  const { switchNetwork, activeChain } = useNetwork({
    chainId: chain,
  });

  useEffect(() => {
    if (activeChain?.id !== chain) {
      if (switchNetwork) {
        switchNetwork(chain);
      }
    }
  }, [activeChain]);

  return (
    <Layout>
      <div className="flex gap-10 mt-12">
        <div className="artboard bg-base-200">
          <MintForm />
        </div>

        <div className="w-full">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>ENS</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td>carllippert.eth</td>
                  <td>0x9E33078f3398be71da0E0fba182Af22eEA0EbB12</td>
                </tr>

                <tr>
                  <th>2</th>
                  <td>0xshade456.eth</td>
                  <td>Desktop Support Technician</td>
                </tr>
                <tr>
                  <th>3</th>
                  <td>Brice Swyre</td>
                  <td>Tax Accountant</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Mint;
