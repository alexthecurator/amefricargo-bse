const Card = ({ title = "", caption = "", details = "" }) => {
  return (
    <span className="w-full flex flex-col space-y-4 p-4 bg-white rounded-lg drop-shadow-lg">
      <span className="flex flex-col space-y-1">
        <h3 className="text-2xl">{title}</h3>
        <small className="font-light">{caption}</small>
      </span>
      <p className="font-light">{details}</p>
    </span>
  );
};

export default Card;
