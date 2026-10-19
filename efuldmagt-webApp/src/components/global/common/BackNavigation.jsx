import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const BackNavigation = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row items-center gap-4 mb-5">
      <button
        onClick={() => navigate(-1)}
        className="font-semibold text-2xl py-2 px-4 hover:bg-gray-200 rounded-md"
      >
        <IoArrowBack />
      </button>
      <h2 className="font-semibold">{title}</h2>
    </div>
  );
};

export default BackNavigation;
