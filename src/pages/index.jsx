import { Placeholder, Navbar, Card, Modal } from "@/components";
import NewIssue from "@/modules/form";
import { useEffect, useState } from "react";

// Icons
import { FaPlus as Plus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toggle } from "../../store/ui";
import { useSession } from "next-auth/react";

import { request } from "../../lib/utils";

export default function Home() {
  let { data: session, status } = useSession();
  let [data, setData] = useState([]);

  let { email } = session?.user ?? {};

  async function getIssues() {
    try {
      let response = await request.post("issues/all", { email });

      console.log(response);
      response?.status === 200 ? setData(response?.data) : false;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    status === "authenticated" && getIssues();
  }, [status]);

  return (
    <main className={`space-y-8`}>
      <Modal>
        <NewIssue />
      </Modal>
      <Navbar />
      {data?.length > 0 ? <Issues data={data} /> : <Placeholder />}
      <AddIssue />
    </main>
  );
}

const Issues = ({ data = [] }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <input type="text" />
      <span className="w-1/2 flex flex-col items-center justify-center space-y-2">
        {data?.map((issue, index) => {
          return <Card key={index} {...issue} />;
        })}
      </span>
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
        status === "authenticated" &&
          dispatch(
            toggle({
              origin: "modal",
              status: { on: true, id: "add-issue-modal" },
            })
          );
      }}
      className={`${
        status === "authenticated" ? "s-black" : "bg-slate-400"
      } fixed bottom-16 right-16 p-4 solid rounded-full`}
    >
      <Plus size={28} color={"#fff"} />
    </button>
  );
};
