import { useEffect, useState } from "react";
import { request } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import { useSelector } from "react-redux";

export const NewIssue = () => {
  let { data: session } = useSession();
  let [payload, setPayload] = useState({});

  function onChange(e) {
    let { id, value } = e.target;
    setPayload({ ...payload, [id]: value });
  }

  async function submit() {
    payload.email = session?.user?.email;

    try {
      await request.post("issues/new", payload);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={submit} className="w-full h-full flex flex-col space-y-2">
      <input
        className="o-black bg-slate-100"
        type="text"
        value={session?.user?.name}
        readOnly
      />
      <input
        id="email"
        className="o-black bg-slate-100"
        type="email"
        value={session?.user?.email}
        readOnly
      />
      <input
        id="device"
        className="o-black"
        type="text"
        onChange={onChange}
        placeholder="Enter your device number or id"
      />
      <textarea
        id="problem"
        rows={10}
        className="o-black"
        onChange={onChange}
        placeholder="Describe the problem"
      ></textarea>

      <button className="w-full s-black" type="submit">
        submit your inquery
      </button>
    </form>
  );
};

export const CredentialLogin = () => {
  let [payload, setPayload] = useState({});

  function onChange(e) {
    let { id, value } = e.target;
    setPayload({ ...payload, [id]: value });
  }

  return (
    <form className="w-full h-full flex flex-col space-y-2">
      <input
        id="email"
        className="o-black"
        onChange={onChange}
        type="email"
        placeholder="Email"
      />
      <input
        id="password"
        className="o-black"
        onChange={onChange}
        type="password"
        placeholder="Password"
      />
      <button
        className="w-full s-black"
        type="button"
        onClick={async () => {
          await signIn("credentials", {
            redirect: false,
            ...payload,
          });
        }}
      >
        login
      </button>
    </form>
  );
};

export const SignUp = () => {
  let [payload, setPayload] = useState({});
  let [alert, setAlert] = useState("");

  function onChange(e) {
    let { id, value } = e.target;
    setPayload({ ...payload, [id]: value });
  }

  async function submit() {
    payload.image = "/avatar.jpeg";

    try {
      await request.post("auth/signup", payload);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let { password, password_rp } = payload ?? {};

    if (password_rp?.length >= password?.length) {
      password === password_rp
        ? delete payload.password_rp
        : setAlert("Passwords don't match.. yet");
    }
  }, [payload]);

  useEffect(() => {
    setTimeout(() => setAlert(""), 5000);
  }, [alert]);

  return (
    <form onSubmit={submit} className="w-full h-full flex flex-col space-y-2">
      <fieldset className="flex flex-row items-center o-black">
        <label htmlFor="">name:</label>
        <input onChange={onChange} type="text" />
      </fieldset>
      <fieldset className="flex flex-row items-center o-black">
        <label htmlFor="">email:</label>
        <input onChange={onChange} type="email" />
      </fieldset>
      <span className="w-full flex flex-row space-x-2">
        <fieldset className="w-full flex flex-row items-center o-black">
          <label htmlFor="">password:</label>
          <input
            id="password"
            onChange={onChange}
            type="password"
            placeholder="Create a new password"
          />
        </fieldset>
        <input
          id="password_rp"
          className="w-full o-black"
          onChange={onChange}
          type="password"
          placeholder="Repeat your password"
        />
      </span>
      {alert && <small className="text-red-400 font-medium">{alert}</small>}
      <button className="w-full s-black" type="submit">
        Create your new account
      </button>
    </form>
  );
};

export const UpdateIssue = () => {
  let { modal } = useSelector((state) => state.ui);

  let [data, setData] = useState({});

  function onChange(e) {
    let { id, value } = e.target;
    setData({ ...data, [id]: value });
  }

  async function submit() {
    try {
      data.issue = modal?.data?.id;
      delete data.user;
      await request.put("issues/update", data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getDetails(issue) {
    try {
      let response = await request.post("issues/get", { issue });
      response?.status == 200 ? setData(response?.data?.issues) : false;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (modal?.data) {
      let { id: issue } = modal?.data;
      getDetails(issue);
    }
  }, [modal]);

  return (
    <form onSubmit={submit} className="w-full h-full flex flex-col space-y-2">
      <fieldset className="flex flex-row items-center o-black bg-slate-100">
        <label htmlFor="">name:</label>
        <input
          className="bg-slate-100"
          type="text"
          value={data?.user?.name}
          readOnly
        />
      </fieldset>
      <fieldset className="flex flex-row items-center o-black bg-slate-100">
        <label htmlFor="">email:</label>
        <input
          className="bg-slate-100"
          type="text"
          value={data?.user?.email}
          readOnly
        />
      </fieldset>
      <fieldset className="flex flex-row items-center o-black bg-slate-100">
        <label htmlFor="">device:</label>
        <input
          className="bg-slate-100"
          type="text"
          value={data?.device}
          readOnly
        />
      </fieldset>
      <fieldset className="flex flex-col items-start o-black bg-slate-100">
        <label htmlFor="">issue:</label>
        <textarea
          id="problem"
          rows={10}
          className="bg-slate-100 m-0"
          placeholder="Describe the problem"
          value={data?.problem}
          readOnly
        ></textarea>
      </fieldset>

      <span className="flex flex-row space-x-2">
        <fieldset className="w-3/5 o-black flex flex-row space-x-2">
          <label htmlFor="">status:</label>
          <select
            id="status"
            className="capitalize round"
            onChange={onChange}
            value={data?.status}
          >
            <option value="" default>
              Select status
            </option>
            <option value="received">received</option>
            <option value="inprogress">in-progress</option>
            <option value="fixed">fixed</option>
          </select>
        </fieldset>
        <fieldset className="w-full flex flex-row items-center o-black">
          <label htmlFor="">quote:</label>
          <span className="w-full flex flex-row items-center">
            <small className="ml-2 py-[3px] px-[9px] bg-slate-200 rounded-md capitalize font-medium">
              tzs
            </small>
            <input
              id="quote"
              type="number"
              onChange={onChange}
              value={data?.quote}
            />
          </span>
        </fieldset>
      </span>

      <span className="flex flex-row space-x-2">
        <fieldset className="w-full flex flex-row items-center o-black">
          <label htmlFor="">credit:</label>
          <span className="flex flex-row items-center">
            <small className="ml-2 py-[3px] px-[9px] bg-slate-200 rounded-md capitalize font-medium">
              tzs
            </small>
            <input
              id="credit"
              type="number"
              onChange={onChange}
              value={data?.credit}
              placeholder={"Your price quote"}
            />
          </span>
        </fieldset>
        <fieldset className="w-full flex flex-row items-center o-black">
          <label htmlFor="">debit:</label>
          <span className="flex flex-row items-center">
            <small className="ml-2 py-[3px] px-[9px] bg-slate-200 rounded-md capitalize font-medium">
              tzs
            </small>
            <input
              id="debit"
              type="number"
              onChange={onChange}
              value={data?.debit}
              placeholder={"Your price quote"}
            />
          </span>
        </fieldset>
      </span>
      <button className="w-full s-black" type="submit">
        Update Issue
      </button>
    </form>
  );
};
