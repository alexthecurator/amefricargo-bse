import { toggle } from "@/store/ui";

import { trimming } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";

const Card = ({
  id = "",
  device = "",
  problem = "",
  technician = "",
  status = "",
  quote = 0,
}) => {
  let dispatch = useDispatch();
  let { type } = useSelector((state) => state.persisted);

  let statusThemes = {
    created: "bg-slate-100 text-slate-700",
    received: "bg-blue-500 text-white",
    inprogress: "bg-yellow-500 text-white",
    fixed: "bg-green-500 text-white",
  };

  let tzs = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "TZS",
  });

  return (
    <span
      onClick={() => {
        if (type === "admin") {
          dispatch(
            toggle({
              origin: "modal",
              status: { on: true, id: "update-issue", data: { id } },
            })
          );
        }
      }}
      className={`w-full flex flex-col justify-between space-y-4 p-4 bg-white rounded-lg drop-shadow-lg ${
        type === "admin" ? "cursor-pointer" : ""
      }`}
    >
      <span className="flex flex-col space-y-1">
        <h3 className="text-2xl">{device}</h3>
        <small className="font-light">{technician}</small>
      </span>
      <p className="font-light">{trimming(problem, 60)}</p>
      <span className="flex flex-row justify-between">
        <small
          className={`w-max ${statusThemes[status]} px-3 py-1 rounded-md font-medium capitalize`}
        >
          {status}
        </small>
        <small
          className={`w-max bg-slate-400 text-white px-3 py-1 rounded-md font-medium`}
        >
          {quote > 0 ? tzs.format(quote) : "TZS..."}
        </small>
      </span>
    </span>
  );
};

export default Card;
