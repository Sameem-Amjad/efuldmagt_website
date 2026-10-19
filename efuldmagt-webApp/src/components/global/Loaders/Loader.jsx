import { ClipLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <ClipLoader
        color={"#08b8c4"}
        loading={true}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
        speedMultiplier={1.5}
      />
    </div>
  );
};

export const LoadingSpinner = ({ color = "#fff" }) => {
  return (
    <ClipLoader
      color={color}
      loading={true}
      size={12}
      aria-label="Loading Spinner"
      data-testid="loader"
      speedMultiplier={1.5}
    />
  );
};

export default Loader;
