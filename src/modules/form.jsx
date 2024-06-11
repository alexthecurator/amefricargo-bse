import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { signIn, useSession } from "next-auth/react";

import { request } from "@/lib/utils";

import { BiReset as Reset } from "react-icons/bi";
import { FaPlus as Plus } from "react-icons/fa";

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
  let [payload, setPayload] = useState({ image: "/avatar.jpeg" });
  let [alert, setAlert] = useState("");

  function onChange(e) {
    let { id, value } = e.target;
    setPayload({ ...payload, [id]: value });
  }

  async function submit() {
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
    <form onSubmit={submit} className="flex flex-col space-y-2">
      <fieldset className="o-black">
        <label htmlFor="name">name:</label>
        <input
          id="name"
          onChange={onChange}
          type="text"
          placeholder="What's your name?"
        />
      </fieldset>
      <fieldset className="o-black">
        <label htmlFor="email">email:</label>
        <input
          id="email"
          onChange={onChange}
          type="email"
          placeholder="Your email, eg: user@domain.com"
        />
      </fieldset>
      {/* Payment */}
      <fieldset className="o-black">
        <label htmlFor="payment" className="mr-4">
          payment:
        </label>
        <select
          id="p_method"
          className="max-w-[25%] o-black round"
          onChange={onChange}
        >
          <option value="" default>
            Select method
          </option>
          <option value="visa">visa</option>
          <option value="mastercard">mastercard</option>
          <option value="paypal">paypal</option>
        </select>
        <input
          id="p_value"
          type="varchar"
          onChange={onChange}
          placeholder="Enter your card number"
        />
      </fieldset>
      {/* Passwords */}
      <span className="w-full flex flex-row space-x-2">
        <fieldset className="w-full flex flex-row items-center o-black">
          <label htmlFor="password">password:</label>
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
      {/* Notifications */}
      {alert && <small className="text-red-400 font-medium">{alert}</small>}
      <button className="w-full s-black" type="submit">
        Create your new account
      </button>
    </form>
  );
};

export const NewInquiry = () => {
  let { data: session } = useSession();
  let [payload, setPayload] = useState({});
  let [inquiry, setInquiry] = useState({});

  let [step, setStep] = useState(0);
  let [cargo, setCargo] = useState([]);
  let [cargoCount, setCargoCount] = useState(0);

  function handleChange(e) {
    let { id, value } = e.target;
    step === 1
      ? setPayload({ ...payload, [id]: value })
      : setInquiry({ ...inquiry, [id]: value });
  }

  function addCargo() {
    let length = Object.entries(payload).length;

    if (length === 6) {
      setCargo((cargo) => [...cargo, payload]);
      setCargoCount(cargoCount + 1);
      document.getElementById("new-inquiry-form").reset();
    } else if (length > 0 && length < 6) {
      alert("Please complete filling the required info");
    } else {
      alert("Add some cargo please");
    }
  }

  async function submit() {
    let data = {};

    data.inquiry = inquiry;
    data.email = session?.user?.email;

    if (cargo?.length > 0) {
      data.cargo = cargo;
    } else if (Object.entries(payload).length > 0) {
      data.cargo = [payload];
    }

    if (data?.cargo.length > 0) {
      try {
        await request.post("inquiry/new", data);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <form
      id="new-inquiry-form"
      onSubmit={submit}
      className="flex flex-col space-y-2"
    >
      <fieldset className="o-black bg-slate-100">
        <label htmlFor="">name:</label>
        <input
          className="bg-slate-100"
          type="text"
          value={session?.user?.name}
          readOnly
        />
      </fieldset>
      <fieldset className="o-black bg-slate-100">
        <label htmlFor="">email:</label>
        <input
          className="bg-slate-100"
          type="text"
          value={session?.user?.email}
          readOnly
        />
      </fieldset>
      {step === 0 ? (
        <>
          <fieldset className="o-black">
            <label htmlFor="name">inquiry:</label>
            <input
              id="name"
              type="text"
              onChange={handleChange}
              placeholder="What's your inquiry?"
            />
          </fieldset>
          <fieldset className="flex flex-col items-start o-black">
            <label htmlFor="description">description:</label>
            <textarea
              id="description"
              rows={10}
              type="text"
              onChange={handleChange}
              placeholder="Tell us what it's about..."
            />
          </fieldset>
        </>
      ) : (
        <>
          <span className="flex flex-row space-x-2 items-center">
            <fieldset className="w-full o-black">
              <label htmlFor="cargo">cargo:</label>
              <input
                id="name"
                type="varchar"
                onChange={handleChange}
                placeholder="What should we call the cargo?"
              />
            </fieldset>
          </span>
          <span className="flex flex-row space-x-2 items-center">
            <fieldset className="w-full o-black">
              <label htmlFor="type">type:</label>
              <input
                id="type"
                type="text"
                onChange={handleChange}
                placeholder="Eg: Appliances"
              />
            </fieldset>
            <fieldset className="w-full o-black">
              <label htmlFor="">quantity:</label>
              <input
                id="quantity"
                type="number"
                onChange={handleChange}
                placeholder="How many are we shipping?"
              />
            </fieldset>
          </span>
          <span className="flex flex-row space-x-2 items-center">
            <fieldset className="w-full max-w-[35%] o-black">
              <label htmlFor="weight">weight:</label>
              <input
                id="weight"
                type="number"
                onChange={handleChange}
                placeholder="In LBS"
              />
            </fieldset>
            <fieldset className="w-full o-black">
              <label htmlFor="dimensions">dimensions:</label>
              <input
                id="dimensions"
                type="varchar"
                onChange={handleChange}
                placeholder="w x h x l  eg: (21 x 34 x 40) inches"
              />
            </fieldset>
          </span>
          <fieldset className="flex flex-col items-start o-black">
            <label htmlFor="description">description:</label>
            <textarea
              id="description"
              rows={10}
              onChange={handleChange}
              placeholder="Tell us more about your cargo.."
            ></textarea>
          </fieldset>

          <span
            className={`flex flex-row items-center ${
              cargoCount > 0 ? "space-x-2" : ""
            }`}
          >
            <span
              className={`w-max bg-slate-100 ${
                cargoCount > 0 ? "flex" : "hidden"
              } o-black p-[10px] text-nowrap`}
            >
              You have {cargoCount} cargo
            </span>
            <button
              className={`w-full max-w-[20%] space-x-2 o-black ${
                cargoCount > 0 ? "flex" : "hidden"
              }`}
              onClick={() => {
                setCargo([]);
                setCargoCount(0);
                setPayload({});
              }}
              type={"button"}
            >
              <Reset size={20} color={"#000"} />
              <p>reset</p>
            </button>
            <button
              className={`w-full space-x-2 ${
                cargoCount > 0 ? "s-black" : "o-black"
              }`}
              type="button"
              onClick={() => addCargo()}
            >
              <Plus size={20} color={"#fff"} /> <p>add cargo</p>
            </button>
          </span>
        </>
      )}
      <span className="flex flex-row space-x-2">
        <button
          className="w-[20%] o-black"
          type="button"
          onClick={() => setStep(step === 1 ? 0 : 1)}
        >
          {step === 1 ? "back" : "next"}
        </button>

        <button className="w-full s-black" type="submit">
          submit your inquery
        </button>
      </span>
    </form>
  );
};

export const UpdateInquiry = () => {
  let { modal } = useSelector((state) => state.ui);
  let [data, setData] = useState({});

  let [selected, setSelected] = useState({});

  function onChange(e) {
    let { id, value } = e.target;
    setData({ ...data, [id]: value });
  }

  async function submit() {
    delete data?.Cargo;
    delete data?.User;
    delete data?.name;
    delete data?.description;
    try {
      data.issue = modal?.data?.id;
      await request.put("inquiry/update", data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getDetails(inquiry) {
    try {
      let response = await request.post("inquiry/get", { inquiry });
      response?.status == 200 ? setData(response?.data?.inquiry) : false;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (modal?.data) {
      let { id: inquiry } = modal?.data;
      getDetails(inquiry);
    }
  }, [modal]);

  return (
    <form onSubmit={submit} className="flex flex-col space-y-2">
      <fieldset className="o-black bg-slate-100">
        <label htmlFor="">name:</label>
        <input
          className="bg-slate-100"
          type="text"
          value={data?.User?.name}
          readOnly
        />
      </fieldset>
      <fieldset className="o-black bg-slate-100">
        <label htmlFor="">email:</label>
        <input
          className="bg-slate-100"
          type="text"
          value={data?.User?.email}
          readOnly
        />
      </fieldset>

      <fieldset className="o-black">
        <label htmlFor="" className="bg-slate-100">
          Title:
        </label>
        <input
          className="bg-slate-100"
          type="text"
          value={data?.name}
          readOnly
        />
      </fieldset>
      <fieldset className="o-black">
        <label htmlFor="" className="bg-slate-100">
          Details:
        </label>
        <input
          className="bg-slate-100"
          type="text"
          value={data?.description}
          readOnly
        />
      </fieldset>

      <fieldset className="flex flex-col o-black items-start">
        <label htmlFor="">
          Cargo Manifest with [{data?.Cargo?.length}] Cargo
        </label>
        <span className="flex flex-row space-x-4 items-center">
          {/* Cargo */}
          <span className="w-max h-[11rem] flex flex-col space-y-2 p-3 overflow-y-scroll overflow-x-none">
            {data?.Cargo?.map((cargo) => {
              return (
                <span
                  key={cargo?.id}
                  className="bg-slate-100 rounded-lg px-3 py-1 cursor-pointer"
                  onClick={() => {
                    setSelected(cargo);
                  }}
                >
                  {cargo?.name}
                </span>
              );
            })}
          </span>

          {/* Separator */}
          <span className="h-[8rem] w-[1px] flex bg-slate-400"></span>

          {/* Details */}
          <span className="flex flex-col -space-y-[.2rem]">
            {Object.entries(selected).length > 0 ? (
              <>
                <h1 className="capitalize text-xl font-medium ml-3 underline">
                  details
                </h1>
                <span className="flex flex-row space-x-4 items-center">
                  <fieldset className="space-x-2">
                    <label htmlFor="">name:</label>
                    <h4>{selected?.name}</h4>
                  </fieldset>
                  <fieldset className="space-x-2">
                    <label htmlFor="">weight:</label>
                    <p className="text-nowrap">{selected?.weight}</p>
                  </fieldset>

                  <fieldset className="space-x-2">
                    <label htmlFor="">quantity:</label>
                    <p className="text-nowrap">{selected?.quantity}</p>
                  </fieldset>
                </span>
                <span className="flex flex-row space-x-4 items-center">
                  <fieldset className="space-x-2">
                    <label htmlFor="">dimensions:</label>
                    <p className="text-nowrap">{selected?.dimensions}</p>
                  </fieldset>
                </span>
                <fieldset className="space-x-2">
                  <label htmlFor="">description:</label>
                  <p className="text-nowrap">{selected?.description}</p>
                </fieldset>
              </>
            ) : (
              <h1 className="text-2xl font-medium">
                Select cargo to view inner details
              </h1>
            )}
          </span>
        </span>
      </fieldset>

      <span className="flex flex-row space-x-2">
        <fieldset className="w-full o-black flex flex-row space-x-2">
          <label htmlFor="status">from:</label>
          <input
            id="from"
            type="date"
            onChange={onChange}
            value={data?.from?.split("T")[0]}
          />
        </fieldset>
        <fieldset className="w-full flex flex-row items-center o-black">
          <label htmlFor="">to:</label>
          <input
            id="to"
            type="date"
            onChange={onChange}
            value={data?.to?.split("T")[0]}
          />
        </fieldset>
      </span>

      <span className="flex flex-row space-x-2">
        <fieldset className="w-3/5 o-black flex flex-row space-x-2">
          <label htmlFor="status">status:</label>
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
            <option value="loaded">loaded</option>
            <option value="shipping">shipping</option>
            <option value="arrived">arrived</option>
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
            <small className="ml-2 py-[3px] px-[9px] bg-red-200 rounded-md capitalize font-medium">
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
            <small className="ml-2 py-[3px] px-[9px] bg-green-200 rounded-md capitalize font-medium">
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
        Update Inquiry
      </button>
    </form>
  );
};

export const ViewInquiry = () => {
  let [data, setData] = useState({});
  let { modal } = useSelector((state) => state.ui);

  let [selected, setSelected] = useState({});

  async function getDetails(inquiry) {
    try {
      let response = await request.post("inquiry/get", { inquiry });
      response?.status == 200 ? setData(response?.data?.inquiry) : false;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (modal?.data) {
      let { id: inquiry } = modal?.data;
      getDetails(inquiry);
    }
  }, [modal]);

  return (
    <span className="flex flex-col space-y-2">
      <fieldset className="o-black">
        <label htmlFor="" className="bg-slate-100">
          Title:
        </label>
        <input
          className="bg-slate-100"
          type="text"
          value={data?.name}
          readOnly
        />
      </fieldset>
      <fieldset className="o-black">
        <label htmlFor="" className="bg-slate-100">
          Details:
        </label>
        <input
          className="bg-slate-100"
          type="text"
          value={data?.description}
          readOnly
        />
      </fieldset>

      <fieldset className="flex flex-col o-black items-start">
        <label htmlFor="">
          Cargo Manifest with [{data?.Cargo?.length}] Cargo
        </label>
        <span className="flex flex-row space-x-4 items-center">
          {/* Cargo */}
          <span className="w-max h-[11rem] flex flex-col space-y-2 p-3 overflow-y-scroll overflow-x-none">
            {data?.Cargo?.map((cargo) => {
              return (
                <span
                  key={cargo?.id}
                  className="bg-slate-100 rounded-lg px-3 py-1 cursor-pointer"
                  onClick={() => {
                    setSelected(cargo);
                  }}
                >
                  {cargo?.name}
                </span>
              );
            })}
          </span>

          {/* Separator */}
          <span className="h-[8rem] w-[1px] flex bg-slate-400"></span>

          {/* Details */}
          <span className="flex flex-col -space-y-[.2rem]">
            {Object.entries(selected).length > 0 ? (
              <>
                <h1 className="capitalize text-xl font-medium ml-3 underline">
                  details
                </h1>
                <span className="flex flex-row space-x-4 items-center">
                  <fieldset className="space-x-2">
                    <label htmlFor="">name:</label>
                    <h4>{selected?.name}</h4>
                  </fieldset>
                  <fieldset className="space-x-2">
                    <label htmlFor="">weight:</label>
                    <p className="text-nowrap">{selected?.weight}</p>
                  </fieldset>

                  <fieldset className="space-x-2">
                    <label htmlFor="">quantity:</label>
                    <p className="text-nowrap">{selected?.quantity}</p>
                  </fieldset>
                </span>
                <span className="flex flex-row space-x-4 items-center">
                  <fieldset className="space-x-2">
                    <label htmlFor="">dimensions:</label>
                    <p className="text-nowrap">{selected?.dimensions}</p>
                  </fieldset>
                </span>
                <fieldset className="space-x-2">
                  <label htmlFor="">description:</label>
                  <p className="text-nowrap">{selected?.description}</p>
                </fieldset>
              </>
            ) : (
              <h1 className="text-2xl font-medium">
                Select cargo to view inner details
              </h1>
            )}
          </span>
        </span>
      </fieldset>

      <span className="flex flex-row space-x-2">
        <fieldset className="w-full o-black bg-slate-100 flex flex-row space-x-2">
          <label htmlFor="status">from:</label>
          <input
            id="from"
            className="bg-slate-100"
            type="date"
            value={data?.from?.split("T")[0]}
            readOnly
          />
        </fieldset>
        <fieldset className="w-full flex flex-row bg-slate-100 items-center o-black">
          <label htmlFor="">to:</label>
          <input
            id="to"
            className="bg-slate-100"
            type="date"
            value={data?.to?.split("T")[0]}
            readOnly
          />
        </fieldset>
      </span>

      <span className="flex flex-row space-x-2">
        <fieldset className="w-3/5 o-black flex flex-row bg-slate-100 space-x-2">
          <label htmlFor="status">status:</label>
          <input
            id="status"
            className="capitalize bg-slate-100"
            value={data?.status}
            readOnly
          />
        </fieldset>
        <fieldset className="w-full flex flex-row bg-slate-100 items-center o-black">
          <label htmlFor="">quote:</label>
          <span className="w-full flex flex-row items-center">
            <small className="ml-2 py-[3px] px-[9px] bg-slate-200 rounded-md capitalize font-medium">
              tzs
            </small>
            <input
              id="quote"
              className="bg-slate-100"
              type="number"
              value={data?.quote}
              readOnly
            />
          </span>
        </fieldset>
      </span>

      <span className="flex flex-row space-x-2">
        <fieldset className="w-full flex flex-row bg-slate-100 items-center o-black">
          <label htmlFor="">credit:</label>
          <span className="flex flex-row items-center">
            <small className="ml-2 py-[3px] px-[9px] bg-red-200 rounded-md capitalize font-medium">
              tzs
            </small>
            <input
              id="credit"
              className="bg-slate-100"
              type="number"
              value={data?.credit}
              placeholder={"Your price quote"}
              readOnly
            />
          </span>
        </fieldset>
        <fieldset className="w-full flex flex-row bg-slate-100 items-center o-black">
          <label htmlFor="">debit:</label>
          <span className="flex flex-row items-center">
            <small className="ml-2 py-[3px] px-[9px] bg-green-200 rounded-md capitalize font-medium">
              tzs
            </small>
            <input
              id="debit"
              className="bg-slate-100"
              type="number"
              value={data?.debit}
              placeholder={"Your price quote"}
              readOnly
            />
          </span>
        </fieldset>
      </span>
    </span>
  );
};
