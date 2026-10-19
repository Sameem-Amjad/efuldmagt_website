import topImage from "../../../assets/registration/Vector.png";
import React, { useEffect, useState, useCallback } from "react";
import OTPInput from "../../../components/global/OtpInput/otpInput";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  sendOTP,
  verifySignupOTP,
} from "../../../services/authentication.services";
import { LoadingSpinner } from "../../../components/global/Loaders/Loader";
import { useTranslation } from "react-i18next";

const OtpVerifications = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const email = location?.state?.email;
  const [encryptedOTPToken, setEncryptedOTPToken] = useState(
    location?.state?.encryptedToken
  );

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [time, setTime] = useState(60);
  const [isOTPValid, setIsOTPValid] = useState(false);

  useEffect(() => {
    if (time <= 0) return;

    const timer = setTimeout(() => setTime((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [time]);

  useEffect(() => {
    setIsOTPValid(otp.join("").length === 4);
  }, [otp]);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const res = await verifySignupOTP({
          encryptedOTPToken: encryptedOTPToken,
          otp: otp.join(""),
        });
        console.log("res: ", res);

        toast.success(t("email_verified_successfully_toast"));

        navigate("/signup/phone", {
          state: {
            email: email,
            emailCredentialsToken: res?.data?.data?.credentialsToken,
          },
        });
      } catch (error) {
       console.log("error: ", error);
        const errorMessage = error?.response?.data?.message;
        if (errorMessage === "Token has expired") {
            toast.error(t("session_expired_toast", "Your session has expired. Please try again."));
            navigate("/signup"); // Navigate back to signup
        } else {
            toast.error(errorMessage || t("an_error_occurred", "An unknown error occurred."));
        }
      } finally {
        setLoading(false);
      }
    },
    [email, encryptedOTPToken, navigate, otp]
  );

  // Resend OTP
  const resendCode = useCallback(async () => {
    try {
      setOtp(new Array(4).fill(""));
      const res = await sendOTP({
        email: email,
      });

      if (res.status === 200) {
        toast.success(t("new_otp_sent_toast"));
        setEncryptedOTPToken(res?.data?.data?.encryptedOTPToken);
      }
      setTime(60);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [email]);

  return (
    <div className="relative flex flex-col py-12 align-middle w-full md:w-1/2 overflow-auto">
      <img
        className="absolute z-[0] top-0 right-0 w-4/5"
        src={topImage}
        alt="top vector"
      />
      <div className="flex justify-center">
        <div className="z-[1] h-1/2 align-middle w-9/12 md:w-8/12 lg:w-7/12">
          <h2 className="text-sm font-semibold text-muted">
        {t("welcome_to_attorney")}
          </h2>
          <h3 className="text-lg font-bold mt-0 text-primary">{t("Sign up")}</h3>

          <div className="mt-6">
            <label className="block text-md font-semibold">{t("Email")}</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full mt-2 txt-field-primary text-muted disabled:bg-gray-300"
            />
          </div>

          <p className="text-xs text-muted mt-2">
            {t("we_will_send_email_verification_code")}
          </p>

          <form onSubmit={onSubmit}>
            <div className="flex flex-col items-center mt-1">
              <label className="block text-xl font-bold mt-4">
          {t("otp_verification_title")}
              </label>
              <p className="text-sm my-2">
            {t("otp_prompt_email")}
              </p>

              <div className="w-full flex flex-col items-center">
                <OTPInput className="my-3" otp={otp} setOtp={setOtp} />
                <p className="text-center text-xs">
                  {t("remaining_time")}{" "}
                  <span className="text-secondary">
                    {String(Math.floor(time / 60)).padStart(2, "0")}:
                    {String(time % 60).padStart(2, "0")}
                  </span>
                </p>
                <p className="text-center text-xs mt-2">
                  {t("didnt_get_code")}{" "}
                  <button
                    type="button"
                    disabled={time !== 0}
                    onClick={resendCode}
                    className="text-secondary disabled:text-opacity-50"
                  >
                    {t("Resend")}
                  </button>
                </p>
              </div>

              <div className="mt-4 text-sm inline-flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="peer hidden"
                  checked
                  disabled
                />
                <label
                  htmlFor="terms"
                  className="w-5 h-5 border-2 border-primary rounded-sm peer-checked:bg-primary text-white flex items-center justify-center"
                >
                  ✔
                </label>
                <span className="ml-2 text-muted">
                  {t("by_signing_up_you_agree")}{" "}
                  <a
                    href="https://www.e-fuldmagt.dk/en/privatliv/handelsbetingelser"
                    target="_blank"
                    className="text-black font-bold"
                  >
                    {t("Term of Service")}
                  </a>{" "}
                  {t("and")}{" "}
                  <a
                    href="https://www.e-fuldmagt.dk/en/privatliv/handelsbetingelser"
                    target="_blank"
                    className="text-black font-bold"
                  >
                    {t("Privacy Policy")}
                  </a>
                  .
                </span>
              </div>

              <button
                type="submit"
                disabled={!isOTPValid || loading}
                className="w-[180px] mt-6 btn-primary disabled:bg-opacity-50"
              >
                {t("Verify")} {loading && <LoadingSpinner />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerifications;
