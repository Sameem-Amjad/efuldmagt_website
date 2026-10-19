// CHANGE: Added useTranslation import
import React from "react";
import { useTranslation } from "react-i18next";

const ServiceComponent = (props) => {
  // CHANGE: Initialized the translation function
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-3xl p-5 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] relative">
        {/* Close Button */}
        <button
          onClick={() => props.setServiceOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <span className="text-xl font-bold">×</span>
        </button>

        {/* Header Section */}
        <div className="flex items-center space-x-2 my-3">
          {/* CHANGE: Added translation (using your existing 'Term of Service' key) */}
          <p className="text-lg md:text-3xl font-bold">{t("Term of Service")}</p>
        </div>

        {/* Content Section */}
        {/* CHANGE: Added translation */}
        <h2 className="mt-6 text-lg font-bold">{t("Introduction")}</h2>
        {/* CHANGE: Added translation */}
        <p className="mt-3 font-md">
          {t(
            "Thank you for using e-fuldmagt, a Power of Attorney application designed to facilitate the creation and management of Power of Attorney documents. The following terms of service govern your use of the app."
          )}
        </p>
        {/* CHANGE: Added translation */}
        <h2 className="mt-6 text-lg font-bold">{t("Accepting of Terms")}</h2>
        {/* CHANGE: Added translation */}
        <p className="mt-3 font-md">
          {t(
            "By accessing or using e-fuldmagt, you agree to comply with and be bound by these terms of service. If you do not agree with any part of these terms, you may not use the app."
          )}
          {/* CHANGE: Fixed stray </Entry> tag to be </p> */}
        </p>
        {/* CHANGE: Added translation */}
        <h2 className="mt-6 text-lg font-bold">{t("Use Of the App")}</h2>
        {/* CHANGE: Added translation */}
        <p className="mt-3 font-md">
          {t(
            "Eligibility: You must be of legal age and capacity in your jurisdiction to create and manage a Power of Attorney document. Account Creation: You may need to create an account to use certain features of the app. You are responsible for maintaining the security of your account and are liable for all activities that occur under your account."
          )}
        </p>
        {/* CHANGE: Added translation */}
        <p className="mt-12 text-lg font-bold text-center">
          {t("Power of Attorney Documents")}
        </p>
        <div className="flex justify-center w-full space-x-6">
        </div>
      </div>
    </div>
  );
};

export default ServiceComponent;

