import React, { useEffect, useState } from "react";
import topImage from "@/assets/registration/Vector.png";
import { Link, useNavigate } from "react-router-dom";
import { PhoneNumberUtil } from "google-libphonenumber";
import parsePhoneNumber from "libphonenumber-js";
import PhoneComponent from "@/components/global/phone/phoneComponet";
import { sendOTP } from "../../../../services/authentication.services";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../../components/global/Loaders/Loader";
import { useTranslation } from "react-i18next";
const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const PhonePage = () => {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    const valid = isPhoneValid(phone);
    setIsValid(valid);
  }, [phone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const parsedNumber = parsePhoneNumber(phone);
      const res = await sendOTP({
        phone: {
          countryCode: parsedNumber?.countryCallingCode,
          number: parsedNumber?.nationalNumber,
        },
      });

      if (res.status === 200) {
        toast.success(t("otp_sent_successfully"));
      }
      console.log("res: ", res);

      alert(res?.data?.data?.body);

      navigate("/forgot-passcode/otp-verification", {
        state: {
          phone: {
            countryCode: parsedNumber?.countryCallingCode,
            number: parsePhoneNumber?.nationalNumber,
          },
          encryptedOTPToken: res?.data?.data?.encryptedOTPToken,
        },
      });
    } catch (error) {
      console.log("error: ", error);

      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col py-14 align-middle w-full md:w-1/2 overflow-auto	">
      <img className="absolute z-[0] top-0 right-0 w-4/5" src={topImage}></img>
      <div className="flex justify-center">
        <div className="z-[1] h-1/2 align-middle w-9/12 md:w-8/12 lg:w-7/12">
          <div className="text-lg font-bold">{t("create_new_code")}</div>
          <p className="text-sm">
              {t("create_new_code_security_prompt")}
          </p>
          <form className="mt-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-md font-semibold">
                {t("Phone number")}
              </label>
              <div className="w-full mt-2">
                <PhoneComponent phone={phone} setPhone={setPhone} />
              </div>
              {!isValid && (
                <div className="text-red-500 text-xs mt-1">
                  {t("phone_not_valid")}
                </div>
              )}
            </div>
            <p className="text-xs text-muted mt-2">
            {t("we_will_send_phone_verification_code")}{" "}
              <Link
                to="/forgot-passcode"
                className="text-xsmt-2 text-secondary"
                onClick={() => navigate("/forgot-passcode")}
              >
                {t("use_email_instead")}
              </Link>
            </p>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-[180px] mt-6 btn-primary text-white disabled:bg-opacity-50"
              >
                {t("Get Code")} {loading && <LoadingSpinner />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PhonePage;
