import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="flex flex-row justify-between">
      <span>{/* Empty Slot */}</span>
      <h6>Gadget Support</h6>
      <span className="flex flex-row justify-center space-x-4">
        <button>notifications</button>
        <button>profile</button>
      </span>
    </nav>
  );
};

export default Navbar;
