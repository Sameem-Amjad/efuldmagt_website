import topImage from "../../../assets/registration/Vector.png";
import React, { useEffect, useState, useCallback } from "react";
import OTPInput from "../../../components/global/OtpInput/otpInput";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sendOTP, verifySignupOTP } from "../../../services/authentication.services";
import { LoadingSpinner } from "../../../components/global/Loaders/Loader";
import { useTranslation } from "react-i18next";
const PhoneOtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const phoneData = JSON.parse(sessionStorage.getItem('signupPhoneDetails'));
    // 1. Get the complete phone object and other state from the navigation
    const { phone, encryptedToken, ...previousState } = location.state || {};

    const [encryptedOTPToken, setEncryptedOTPToken] = useState(encryptedToken);
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const [time, setTime] = useState(60);
    const [isOTPValid, setIsOTPValid] = useState(false);
    const { t } = useTranslation();
    useEffect(() => {
        if (time <= 0) return;
        const timer = setTimeout(() => setTime((prev) => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [time]);

    useEffect(() => {
        setIsOTPValid(otp.join("").length === 4);
    }, [otp]);

    const onSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await verifySignupOTP({
                encryptedOTPToken: encryptedOTPToken,
                otp: otp.join(""),
            });
            console.log(res)
            toast.success(t("phone_verified_successfully_toast"));

            // Navigate to the next step in signup, passing all previous state
            navigate("/signup/profile-setup", { // Or wherever the next step is
                state: {
                    ...previousState,
                    phone: phone,
                    phoneCredentialsToken: res?.data?.data?.credentialsToken,
                },
            });
        } catch (error) {
            const errorMessage = error?.response?.data?.message;
            
             if (errorMessage === "Token has expired") {
            toast.error(t("session_expired_toast", "Your session has expired. Please try again."));
            navigate("/signup"); // Navigate back to signup
        } else {
             toast.error(error?.response?.data?.message || t("invalid_otp_toast"));
        }
        } finally {
            setLoading(false);
        }
    }, [encryptedOTPToken, navigate, otp, phone, previousState]);

    // 2. Fix the resendCode function to use the phone object
const resendCode = useCallback(async () => {
        if (!phoneData?.countryCode || !phoneData?.number) {
            toast.error(t("phone_details_missing_toast"))
            return;
        }

        try {
            setOtp(new Array(4).fill(""));
            // The payload now perfectly matches what the backend expects
            const payload = {
                phone: {
                    countryCode: phoneData.countryCode,
                    number: phoneData.number,
                },
            };

            const res = await sendOTP(payload);

            if (res.status === 200) {
                toast.success(t("new_otp_sent_toast"));
                setEncryptedOTPToken(res?.data?.data?.encryptedOTPToken);
                setTime(60);
            }
        } catch (error) {
       console.log("error: ", error);
        
        const errorMessage = error?.response?.data?.message;
       
        if (errorMessage === "Token has expired") {
            toast.error(t("session_expired_toast", "Your session has expired. Please try again."));
            navigate("/signup"); // Navigate back to signup
        } else {
             toast.error(error?.response?.data?.message || t("failed_to_resend_otp_toast"));
        }
      } 
    }, [phoneData]);

    return (
        <div className="relative flex flex-col py-12 align-middle w-full md:w-1/2 overflow-auto">
            <img className="absolute z-[0] top-0 right-0 w-4/5" src={topImage} alt="top vector" />
            <div className="flex justify-center">
                <div className="z-[1] h-1/2 align-middle w-9/12 md:w-8/12 lg:w-7/12">
                    <h2 className="text-sm font-semibold text-muted">{t("welcome_to_attorney")}</h2>
                    <h3 className="text-lg font-bold mt-0 text-primary">{t("Sign up")}</h3>

                    {/* 3. Display the phone number, not an email input */}
                    <div className="mt-6">
                        <label className="block text-md font-semibold">{t("Phone number")}</label>
                        <p className="w-full mt-2 p-3 rounded-md bg-gray-100 text-muted">
                            {phone?.number || t('no_phone_number_found')}
                        </p>
                    </div>

                    <p className="text-xs text-muted mt-2">
                        {t("we_sent_sms_code")}.
                    </p>

                    <form onSubmit={onSubmit}>
                        <div className="flex flex-col items-center mt-1">
                            <label className="block text-xl font-bold mt-4">{t("otp_verification_title")}</label>
                            <p className="text-sm my-2 text-center">
                                {t("otp_prompt_phone")}
                            </p>
                            <div className="w-full flex flex-col items-center">
                                <OTPInput className="my-3" otp={otp} setOtp={setOtp} />
                                <p className="text-center text-xs">
                                    {t("remaining_time")}{" "}
                                    <span className="text-secondary">
                                        {String(Math.floor(time / 60)).padStart(2, "0")}:{String(time % 60).padStart(2, "0")}
                                    </span>
                                </p>
                                <p className="text-center text-xs mt-2">
                                    {t("didnt_get_code")}{" "}
                                    <button
                                        type="button"
                                        disabled={time !== 0}
                                        onClick={resendCode}
                                        className="text-secondary disabled:text-opacity-50 font-semibold"
                                    >
                                        {t("Resend")}
                                    </button>
                                </p>
                            </div>
                            <button type="submit" disabled={!isOTPValid || loading} className="w-[180px] mt-8 btn-primary disabled:bg-opacity-50">
                                {t("Verify")}{loading && <LoadingSpinner />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PhoneOtpVerification;