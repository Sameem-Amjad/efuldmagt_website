import React, { useEffect, useState } from "react";
import PhoneComponent from "../../../components/global/phone/phoneComponet";
import topImage from "../../../assets/registration/Vector.png";
import { useLocation, useNavigate } from "react-router-dom";
import { PhoneNumberUtil } from "google-libphonenumber";
import parsePhoneNumber from "libphonenumber-js";
import { toast } from "react-toastify";
import { sendOTP } from "../../../services/authentication.services";
import { LoadingSpinner } from "../../../components/global/Loaders/Loader";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { checkPhoneExists } from "../../../redux/features/user/userThunk";
const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const PhonePage = () => {
  const {t}=useTranslation()
  const location = useLocation();
  const urlState = location.state;
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);

  const dispatch = useDispatch();
  const { phoneCheckStatus } = useSelector((state) => state.user);
  
  const isLoading = phoneCheckStatus === 'loading';

  useEffect(() => {
    const valid = isPhoneValid(phone);
    setIsValid(valid);
  }, [phone]);

  // --- 3. REFACTORED HANDLESUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      const parsedNumber = parsePhoneNumber(phone);
      
      // Step 1: Dispatch the thunk to check if the phone number exists
      const phoneAlreadyExists = await dispatch(
        checkPhoneExists({
          phone: {
            countryCode: parsedNumber?.countryCallingCode,
            number: parsedNumber?.nationalNumber,
          },
        })
      ).unwrap();

      // Step 2: If the phone exists, show an error and stop
      if (phoneAlreadyExists) {
        toast.error(t("phone_already_registered_toast"));
        return;
      }

      // Step 3: If phone does not exist, proceed with sending OTP
      const res = await sendOTP({
        phone: {
          countryCode: parsedNumber?.countryCallingCode,
          number: parsedNumber?.nationalNumber,
        },
      });

      if (res.status === 200) {
        toast.success(t("otp_sent_successfully"));
      }

      toast.info(res?.data?.data?.body); 
      const phoneDetailsForNextPage = {
            countryCode: parsedNumber?.countryCallingCode,
            number: parsedNumber?.nationalNumber,
            fullDisplayNumber: parsedNumber?.number, // For displaying in the UI
        };

      sessionStorage.setItem('signupPhoneDetails', JSON.stringify(phoneDetailsForNextPage));

      navigate("/signup/phone-otp-verification", {
        state: {
          ...urlState,
          phone: {
            dialCode: parsedNumber?.countryCallingCode,
            nationalNumber: parsedNumber?.nationalNumber,
            number: parsedNumber?.number,
          },
          encryptedToken: res?.data?.data?.encryptedOTPToken,
        },
      });
    } catch (error) {
      const errorMessage = error || t("unexpected_error_toast");
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative flex flex-col py-14 align-middle w-full md:w-1/2 overflow-auto ">
      <img className="absolute z-[0] top-0 right-0 w-4/5" src={topImage}></img>
      <div className="flex justify-center">
        <div className="z-[1] h-1/2 align-middle w-9/12 md:w-8/12 lg:w-7/12">
          <h2 className="text-sm font-semibold text-muted">
            {t("welcome_to_attorney")}
          </h2>
          <h3 className="text-lg font-bold mt-0 text-primary">Sign Up</h3>
          <form className="mt-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-md font-semibold">
                {t("Phone number")}
              </label>
              <div className="w-full mt-2">
                <PhoneComponent phone={phone} setPhone={setPhone} />
              </div>
              {!isValid && phone.length > 3 && ( // Show error only after some input
                <div className="text-red-500 text-xs mt-1">
                 {t("phone_not_valid")}
                </div>
              )}
            </div>
            <p className="text-xs text-muted mt-4">
             {t("We will send you an SMS with a code to verify your phone number.")}
            </p>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="w-[180px] mt-6 btn-primary text-white disabled:bg-opacity-50"
              >
                {t("Continue")} {isLoading && <LoadingSpinner />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhonePage;