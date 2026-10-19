import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// This is a self-contained component for the checkmark icon
const CheckIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-primary"
  >
    <path
      d="M20 6L9 17L4 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BackArrowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: "scaleX(-1)" }} // Flips the arrow to point left
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChangeLanguage = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const currentLanguage = i18n.language;

  const isEnglish = currentLanguage.startsWith('en');
  const isDanish = currentLanguage.startsWith('da');

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 mr-2 rounded-full hover:bg-gray-100"
          aria-label="Go back"
        >
          <BackArrowIcon />
        </button>
        <h1 className="text-xl font-bold">Change Language</h1>
      </div>

      {/* Language Options List */}
      <div className="space-y-3">
        {/* English Option */}
        <button
          onClick={() => handleLanguageChange("en")}
          className={`flex justify-between items-center w-full text-left p-4 border rounded-lg transition-colors duration-150 ${
            isEnglish
              ? "border-primary bg-primary bg-opacity-10 font-semibold"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <span>English</span>
          {isEnglish && <CheckIcon />}
        </button>

        {/* Danish Option */}
        <button
          onClick={() => handleLanguageChange("da")}
          className={`flex justify-between items-center w-full text-left p-4 border rounded-lg transition-colors duration-150 ${
            isDanish
              ? "border-primary bg-primary bg-opacity-10 font-semibold"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <span>Dansk (Danish)</span>
          {isDanish && <CheckIcon />}
        </button>
      </div>
    </div>
  );
};

export default ChangeLanguage;
