import { useState } from "react";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../../components/global/Loaders/Loader";
import { useTranslation } from "react-i18next";

const RevokeConfirmationModal = ({
  isOpen,
  setIsOpen,
  callBackFunction,
  fuldmagt,
}) => {
  // 1. FIX: Call HOOKS UNCONDITIONALLY at the top level
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(); // MOVED UP

  // 2. Perform early return using the state
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
          t("error_revoking_fuldmagt")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[350px]">
        {/* Close Button */}
        <div className="flex justify-end">
          <button
            disabled={loading}
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
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

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8 text-blue-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3M16 7V3M4 11h16M4 19h16m-7-6h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-6m-4 0H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h6"
              />
            </svg>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mt-3">
            {t("confirm_revoke_title")}
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-sm mt-2 px-4">
            Are you sure you want to revoke{" "}
            <strong>“{fuldmagt.agentName}”</strong> before it expires? This
            action will take effect immediately.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setIsOpen(false)}
            disabled={loading}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 disabled:bg-opacity-50 disabled:cursor-not-allowed"
          >
            {t("Cancel")}
          </button>
          <button
            disabled={loading}
            onClick={handleRevoke}
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-opacity-50 disabled:cursor-not-allowed"
          >
            {t("Confirm")} {loading && <LoadingSpinner />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevokeConfirmationModal;