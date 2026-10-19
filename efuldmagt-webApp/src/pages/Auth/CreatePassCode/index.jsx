import React, { useState, useCallback } from "react";
import topImage from "../../../assets/registration/Vector.png";
import { useLocation, useNavigate } from "react-router-dom";
import OTPInput from "../../../components/global/OtpInput/otpInput";
import { useTranslation } from "react-i18next";
const CreatePasscode = () => {
  const location = useLocation();
  const urlState = location.state || {};
  const navigate = useNavigate();
  const [pass, setPass] = useState(new Array(4).fill(""));
  const { t } = useTranslation();
  // Optimized state update to prevent unnecessary re-renders
  const handleOtpChange = useCallback((newOtp) => {
    setPass(newOtp);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pass.join("").length === 4) {
      navigate("/signup/renter-passcode", {
        state: { ...urlState, pass: pass.join("") },
      });
    }
  };

  return (
    <div className="relative flex flex-col py-14 w-full md:w-1/2 overflow-auto">
      <img
        className="absolute z-[0] top-0 right-0 w-4/5"
        src={topImage}
        alt="Decoration"
      />

      <div className="flex justify-center">
        <div className="z-[1] w-9/12 md:w-8/12 lg:w-7/12">
          <form className="mt-6" onSubmit={handleSubmit}>
            <h2 className="text-lg font-bold text-primary">
              {t("create_new_passcode_title")}
            </h2>
            <p className="text-sm text-primary">
              {t("create_new_passcode_prompt")}
            </p>

            <label className="block text-md font-semibold mt-12">
              {t("create_new_passcode_label")}
            </label>

            <div className="flex flex-col items-center">
              <OTPInput className="my-3" otp={pass} setOtp={handleOtpChange} />

              <button
                disabled={pass.join("").length !== 4}
                type="submit"
                className="w-[180px] mt-6 btn-primary disabled:opacity-50"
              >
               {t("Continue")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePasscode;
