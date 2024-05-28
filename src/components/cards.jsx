const Card = ({ device = "", problem = "", technician = "", status = "" }) => {
  return (
    <span className="w-full flex flex-col space-y-4 p-4 bg-white rounded-lg drop-shadow-lg">
      <span className="flex flex-col space-y-1">
        <h3 className="text-2xl">{device}</h3>
        <small className="font-light">{technician}</small>
      </span>
      <p className="font-light">{problem}</p>
      <p className="font-light">{status}</p>
    </span>
  );
};

export default Card;
