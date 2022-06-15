const BurnButton = ({ tokenID }: { tokenID: string }) => {
  const burn = () => {
    console.log("BURN");
  };

  return (
    <button onClick={burn} className="btn btn-secondary">
      Burn 🔥
    </button>
  );
};

export default BurnButton;
