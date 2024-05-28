import Image from "next/image";
import { signIn, useSession } from "next-auth/react";

// Icon
import { FaApple as Apple } from "react-icons/fa";
import { FcGoogle as Google } from "react-icons/fc";

const Placeholder = () => {
  let { status } = useSession();

  return (
    <div className="w-screen h-[55vh] flex flex-col justify-end items-center">
      <span className="flex flex-col justify-center items-center space-y-12">
        {/* Placeholders */}
        <Image
          src={"/placeholder.svg"}
          width={500}
          height={500}
          alt="Placeholder"
        />

        {/* Call to actions */}
        {status === "unauthenticated" ? <UserActions /> : ""}
      </span>
    </div>
  );
};

const UserActions = () => {
  return (
    <span className="flex flex-row space-x-1 mr-3">
      <button
        className="s-black"
        onClick={async () => {
          await signIn("google");
        }}
      >
        <p>sign in</p>
        <Google className="ml-4" size={20} />{" "}
      </button>
      <button
        className="s-black"
        onClick={async () => {
          await signIn("apple");
        }}
      >
        <p>sign in</p>
        <Apple className="ml-4" size={20} />
      </button>
    </span>
  );
};

export default Placeholder;
