import { formatDate } from "@/utils/functions/datefunctions";
import { memo, useState } from "react";
import { LoadingSpinner } from "../../../../components/global/Loaders/Loader";
import { toast } from "react-toastify";

const RevokeModal = ({ revokedDate, isOpen, setIsOpen, callBackFunction }) => {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const handleRevoke = async () => {
    try {
      setLoading(true);
      await callBackFunction();
    } catch (error) {
      console.log("error: ", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "error revoking fuldmagt"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white max-w-sm w-full p-6 rounded-lg shadow-lg">
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Revoke</h2>

          {/* Date Display */}
          <div className="flex items-center justify-center mt-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3M16 7V3M4 11h16M4 19h16m-7-6h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-6m-4 0H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h6"
                />
              </svg>
            </div>
            <span className="ml-3 text-gray-600">
              {formatDate(revokedDate)}
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={handleRevoke}
            disabled={loading}
            className="mt-6 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-opacity-50"
          >
            Issue Again {loading && <LoadingSpinner color={"#08b8c4"} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(RevokeModal);
