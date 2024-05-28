import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { request } from "../../lib/utils";

const NewIssue = () => {
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

export default NewIssue;
