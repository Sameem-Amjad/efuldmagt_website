import { useState } from "react";
import OTPInput from "../OtpInput/otpInput";
import CloseSVG from "../../../assets/icons/close.svg?react";
import { toast } from "react-toastify";
import React from "react";
import "react-international-phone/style.css";
import { PhoneInput } from "react-international-phone";
import { LoadingSpinner } from "../Loaders/Loader";
import parsePhoneNumber from "libphonenumber-js";

const PhoneComponent = ({ phone, setPhone, disabled = false }) => {
  return (
    <div className="flex">
      <PhoneInput
        defaultCountry="pk"
        value={phone}
        disabled={disabled}
        onChange={(value) => setPhone(value)}
        inputProps={{
          name: "phone",
          required: true,
          autoFocus: true,
        }}
        inputClassName={"w-full rounded-full font-block text-base"}
        className="w-full focus-within:ring-[#3CB4E4] focus-within:ring-2 border rounded-lg p-2 disabled:bg-white border-gray-500"
        style={{
          "--react-international-phone-border-color": "transparent",
        }}
      />
    </div>
  );
};

export default function SettingsPhoneInput({
  input,
  disabled = false,
  setInput,
  sendOTPToPhone,
  verifyOTP,
}) {
  const [update, setUpdate] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [prevInput, setPrevInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [encryptedOTPToken, setEncryptedOTPToken] = useState();

  const handleOTPToPhone = async () => {
    const parsedNumber = parsePhoneNumber(input);

    try {
      setLoading(true);
      const body = {
        countryCode: parsedNumber?.countryCallingCode,
        number: parsedNumber?.nationalNumber,
      };
      const res = await sendOTPToPhone(body);
      console.log("res: ", res);
      setEncryptedOTPToken(res?.data?.data?.encryptedOTPToken);
      toast.info("OTP send to PhoneNumber");
      alert(res?.data?.data?.body);
      setOtpSent(true);
    } catch (error) {
      console.log("error: ", error);
      toast.error(
        error.response?.data?.message || error.message || "error sending OTP"
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
        otp: otp.join(""),
      });

      console.log("res: ", res);
      setOtpSent(false);
      setUpdate(false);
      toast.success("Phone number has been updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      setInput(prevInput);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {update && (
        <p className="my-1 text-xs">
          We will send a code to verify your new phone number.
        </p>
      )}

      <PhoneComponent
        phone={input}
        setPhone={setInput}
        disabled={!(update && !otpSent)}
      />

      {!update && !disabled && (
        <p
          onClick={() => {
            setUpdate(true);
            setPrevInput(input);
          }}
          className="absolute right-4 top-[18px] text-sm underline cursor-pointer text-secondary font-semibold"
        >
          Change
        </p>
      )}

      {update && !otpSent && (
        <div className="flex w-full space-x-2 justify-between my-4">
          <button
            className="h-[46px] w-1/2 text-base font-bold text-black bg-[#F3F3F3] rounded-lg border"
            onClick={() => {
              setUpdate(false);
              setInput(prevInput);
            }}
          >
            Decline
          </button>
          <button
            onClick={handleOTPToPhone}
            disabled={loading}
            className="h-[46px] w-1/2 text-base font-bold text-white bg-primary rounded-lg border disabled:bg-opacity-50"
          >
            Update {loading && <LoadingSpinner />}
          </button>
        </div>
      )}

      {otpSent && (
        <div className="w-full my-4 space-y-2">
          <p className="text-sm">
            Please enter the 4-digit code sent to your phone.
          </p>
          <div className="flex flex-col w-full justify-center items-center gap-2">
            <OTPInput otp={otp} setOtp={setOtp} />
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="h-[46px] w-1/2 text-base font-bold text-white bg-primary rounded-lg border disabled:bg-opacity-50"
            >
              Save {loading && <LoadingSpinner />}
            </button>
          </div>
        </div>
      )}

      {update && (
        <div className="z-40 md:hidden fixed top-0 left-0 h-screen w-screen">
          <div className="flex flex-col justify-end h-full">
            <div
              className="w-full h-full bg-white bg-opacity-40"
              onClick={() => {
                setUpdate(false);
                setOtpSent(false);
                setInput(prevInput);
              }}
            ></div>
            <div className="py-4 w-full border bg-white rounded-t-[30px]">
              <div className="relative">
                <div
                  className="absolute right-4 hover:cursor-pointer"
                  onClick={() => {
                    setUpdate(false);
                    setOtpSent(false);
                    setInput(prevInput);
                  }}
                >
                  <CloseSVG />
                </div>
                <div className="text-center m-3 mx-3 space-y-2">
                  <div className="text-md font-semibold">Update Phone</div>
                  {update && !otpSent && (
                    <p className="my-1 text-xs">
                      We will send a code to verify your new phone number.
                    </p>
                  )}
                  <PhoneComponent
                    phone={input}
                    setPhone={setInput}
                    disabled={!(update && !otpSent)}
                  />
                  {update && !otpSent && (
                    <div className="flex w-full space-x-2 justify-between my-4">
                      <button
                        className="h-[46px] w-1/2 text-base font-bold text-black bg-[#F3F3F3] rounded-lg border"
                        onClick={() => {
                          setUpdate(false);
                          setInput(prevInput);
                        }}
                      >
                        Decline
                      </button>
                      <button
                        onClick={handleOTPToPhone}
                        className="h-[46px] w-1/2 text-base font-bold text-white bg-primary rounded-lg border"
                      >
                        Update
                      </button>
                    </div>
                  )}
                  {otpSent && (
                    <div className="w-full my-4 space-y-2">
                      <p className="text-sm">
                        Please enter the 4-digit code sent to your phone.
                      </p>
                      <div className="flex flex-col w-full justify-center items-center space-y-2">
                        <OTPInput otp={otp} setOtp={setOtp} />
                        <button
                          onClick={handleVerifyOTP}
                          className="h-[46px] w-1/2 text-base font-bold text-white bg-primary rounded-lg border"
                        >
                          Save
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
