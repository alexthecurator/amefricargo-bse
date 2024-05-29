import { useEffect, useState } from "react";
import { request } from "../lib/utils";
import { signIn, useSession } from "next-auth/react";

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
    <form
      onSubmit={async () => await signIn("credentials")}
      className="w-full h-full flex flex-col space-y-2"
    >
      <input
        id="email"
        className="o-black"
        onChange={onChange}
        value={payload?.email}
        type="email"
        placeholder="Email"
      />
      <input
        id="password"
        className="o-black"
        onChange={onChange}
        value={payload?.password}
        type="password"
        placeholder="Password"
      />
      <button className="w-full s-black" type="submit">
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
