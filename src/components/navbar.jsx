import Image from "next/image";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { IoIosNotifications as Notification } from "react-icons/io";

const Navbar = () => {
  return (
    <nav className="w-full flex flex-row justify-between p-6">
      <span></span>
      <h2 className="ml-20 font-bold text-3xl">
        Your <span className="text-slate-600">Logo</span> Here
      </h2>
      <span className="flex flex-row items-center justify-center space-x-4">
        <Notification className="cursor-pointer" size={25} />
        <Profile />
      </span>
    </nav>
  );
};

const Profile = () => {
  let { data, status } = useSession();
  const [active, setActive] = useState(false);

  const Details = ({ name = "", email = "" }) => {
    return (
      <span
        className={`${
          active && status === "authenticated" ? "flex" : "hidden"
        } absolute -bottom-[9rem] right-0 flex-col p-2 space-y-2 items-start justify-center bg-white drop-shadow-xl rounded-lg`}
      >
        <p>{name}</p>
        <p className="bg-slate-100 rounded-sm p-2 font-medium">{email}</p>
        <button
          className="w-full s-black"
          onClick={async () => {
            await signOut("google");
          }}
        >
          logout
        </button>
      </span>
    );
  };

  return (
    <span className="w-max h-max relative">
      <img
        onClick={() => setActive(!active)}
        //
        className="rounded-full"
        src={status === "authenticated" ? data?.user?.image : "/profile.jpeg"}
        width={"40px"}
        height={"40px"}
        alt="Profile image"
      />
      {status === "authenticated" && <Details {...data.user} />}
    </span>
  );
};

export default Navbar;
