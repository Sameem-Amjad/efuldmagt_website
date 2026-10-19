import { useRef, useState } from "react";
import OTPInput from "../OtpInput/otpInput";
import CloseSVG from "../../../assets/icons/close.svg?react";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../Loaders/Loader";
import { useTranslation } from "react-i18next";
export default function SettingsEmailInput({
  input,
  disabled = false,
  setInput,
  type = "email",
  placeholder = "",
  className = "",
  sendOTPToEMail,
  verifyOTP,
}) {
  const [state, setState] = useState({
    update: false,
    otpSent: false,
    prevInput: "",
    otp: new Array(4).fill(""),
  });
  const [loading, setLoading] = useState(false);
  const [encryptedOTPToken, setEncryptedOTPToken] = useState();
  const {t}=useTranslation()
  const textInputRef = useRef(null);

  const handleOTPToEmail = async () => {
    try {
      setLoading(true);
      const res = await sendOTPToEMail(input);
      console.log("res: ", res);
      setEncryptedOTPToken(res?.data?.data?.encryptedOTPToken);
      toast.info("OTP send to email");
      setState((prev) => ({ ...prev, otpSent: true }));
    } catch (error) {
      console.log("error: ", error);
      toast.error(
        error.response?.data?.message || error.message || t("Error in sending OTP")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      const res = await verifyOTP({
        encryptedOTPToken,
        otp: state.otp.join(""),
      });

      console.log("res: ", res);
      setState((prev) => ({ ...prev, otpSent: false, update: false }));
      toast.success(t("email_updated_success"));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      setInput(state.prevInput);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {state.update && (
        <p className="my-1 text-xs">
          {t("We will send a verification code to your e-mail to confirm it.")}
        </p>
      )}

      <input
        type={type}
        value={input}
        ref={textInputRef}
        onChange={(e) => setInput(e.target.value)}
        className="py-3 w-full rounded-lg text-base border-gray-500"
        disabled={!(state.update && !state.otpSent)}
        placeholder={placeholder}
      />

      {!state.update && !disabled && (
        <p
          onClick={() =>
            setState((prev) => ({ ...prev, update: true, prevInput: input }))
          }
          className="absolute right-4 top-[18px] text-sm underline hover:cursor-pointer text-secondary font-semibold"
        >
          {t("Change")}
        </p>
      )}

      {state.update && !state.otpSent && (
        <div className="flex w-full space-x-2 justify-between my-4">
          <button
            className="h-[46px] w-1/2 text-base font-bold text-black bg-[#F3F3F3] rounded-lg border border-solid"
            onClick={() => {
              setState((prev) => ({ ...prev, update: false }));
              setInput(state.prevInput);
            }}
          >
            {t("Decline")}
          </button>
          <button
            onClick={handleOTPToEmail}
            disabled={loading}
            className="h-[46px] w-1/2 text-base font-bold text-white bg-primary rounded-lg border border-solid disabled:bg-opacity-50"
          >
            {t("Update")} {loading && <LoadingSpinner />}
          </button>
        </div>
      )}

      {state.otpSent && (
        <div className="w-full my-4 space-y-2">
          <p className="text-sm">
            {t("We will send a verification code to your e-mail to confirm it.")}
          </p>
          <div className="flex flex-col w-full justify-center items-center gap-2">
            <OTPInput
              otp={state.otp}
              setOtp={(otp) => setState((prev) => ({ ...prev, otp }))}
            />
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="h-[46px] w-1/2 text-base font-bold text-white bg-primary rounded-lg border border-solid disabled:bg-opacity-50"
            >
              Save {loading && <LoadingSpinner />}
            </button>
          </div>
        </div>
      )}

      {state.update && (
        <div className="z-40 md:hidden fixed top-0 left-0 h-screen w-screen">
          <div className="flex flex-col justify-end h-full">
            <div
              className="w-full h-full bg-white bg-opacity-40"
              onClick={() => {
                setState((prev) => ({
                  ...prev,
                  update: false,
                  otpSent: false,
                }));
                setInput(state.prevInput);
              }}
            ></div>
            <div className="py-4 w-full border bg-white rounded-t-[30px]">
              <div className="relative">
                <div
                  className="absolute right-4 hover:cursor-pointer"
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      update: false,
                      otpSent: false,
                    }));
                    setInput(state.prevInput);
                  }}
                >
                  <CloseSVG />
                </div>
                <div className="text-center m-3 mx-3 space-y-2">
                  <div className="text-md font-semibold">Update Email</div>
                  {state.update && !state.otpSent && (
                    <p className="my-1 text-xs">
                     {t("We will send a verification code to your e-mail to confirm it.")}
                    </p>
                  )}
                  <input
                    type={type}
                    value={input}
                    ref={textInputRef}
                    onChange={(e) => setInput(e.target.value)}
                    className="h-[54px] rounded-lg w-full text-base"
                    disabled={!(state.update && !state.otpSent)}
                    placeholder={placeholder}
                  />
                  {state.update && !state.otpSent && (
                    <div className="flex w-full space-x-2 justify-between my-4">
                      <button
                        className="h-[46px] w-1/2 text-base font-bold text-black bg-[#F3F3F3] rounded-lg border border-solid"
                        onClick={() => {
                          setState((prev) => ({ ...prev, update: false }));
                          setInput(state.prevInput);
                        }}
                      >
                        Decline
                      </button>
                      <button
                        onClick={handleOTPToEmail}
                        className="h-[46px] w-1/2 text-base font-bold text-white bg-primary rounded-lg border border-solid"
                      >
                        Update
                      </button>
                    </div>
                  )}
                  {state.otpSent && (
                    <div className="w-full my-4 space-y-2">
                      <p className="text-sm">
                        {t("Please enter the 4-digit OTP sent to your email.")}
                      </p>
                      <div className="flex flex-col w-full justify-center items-center space-y-2">
                        <OTPInput
                          otp={state.otp}
                          setOtp={(otp) =>
                            setState((prev) => ({ ...prev, otp }))
                          }
                        />
                        <button
                          onClick={handleVerifyOTP}
                          className="h-[46px] w-1/2 text-base font-bold text-white bg-primary rounded-lg border border-solid"
                        >
                          {t("Save")}
                        </button>
                      </div>
                    </div>
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
