import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAppContext } from "../context/appContext";
const Header = () => {
  const { setEvil } = useAppContext();

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabindex="0" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
          <ul
            tabindex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a>Mint Opportunity</a>
            </li>
            <li>
              <a>My Opportunities</a>
            </li>
            <li>
              <a>About</a>
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
        {/* <button className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button> */}
        <ConnectButton />
      </div>
    </div>
    // <div className="navbar bg-base-100">
    //   <div className="flex-none">
    //     <button className="btn btn-square btn-ghost">
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         fill="none"
    //         viewBox="0 0 24 24"
    //         className="inline-block w-5 h-5 stroke-current"
    //       >
    //         <path
    //           stroke-linecap="round"
    //           stroke-linejoin="round"
    //           stroke-width="2"
    //           d="M4 6h16M4 12h16M4 18h16"
    //         ></path>
    //       </svg>
    //     </button>
    //   </div>
    //   <div className="flex-1">
    //     <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
    //   </div>
    //   <div className="flex-none">
    //     <button className="btn btn-square btn-ghost">
    //       <svg
    //         xmlns="http://www.w3.org/2000/svg"
    //         fill="none"
    //         viewBox="0 0 24 24"
    //         className="inline-block w-5 h-5 stroke-current"
    //       >
    //         <path
    //           stroke-linecap="round"
    //           stroke-linejoin="round"
    //           stroke-width="2"
    //           d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
    //         ></path>
    //       </svg>
    //     </button>
    //   </div>
    // </div>
    //original
    // <div className="navbar bg-base-100">
    //   <label className="swap swap-flip text-3xl">
    //     <input
    //       type="checkbox"
    //       onChange={(e) => {
    //         setEvil(!e.target.checked);
    //       }}
    //     />
    //     <div className="swap-on">😇</div>
    //     <div className="swap-off">😈</div>
    //   </label>
    //   <div className="flex-1" />
    //   <div className="m-2">
    //     <ConnectButton />
    //   </div>
    // </div>
  );
};

export default Header;
