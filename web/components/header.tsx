import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAppContext } from "../context/appContext";
const Header = () => {
  const { setEvil } = useAppContext();

  return (
    <div className="navbar bg-base-100">
      <label className="swap swap-flip text-3xl">
        <input
          type="checkbox"
          onChange={(e) => {
            setEvil(e.target.checked);
          }}
        />
        <div className="swap-off">😇</div>
        <div className="swap-on">😈</div>
      </label>
      <div className="flex-1" />
      <div className="m-2">
        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;
