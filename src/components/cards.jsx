import { toggle } from "@/store/ui";

import { tzs } from "@/lib/utils";
import { trimming } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";

const Card = ({
  id = "",
  name = "",
  description = "",
  from = "",
  to = "",
  status = "",
  quote = 0,
}) => {
  let dispatch = useDispatch();
  let { type } = useSelector((state) => state.persisted);

  let statusThemes = {
    inquired: "bg-slate-100 text-slate-700",
    received: "bg-blue-500 text-white",
    payed: "bg-yellow-500 text-white",
    shipping: "bg-yellow-500 text-white",
    arrived: "bg-green-500 text-white",
  };

  return (
    <span
      onClick={() => {
        dispatch(
          toggle({
            origin: "modal",
            status: {
              on: true,
              id: type === "admin" ? "update-inquiry" : "view-inquiry",
              data: { id },
            },
          })
        );
      }}
      className={`w-full flex flex-col justify-between space-y-4 p-4 bg-white rounded-lg drop-shadow-lg ${
        type === "admin" ? "cursor-pointer" : ""
      }`}
    >
      <span className="flex flex-col space-y-1">
        <h3 className="text-2xl">{name}</h3>
        <span className="flex flex-row space-x-2">
          <small className="capitalize bg-orange-100 py-[2px] px-[8px] rounded-md">
            from: {from?.split("T")[0]}
          </small>
          <small className="capitalize bg-green-100 py-[2px] px-[8px] rounded-md">
            to: {to?.split("T")[0]}
          </small>
        </span>
      </span>
      <p className="font-light">{trimming(description, 60)}</p>
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
