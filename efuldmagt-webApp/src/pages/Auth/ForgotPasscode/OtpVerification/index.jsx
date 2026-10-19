import topImage from "@/assets/registration/Vector.png";
import React, { useEffect, useState, useCallback } from "react";
import OTPInput from "@/components/global/OtpInput/otpInput";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  forgetPasscodeSendOTP,
  verifyForgotPasswordOTP,
} from "../../../../services/authentication.services";
import { LoadingSpinner } from "../../../../components/global/Loaders/Loader";
import { useTranslation } from "react-i18next";
const OtpVerifications = () => {
  const location = useLocation();
  const email = location?.state?.email;
  const phone = location?.state?.phone;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [encryptedOTPToken, setEncryptedOTPToken] = useState(
    location?.state?.encryptedOTPToken
  );
  const { t } = useTranslation();
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [time, setTime] = useState(5);
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
        const res = await verifyForgotPasswordOTP({
          encryptedOTPToken: encryptedOTPToken,
          otp: otp.join(""),
        });
        console.log("res: ", res);

        toast.success(t("otp_verified_successfully_toast"));

        navigate("/forgot-passcode/new-passcode", {
          state: {
            createPasswordToken: res?.data?.data?.createPasswordToken,
          },
        });
      } catch (error) {
        console.log("error: ", error);
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    },
    [encryptedOTPToken, navigate, otp]
  );

  // Resend OTP
  const resendCode = useCallback(async () => {
    try {
      let validData = {};
      if (email) {
        validData = {
          email: email,
        };
      } else {
        validData = {
          phone: phone,
        };
      }

      if (email) setOtp(new Array(4).fill(""));
      const res = await forgetPasscodeSendOTP(validData);

      if (res.status === 200) {
        toast.success(t("new_otp_sent_toast"));
        setEncryptedOTPToken(res?.data?.data?.encryptedOTPToken);
      }

      if (phone) {
        alert(res?.data?.data?.body);
      }
      setTime(5);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [email, phone]);

  return (
    <div className="relative flex flex-col py-12 align-middle w-full md:w-1/2 overflow-auto">
      <img
        className="absolute z-[0] top-0 right-0 w-4/5"
        src={topImage}
        alt="top vector"
      />
      <div className="flex justify-center">
        <div className="z-[1] h-1/2 align-middle w-9/12 md:w-8/12 lg:w-7/12">
          <form onSubmit={onSubmit}>
            <div className="flex flex-col items-center mt-1">
              <label className="block text-xl font-bold mt-4">
                {t("otp_verification_title")}
              </label>
              <p className="text-sm my-2">
                Please enter the OTP sent to your registered{" "}
                {email ? "email" : "phone number"}.
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

              <button
                type="submit"
                disabled={!isOTPValid || loading}
                className="w-[180px] mt-6 btn-primary disabled:bg-opacity-50"
              >
                {t("Verify")}{loading && <LoadingSpinner />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerifications;
