/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import PackageSVG from "@/assets/icons/package.svg?react";
import { CircularProgressbar } from "react-circular-progressbar";
import { useTranslation } from "react-i18next";

// This helper function remains the same
function timeLeftFormat(timeLeft) {
  const {t}=useTranslation()
  if (timeLeft < 0) return "0d 0h 0mins 0secs"; // Handle expired case
  timeLeft = Math.floor(timeLeft / 1000);
  const days = Math.floor(timeLeft / (3600 * 24));
  const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  return `${days}${t("d")} ${hours}${t("h")} ${minutes}${t("mins")} ${seconds}${t("secs")}`;
}

const ExpiryBox = ({ expiryDate, issuedDate, revoked, rejected }) => {
  // 1. Convert props to Date objects immediately for reliable calculations
  const expiry = new Date(expiryDate);
  const issued = new Date(issuedDate);
  const {t}=useTranslation()
  // 2. Correctly calculate the total duration (end - start)
  const totalDuration = expiry - issued;

  // 3. Initialize timeLeft state with a function to ensure it runs only once
  const [timeLeft, setTimeLeft] = useState(() => expiry - new Date());

  // 4. Use a single, robust useEffect for the timer
  useEffect(() => {
    // If the fuldmagt is revoked, rejected, or already expired, don't start the timer.
    if (revoked || rejected === "rejected" || timeLeft <= 0) {
      return;
    }

    // Use setInterval to update the time every second
    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1000);
    }, 1000);

    // This is the cleanup function: it runs when the component unmounts
    // or when the dependencies change. It stops the timer.
    return () => clearInterval(intervalId);

  }, [expiry, revoked, rejected]); // Rerun effect only if these props change

  // Calculate the percentage based on the current timeLeft
  const percentage = Math.max(0, (timeLeft / totalDuration) * 100);

  return (
    <div className="w-full flex items-center justify-between bg-black text-white p-4 rounded-lg md:w-[500px]">
      <div className="flex items-center">
        <div className="p-2 bg-gray-800 rounded-lg">
          <PackageSVG className="text-white fill-current stroke-current h-[40px] w-[40px]" />
        </div>
        <div className="ml-4">
          {revoked ? (
            <span className="text-gray-400 font-semibold">{t("Revoked")}</span>
          ) : rejected === "rejected" ? (
            <span className="text-gray-400 font-semibold">{t("Rejected")}</span>
          ) : timeLeft > 0 ? (
            <>
              <span className="text-gray-400">{t("expires_in")}</span>
              <div>{timeLeftFormat(timeLeft)}</div>
            </>
          ) : (
            <span className="text-gray-400 font-semibold">{t("Expired")}</span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center h-10 w-10 text-secondary">
        <CircularProgressbar 
            value={!revoked && rejected !== "rejected" ? percentage : 0} 
            text={""} 
        />
      </div>
    </div>
  );
};

export default ExpiryBox;