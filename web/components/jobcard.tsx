import { useEffect, useState } from "react";
import { Result } from "ethers/lib/utils";

const JobCard = ({ data, error }: { data: Result | undefined; error: any }) => {
  let [metadata, setMetadata] = useState(null);
  let [loading, setLoading] = useState(false);

  const fetchMeta = async () => {
    try {
      setLoading(true);
      let res = await fetch(String(data));
      let json = await res.json();

      setMetadata(json);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, [data]);

  return (
    <div className="card w-96 bg-base-300 shadow-xl">
      {metadata ? (
        <figure>
          <img src={metadata?.image} alt="Work" />
        </figure>
      ) : null}

      <div className="card-body">
        <h2 className="card-title">
          Yeah buddy
          <div className="badge badge-secondary">NEW</div>
        </h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">Fashion</div>
          <div className="badge badge-outline">Products</div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
