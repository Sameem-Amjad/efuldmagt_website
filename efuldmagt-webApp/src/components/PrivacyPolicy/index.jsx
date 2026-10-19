import React from "react";
import { useTranslation } from "react-i18next";
const PrivacyPolicy = (props) => {
  const {t}=useTranslation()
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-3xl p-5 rounded-lg shadow-lg overflow-y-auto max-h-[90vh] relative">
        <button
          onClick={() => props.setPrivacyOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <span className="text-xl font-bold">×</span>
        </button>

        <div className="flex items-center space-x-2 my-3">
          <p className="text-lg md:text-3xl font-bold">{t("Privacy Policy")}</p>
        </div>

        <h2 className="mt-6 text-lg font-bold">{t("Introduction")}</h2>
        <p className="mt-3 font-md">
{t(
            "Welcome to the Privacy Policy for e- fuldmagt. This policy explains how we collect, use, and protect your personal information when you use our Power of Attorney application."
          )}
        </p>
        <h2 className="mt-6 text-lg font-bold">{t("Information we Collect")}</h2>
        <p className="mt-3 font-md">
          <span className="font-bold">{t("Personal Information")}</span> {t("personal_info_description")}
        </p>
        <p className="mt-3 font-md">
          <span className="font-bold">{t("Usage Information")}</span> {t("usage_info_description")}
        </p>
        <h2 className="mt-6 text-lg font-bold">{t("How we use your Information")}</h2>
        <p className="mt-3 font-md">
          <span className="font-bold">{t("Providing Services")} </span>{t("providing_services_description")}
        </p>
        <p className="mt-3 font-md">
          <span className="font-bold">{t("Communication")}:</span> {t("communication_description")}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
