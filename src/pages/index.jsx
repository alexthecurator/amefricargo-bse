// React
import { useEffect, useState } from "react";

// Redux
import { toggle } from "@/store/ui";
import { saveUserType } from "@/store/user";
import { useDispatch, useSelector } from "react-redux";

// Utils
import { request } from "@/lib/utils";

// Components
import { NewIssue, SignUp, UpdateIssue } from "@/modules/form";
import { Placeholder, Navbar, Card, Modal } from "@/components";

// Auth
import SignIn from "@/modules/auth";
import { useSession } from "next-auth/react";

// Icons
import { FaPlus as Plus } from "react-icons/fa";

export default function Home() {
  let { type } = useSelector((state) => state.persisted);

  return (
    <main>
      <Modals />
      <Navbar />
      <Render />
      {type !== "admin" ? <AddIssue /> : ""}
    </main>
  );
}

const Modals = () => {
  let { id } = useSelector((state) => state.ui.modal);

  let content = {
    "add-issue": <NewIssue />,
    "update-issue": <UpdateIssue />,
    "sign-up": <SignUp />,
  };

  return <Modal>{content[id]}</Modal>;
};

const Render = () => {
  let dispatch = useDispatch();

  let { data: session, status } = useSession();
  let [data, setData] = useState([]);

  let { email } = session?.user ?? {};

  async function getIssues(type) {
    try {
      let response = null;

      if (type === "admin") {
        response = await request.get("issues/all");
      } else {
        response = await request.post("issues/all", { email });
      }
      response?.status === 200 ? setData(response?.data) : false;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let account = "client";
    session?.user?.email === "admin@gadgetsupport.com"
      ? (account = "admin")
      : false;

    dispatch(saveUserType(account));
    status === "authenticated" && getIssues(account);
  }, [status]);

  if (data?.length > 0) {
    return <Issues stream={data} />;
  } else {
    return (
      <span className="w-full h-screen max-h-[80vh] flex flex-col justify-center items-center">
        <span className="w-[21rem] flex flex-col justify-center items-center space-y-8">
          <Placeholder />
          {status === "unauthenticated" && <SignIn />}
        </span>
      </span>
    );
  }
};

const Issues = ({ stream = [] }) => {
  let { data: session } = useSession();
  let [data, setData] = useState([]);

  let { type } = useSelector((state) => state.persisted);

  let [filters, setFilter] = useState({});

  function onChange(e) {
    let { id, value } = e?.target;
    setFilter({ ...filters, [id]: value });
  }

  async function submit() {
    filters.type = type;
    type !== "admin" ? (filters.email = session?.user?.email) : false;
    try {
      setData([]);
      let response = await request.post("issues/filter", filters);
      response?.status === 200 ? setData(response?.data) : false;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    stream?.length > 0 ? setData(stream) : false;
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-start items-center pt-36">
      <span className="w-1/2 flex flex-col space-y-4">
        {/* Filters */}
        <span className="flex flex-row space-x-2 items-center justify-center">
          <fieldset className="w-full flex flex-row o-black">
            <label htmlFor="">device:</label>
            <input
              type="text"
              id="device"
              onChange={onChange}
              placeholder="Search device"
            />
          </fieldset>
          <fieldset className="w-3/4 flex flex-row o-black">
            <label htmlFor="">status:</label>
            <select id="status" className="round" onChange={onChange}>
              <option value="" default>
                Select status
              </option>
              <option value="created">created</option>
              <option value="received">received</option>
              <option value="inprogress">in-progress</option>
              <option value="fixed">fixed</option>
            </select>
          </fieldset>
          <fieldset className="w-3/4 flex flex-row o-black">
            <label htmlFor="">created:</label>
            <input id="createdAt" type="date" onChange={onChange} />
          </fieldset>
          <button className="s-black" type="button" onClick={() => submit()}>
            search
          </button>
        </span>
        {/* Listing */}
        <span className="grid grid-cols-3 gap-4">
          {data?.map((issue, index) => {
            return <Card key={index} {...issue} />;
          })}
        </span>
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
              status: { on: true, id: "add-issue" },
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
