import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAppContext } from "../context/appContext";
import { useBlockNumber } from "wagmi";
import Link from "next/link";

const Header = () => {
  const { setEvil } = useAppContext();

  const blockNumber = useBlockNumber({
    watch: true,
  });

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/mint">
                <a>Mint</a>
              </Link>
            </li>
            <li>
              <a>My Opportunities</a>
            </li>
            <li>
              <a>About</a>
            </li>
            <li>
              <a>{blockNumber?.data}</a>
            </li>
          </ul>
        </div>
        <label className="swap swap-flip text-3xl">
          <input
            type="checkbox"
            onChange={(e) => {
              setEvil(!e.target.checked);
            }}
          />
          <div className="swap-on">😇</div>
          <div className="swap-off">😈</div>
        </label>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost normal-case text-xl">Productivity Inc</a>
      </div>
      <div className="navbar-end">
        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;
