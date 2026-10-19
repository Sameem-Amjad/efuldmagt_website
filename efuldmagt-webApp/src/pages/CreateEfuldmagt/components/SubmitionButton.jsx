/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../../components/global/Loaders/Loader";

const SubmitionButton = ({ isRequest, credentials = {}, loading }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row justify-center items-center mt-4 gap-3 pb-5 w-full">
      {/* Cancel Button */}
      <button
        type="button"
        onClick={() => navigate("/")}
        disabled={loading}
        className="order-last md:order-first w-[250px] h-[50px] outline outline-1 outline-gray-300 rounded-lg font-bold"
      >
        Cancel
      </button>

      {/* Request Button */}
      {isRequest ? (
        <button
          type="submit"
          disabled={loading}
          className="w-[250px] h-[50px] rounded-lg font-semibold text-white bg-primary disabled:bg-opacity-50"
        >
          Send Request {loading && <LoadingSpinner />}
        </button>
      ) : credentials?.company ? (
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-[335px] h-[86px] rounded-lg outline outline-1 outline-gray-300"
        >
          <div className="flex h-full">
            {/* User & Company Details */}
            <div className="w-[107px]">
              {credentials.selected === "user" ? (
                <>
                  <div className="flex flex-col justify-center items-center h-[57px] w-full bg-primary/20">
                    <img
                      src={credentials?.user?.image}
                      alt="User"
                      className="w-[27px] h-[27px] rounded-full object-cover"
                    />
                    <p className="text-xs">
                      {`${credentials?.user?.name?.firstName || ""} ${credentials?.user?.name?.lastName || ""
                        }`}
                    </p>
                  </div>
                  {credentials.company && (
                    <div className="flex flex-col justify-center items-center w-full h-[29px]">
                      <p className="text-[8px]">
                        {credentials.company.companyName}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex flex-col justify-center items-center w-full h-[29px]">
                    <p className="text-[8px]">
                      {`${credentials?.user?.name?.firstName || ""} ${credentials?.user?.name?.lastName || ""
                        }`}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center items-center h-[57px] w-full bg-primary/20">
                    <img
                      src={credentials?.company?.image}
                      alt="Company"
                      className="w-[27px] h-[27px] rounded-full object-cover"
                    />
                    <p className="text-xs">
                      {credentials?.company?.companyName}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Sign Now Button */}
            <div className="flex w-full h-full bg-primary rounded-r-lg items-center justify-center text-md font-bold text-white disabled:bg-opacity-50">
              Sign Now {loading && <LoadingSpinner />}
            </div>
          </div>
        </button>
      ) : (
        <button
          type="submit"
          className="w-[250px] h-[50px] rounded-lg font-semibold text-white bg-primary disabled:bg-opacity-50"
          disabled={loading}
        >
          Sign Now {loading && <LoadingSpinner />}
        </button>
      )}
    </div>
  );
};

export default SubmitionButton;
