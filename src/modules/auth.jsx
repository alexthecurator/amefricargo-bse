// Auth
import { signIn } from "next-auth/react";

// Forms
import { CredentialLogin } from "./form";

// Redux
import { toggle } from "@/store/ui";
import { useDispatch } from "react-redux";

// Icon
import { FaApple as Apple } from "react-icons/fa";
import { FcGoogle as Google } from "react-icons/fc";

const SignIn = () => {
  const dispatch = useDispatch();

  return (
    <div className="w-full h-max flex flex-col justify-end items-center space-y-4">
      <span className="w-full flex flex-col items-center space-y-4">
        {/* Title & Caption */}
        <span className="flex flex-col justify-center items-center space-y-2">
          <h2 className="text-5xl font-bold">Welcome</h2>
          <p>Connect with your clients at ease</p>
        </span>
        {/*  */}
        <CredentialLogin />
        {/* Sign up */}
        <small>
          Dont have an account?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => {
              dispatch(
                toggle({
                  origin: "modal",
                  status: { on: true, id: "sign-up" },
                })
              );
            }}
          >
            Click here
          </span>{" "}
          to sign up
        </small>
      </span>

      <h4 className="uppercase">or</h4>

      <span className="w-full">
        <ProviderLogin />
      </span>
    </div>
  );
};

const ProviderLogin = () => {
  return (
    <span className="w-full flex flex-row space-x-4">
      <button
        className="w-full s-black"
        onClick={async () => {
          await signIn("google");
        }}
      >
        <p>sign in</p>
        <Google className="ml-3" size={20} />{" "}
      </button>
    </span>
  );
};

export default SignIn;
