import { useState } from "react";
import { toast } from "react-toastify";
import { deleteUserAccount } from "../../../services/authentication.services";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../global/Loaders/Loader";
import { useTranslation } from "react-i18next";


export const AccountDeleteConfirmationModal = ({ isOpen, setIsOpen }) => {

  const {t}=useTranslation()
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const res = await deleteUserAccount(token);
      console.log("res: ", res);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      navigate("/signin");
    } catch (error) {
      console.log("error: ", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("error_deleting_account")
      );
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-hidden={!isOpen}
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
        onClick={(e) => e.stopPropagation()} 
        
      >

        <div className="flex justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
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
        </div>

        {/* Warning Icon */}
        <div className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-10 h-10 text-red-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3M16 7V3M4 11h16M4 19h16m-7-6h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-6m-4 0H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h6"
            />
          </svg>
        </div>

        {/* Warning Text */}
        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            {t("delete_account_warning_part1")}{" "}
            <span className="text-red-700 font-bold">delete</span> {t("delete_account_warning_part2")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            className="w-full px-4 py-2 font-semibold bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-opacity-50"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            {t("Cancel")}
          </button>
          <button
            className="w-full px-4 py-2 font-semibold bg-red-700 text-white rounded-md hover:bg-red-800 disabled:opacity-50"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {t("Delete")} {loading && <LoadingSpinner />}
          </button>
        </div>
      </div>
    </div>
  );
};
