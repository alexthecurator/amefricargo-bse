import { IoCloseCircleSharp as Close } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../../store/ui";

const Modal = ({ children }) => {
  let dispatch = useDispatch();
  let { on, id } = useSelector((state) => state.ui.modal);

  return (
    <div
      id={id}
      tabIndex="-1"
      aria-hidden="true"
      className={`w-screen h-screen ${
        on ? "fixed" : "hidden"
      } top-0 left-0 z-10 bg-black/[0.1] backdrop-blur-sm`}
    >
      <div className="w-full relative max-w-[40%] bg-white rounded-lg p-2 fixed z-20 left-[50%] -translate-x-[50%] top-[50%] -translate-y-[50%]">
        <button
          type="button"
          onClick={() => {
            dispatch(toggle({ origin: "modal", status: { on: false, id } }));
          }}
          className="absolute -right-12 -top-12"
        >
          {" "}
          <Close size={32} />{" "}
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
