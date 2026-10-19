import React, { useState } from "react";
import topImage from "@/assets/registration/Vector.png";
import EmailComponent from "@/components/global/Email/emailComponent";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { forgetPasscodeSendOTP } from "../../../../services/authentication.services";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../../components/global/Loaders/Loader";
import { useTranslation } from "react-i18next";
const EmailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await forgetPasscodeSendOTP({
        email: data?.email,
      });

      if (res.status === 200) {
        toast.success(t("otp_sent_successfully"));
      }
      console.log("res: ", res);

      navigate("/forgot-passcode/otp-verification", {
        state: {
          email: data.email,
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
    <div className="relative flex flex-col py-12 align-middle w-full md:w-1/2 overflow-auto	">
      <img className="absolute z-[0] top-0 right-0 w-4/5" src={topImage}></img>
      <div className="flex justify-center">
        <div className="z-[1] h-1/2 align-middle w-9/12 md:w-8/12 lg:w-7/12">
          <div className="text-lg font-bold">{t("create_new_code")}</div>
          <p className="text-sm">
            {t("create_new_code_security_prompt")}
          </p>
          <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
            <EmailComponent register={register} errors={errors} />
            <p className="text-xs text-muted mt-2">
              {t("we_will_send_verification_code")}{" "}
              <Link
                to="/forgot-passcode/phone"
                className="text-xs mt-2 text-secondary"
              >
                {t("use_phone_number_instead")}
              </Link>
            </p>

            <div className="flex justify-center mt-4">
              <button
                disabled={loading}
                type="submit"
                className="w-[180px] mt-6 btn-primary disabled:bg-opacity-50"
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

export default EmailPage;
