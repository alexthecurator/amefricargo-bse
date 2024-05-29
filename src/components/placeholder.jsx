// React
import Image from "next/image";

// Redux
import { useDispatch } from "react-redux";

// Auth
import { useSession } from "next-auth/react";

// Icons
import { FaPlus as Plus } from "react-icons/fa";

const Placeholder = () => {
  return (
    <div className="w-full flex flex-col space-y-5">
      <Image
        src={"/placeholder.svg"}
        width={900}
        height={900}
        alt="Placeholder"
      />
      <AddIssue />
    </div>
  );
};

const AddIssue = () => {
  let dispatch = useDispatch();
  let { status } = useSession();

  return (
    <button
      type="button"
      onClick={() => {
        dispatch(
          toggle({
            origin: "modal",
            status: { on: true, id: "add-issue-modal" },
          })
        );
      }}
      className={`${
        status === "authenticated" ? "flex" : "hidden"
      } s-black flex-row space-x-3`}
    >
      <Plus size={15} color={"#fff"} />
      <p>submit your issue</p>
    </button>
  );
};

export default Placeholder;
