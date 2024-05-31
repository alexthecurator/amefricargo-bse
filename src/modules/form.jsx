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
      <input
        id="name"
        className="o-black"
        onChange={onChange}
        type="text"
        placeholder="What's your name?"
      />
      <input
        id="email"
        className="o-black"
        onChange={onChange}
        type="email"
        placeholder="Enter your email"
      />
      <span className="w-full flex flex-row space-x-2">
        <input
          id="password"
          className="w-full o-black"
          onChange={onChange}
          type="password"
          placeholder="Create a new password"
        />
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
      <input
        className="o-black bg-slate-100"
        type="text"
        value={data?.user?.name}
        readOnly
      />
      <input
        id="email"
        className="o-black bg-slate-100"
        type="email"
        value={data?.user?.email}
        readOnly
      />
      <input
        id="device"
        className="o-black bg-slate-100"
        type="text"
        value={data?.device}
        placeholder="Enter your device number or id"
        readOnly
      />
      <textarea
        id="problem"
        rows={10}
        className="o-black bg-slate-100"
        placeholder="Describe the problem"
        value={data?.problem}
        readOnly
      ></textarea>
      <span className="flex flex-row space-x-2">
        <select
          id="status"
          className="w-3/6 o-black capitalize"
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
        <input
          id="quote"
          className="w-full o-black"
          type="number"
          onChange={onChange}
          value={data?.quote}
          placeholder={"Your price quote"}
        />
      </span>
      <span className="flex flex-row space-x-2">
        <input
          id="credit"
          className="w-full o-black"
          type="number"
          onChange={onChange}
          value={data?.credit}
          placeholder={"Your price quote"}
        />
        <input
          id="debit"
          className="w-full o-black"
          type="number"
          onChange={onChange}
          value={data?.debit}
          placeholder={"Your price quote"}
        />
      </span>
      <button className="w-full s-black" type="submit">
        Update Issue
      </button>
    </form>
  );
};
