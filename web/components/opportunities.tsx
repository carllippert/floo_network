import { useState } from "react";

const Opportunities = () => {
  const [good, setGood] = useState(true);

  return (
    <div>
      <div className="flex">
        <div className="flex-1" />
        <label className="swap swap-flip text-3xl">
          <input
            type="checkbox"
            //   value=
            onChange={(e) => {
              setGood(e.target.checked);
            }}
          />
          <div className="swap-on">😇</div>
          <div className="swap-off">😈</div>
        </label>
      </div>
    </div>
  );
};

export default Opportunities;
