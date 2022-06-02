import { ConnectButton } from "@rainbow-me/rainbowkit"; 

const Header = () => (
  <div className="navbar bg-base-100">
    <div className="flex-1" />
    <div className="m-2">
      <ConnectButton />
    </div>
  </div>
);

export default Header;
