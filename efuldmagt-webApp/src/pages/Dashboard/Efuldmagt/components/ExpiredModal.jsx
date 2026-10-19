import { formatDate } from "@/utils/functions/datefunctions";
import { useState } from "react";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../../components/global/Loaders/Loader";
import { useTranslation } from "react-i18next";
const ExpiredModal = ({ expiredDate, isOpen, setIsOpen, callBackFunction }) => {

  const {t}=useTranslation()
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null; // Prevent rendering when modal is closed

  const handleExpire = async () => {
    try {
      setLoading(true);
      await callBackFunction();
    } catch (error) {
      console.log("error: ", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("error_revoking_fuldmagt")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
        {/* Close Button inside the modal */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
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

        {/* Modal Content */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">{t("Expired")}</h2>
          <div className="flex items-center justify-center mt-2">
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
              {formatDate(expiredDate)}
            </span>
          </div>
          <button
            onClick={handleExpire}
            disabled={loading}
            className="mt-6 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-opacity-50"
          >
            {t("issue_again")} {loading && <LoadingSpinner color={"#08b8c4"} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpiredModal;
