/* eslint-disable react/prop-types */
import { useState } from "react";
import CloseSVG from "../../../assets/icons/close.svg?react";
import { useTranslation } from "react-i18next";

export default function SetNotificationItem({
  header,
  subHeadingText,
  text,
  notification,
  handleEmailChange,
  handlePushNotificationChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const {t}=useTranslation()
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white shadow-md rounded-lg">
      {/* Header Section */}
      <div
        className="outline-1 outline-gray-400 outline rounded-md flex items-center justify-between p-4 cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{header}</h3>
            <p className="text-sm text-gray-500">
              {t("email_and_push")}
            </p>
          </div>
        </div>
        <div>
          <button className="text-blue-500 font-medium hover:underline">
            {t("Change")}
          </button>
        </div>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="hidden overflow-hidden md:flex flex-col justify-center items-center p-4 border-t border-gray-200 rounded-b-lg bg-[#77D8FF] bg-opacity-5">
          <div className="flex flex-col justify-center items-center w-4/5 lg:w-3/5 space-y-4">
            <h4 className="text-lg font-bold text-gray-700 mb-2">
              {subHeadingText}
            </h4>
            <p className="text-sm text-gray-500 mb-4">{text}</p>
            <div className="flex items-center justify-between mb-3 w-full">
              <span className="text-gray-700 font-semibold">
                {t("email_notification")}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={notification?.email}
                  onChange={() => {
                    handleEmailChange(!notification?.email);
                  }}
                />
                <div
                  className={`relative w-10 h-6 bg-gray-200 rounded-full ${
                    notification?.email ? "bg-primary" : ""
                  }`}
                >
                  <div
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notification?.email ? "transform translate-x-4" : ""
                    }`}
                  ></div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between w-full">
              <span className="text-gray-700 font-semibold">
                {t("push_notifications")}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={notification?.pushNotification}
                  onChange={() =>
                    handlePushNotificationChange(
                      !notification?.pushNotification
                    )
                  }
                />
                <div
                  className={`relative w-10 h-6 bg-gray-200 rounded-full ${
                    notification?.pushNotification ? "bg-primary" : ""
                  }`}
                >
                  <div
                    className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notification?.pushNotification
                        ? "transform translate-x-4"
                        : ""
                    }`}
                  ></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="z-[40] md:hidden fixed top-0 left-0 h-screen w-screen">
          <div className="flex flex-col justify-end h-full">
            <div
              className="w-full h-full bg-white bg-opacity-40"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              {/* Giving White Space */}
            </div>
            <div className="py-8 w-full border border-solid bg-white rounded-t-[30px]">
              <div className="relative">
                <div
                  className="absolute top-2 left-4 hover:cursor-pointer"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <CloseSVG />
                </div>
                <div className="text-center m-3 mx-6 space-y-5">
                  <div className="text-md font-semibold">{subHeadingText}</div>
                  <div className="text-justify text-base">{text}</div>

                  {/* Email Toggle here */}
                  <div className="flex items-center justify-between mb-3 w-full">
                    <span className="text-gray-700 font-semibold">
                      E-mail Notification
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={notification?.email}
                        onChange={() => {
                          handleEmailChange(!notification?.email);
                        }}
                      />
                      <div
                        className={`relative w-10 h-6 bg-gray-200 rounded-full ${
                          notification?.email ? "bg-primary" : ""
                        }`}
                      >
                        <div
                          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            notification?.email ? "transform translate-x-4" : ""
                          }`}
                        ></div>
                      </div>
                    </label>
                  </div>

                  {/* Notification Toggle here */}
                  <div className="flex items-center justify-between w-full">
                    <span className="text-gray-700 font-semibold">
                      Push Notifications
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={notification?.pushNotification}
                        onChange={() =>
                          handlePushNotificationChange(
                            !notification?.pushNotification
                          )
                        }
                      />
                      <div
                        className={`relative w-10 h-6 bg-gray-200 rounded-full ${
                          notification?.pushNotification ? "bg-primary" : ""
                        }`}
                      >
                        <div
                          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            notification?.pushNotification
                              ? "transform translate-x-4"
                              : ""
                          }`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
