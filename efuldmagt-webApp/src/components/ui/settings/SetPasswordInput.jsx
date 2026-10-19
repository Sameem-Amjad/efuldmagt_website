import { useState } from "react";
import CloseSVG from "../../../assets/icons/close.svg?react";
import OTPInput from "../../global/OtpInput/otpInput";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  changePassword,
  verifyPassword,
} from "../../../services/authentication.services";
import { LoadingSpinner } from "../../global/Loaders/Loader";
import { useTranslation } from "react-i18next";

export default function SetPasswordInput() {
  const { t } = useTranslation();

  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const [passcodeConfirmed, setPasscodeConfirmed] = useState(false);
  const [newPassCodeSubmitted, setNewPasscodeSubmitted] = useState(false);
  const [passcode, setPasscode] = useState(new Array(4).fill(""));
  const [newPasscode, setNewPasscode] = useState(new Array(4).fill(""));
  const [confirmPasscode, setConfirmPasscode] = useState(new Array(4).fill(""));
  const [loading, setLoading] = useState(false);
 
  const user = useSelector((state) => state.user.user);

// Helper to calculate dynamic "Time Ago" (Singular vs Plural)
  const getLastUpdatedText = () => {
    if (!user?.lastUpdatedPassword) return t("never_updated");

    const now = new Date();
    const lastUpdate = new Date(user.lastUpdatedPassword);
    
    const diffInTime = now.getTime() - lastUpdate.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

    if (diffInDays <= 30) {
      if (diffInDays === 1) {
        return t("last_updated_day_ago", { count: 1 });
      } else if (diffInDays === 0) {
        return t("last_updated_today"); 
      } else {
        return t("last_updated_days_ago", { count: diffInDays });
      }
    } else {
      const diffInMonths = Math.floor(diffInDays / 30);
      
      if (diffInMonths === 1) {
        return t("last_updated_months_ago_one", { count: 1 });
      } else {
        return t("last_updated_months_ago_other", { count: diffInMonths });
      }
    }
  };

  const lastUpdatedText = getLastUpdatedText();

  const verifyPasscode = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await verifyPassword(token, { pin: passcode.join("") });
      console.log("res: ", res);
      setPasscodeConfirmed(true);
      toast.info(t("passcode_verified_toast"));
    } catch (error) {
      console.log("error: ", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("error_verifying_passcode_toast")
      );
    } finally {
      setLoading(false);
    }
  };

  const submitNewPasscode = () => {
    setNewPasscodeSubmitted(true);
  };

  const updatePasscode = async (e) => {
    e.preventDefault();
    let isEqual = newPasscode.join("") === confirmPasscode.join("");

    if (!isEqual) {
      toast.error(t("passcode_mismatch_toast"));
      return;
    }

    try {
      setLoading(true);
      const res = await changePassword(token, {
        oldPin: passcode.join(""),
        newPin: newPasscode.join(""),
      });

      console.log("res: ", res);
      toast.success(t("passcode_updated_toast"));
    } catch (error) {
      console.log("error: ", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("error_updating_passcode_toast")
      );
    } finally {
      setLoading(false);
    }

    setPasscodeConfirmed(false);
    setNewPasscodeSubmitted(false);
    setIsOpen(false);
    setPasscode(new Array(4).fill(""));
    setNewPasscode(new Array(4).fill(""));
    setConfirmPasscode(new Array(4).fill(""));
  };

  return (
    <div className="bg-white">
      {/* Header Section */}
      <div
        className="outline-1 outline-gray-400 outline rounded-md flex items-center justify-between p-4 cursor-pointer shadow-md"
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
            <h3 className="text-lg font-medium text-gray-900">Passcode</h3>
            <p className="text-sm text-gray-500">{lastUpdatedText}</p>
          </div>
        </div>
        <div>
          <button className="text-blue-500 font-medium hover:underline">
            {t("Change")}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="hidden md:block">
          <p className="text-md font-semibold mt-4">{t("enter_old_passcode_prompt")}</p>
          {!passcodeConfirmed && (
            <form
              className="flex flex-col space-y-2 mt-4"
              onSubmit={verifyPasscode}
            >
              <p className="text-sm">
                {t("enter_old_passcode_prompt")}
              </p>
              <OTPInput otp={passcode} setOtp={setPasscode} />
              <button
                disabled={loading}
                type="submit"
                className="btn-primary w-[200px] disabled:bg-opacity-50"
              >
                {t("Verify")} {loading && <LoadingSpinner />}
              </button>
            </form>
          )}
          {passcodeConfirmed && (
            <form
              className="flex flex-col space-y-2 mt-4"
              onSubmit={updatePasscode}
            >
              <p className="text-base">Please Enter New Passcode</p>
              <OTPInput otp={newPasscode} setOtp={setNewPasscode} />
              <p className="text-base">Please Re-enter New Passcode</p>
              <OTPInput otp={confirmPasscode} setOtp={setConfirmPasscode} />
              <button
                disabled={loading}
                type="submit"
                className="btn-primary w-[200px] disabled:bg-opacity-50"
              >
                Update Passcode {loading && <LoadingSpinner />}
              </button>
            </form>
          )}
        </div>
      )}

      {isOpen && (
        <div className="z-20 fixed md:hidden h-screen w-screen top-0 left-0">
          <div className="flex flex-col justify-end h-full">
            <div
              className="w-full h-full bg-white bg-opacity-40"
              onClick={toggleDropdown}
            >
              {/* Giving White Space */}
            </div>
            <div className="py-4 w-full border border-solid bg-white rounded-t-[30px]">
              <div className="relative">
                <div
                  className="absolute right-4 hover:cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <CloseSVG />
                </div>
                <div className="text-center m-3 mx-6 space-y-2">
                  <p className="text-md font-semibold mt-4">Update Password</p>
                  {!passcodeConfirmed && (
                    <form
                      className="flex flex-col items-center space-y-4"
                      onSubmit={verifyPasscode}
                    >
                      <p className="text-sm">
                        Please enter your old passcode first to update the
                        passcode.
                      </p>
                      <OTPInput otp={passcode} setOtp={setPasscode} />
                      <button type="submit" className="btn-primary w-[200px]">
                        Verify
                      </button>
                    </form>
                  )}
                  {passcodeConfirmed && !newPassCodeSubmitted && (
                    <form
                      className="flex flex-col items-center space-y-4"
                      onSubmit={submitNewPasscode}
                    >
                      <p className="text-sm">{t("enter_new_passcode_prompt")}</p>
                      <OTPInput otp={newPasscode} setOtp={setNewPasscode} />
                      <button type="submit" className="btn-primary w-[200px]">
                        Update Passcode
                      </button>
                    </form>
                  )}
                  {passcodeConfirmed && newPassCodeSubmitted && (
                    <form
                      className="flex flex-col items-center space-y-4"
                      onSubmit={updatePasscode}
                    >
                      <p className="text-sm">{t("reenter_new_passcode_prompt")}</p>
                      <OTPInput
                        otp={confirmPasscode}
                        setOtp={setConfirmPasscode}
                      />
                      <button type="submit" className="btn-primary w-[200px]">
                        {t("update_passcode_button")}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
