import React, { useState, useCallback } from "react";
import topImage from "@/assets/registration/Vector.png";
import OTPInput from "@/components/global/OtpInput/otpInput";
import { useLocation, useNavigate } from "react-router-dom";
import { createPassword } from "../../../../services/authentication.services";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../../../redux/features/user/userSlice";
import { LoadingSpinner } from "../../../../components/global/Loaders/Loader";
import { useTranslation } from "react-i18next";
const ReEnterNewPassCode = () => {
  const location = useLocation();
  const urlState = location.state || {};
  const [confirmPass, setConfirmPass] = useState(new Array(4).fill(""));
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const handleOtpChange = useCallback((newOtp) => {
    setConfirmPass(newOtp);
  }, []);

  const onSubmit = async (e) => {
    // console.log("on renter new pass code label")
    try {
      e.preventDefault();
      setLoading(true);
      const enteredPass = confirmPass.join("");
      if (urlState.pass !== enteredPass) {
        setError(t("passcode_mismatch_toast"));
        // toast.error("passcode_mismatch_toast")
        return;
      }
      setError("");

      const res = await createPassword({
        createPasswordToken: urlState?.createPasswordToken,
        pin: enteredPass,
      });

      console.log("res: ", res);

      if (res?.status === 200 || res?.status === 201) {
      toast.success(t("passcode_created_successfully_toast"));
      }

      localStorage.setItem("token", res?.data?.data?.authToken);
      localStorage.setItem("refreshToken", res?.data?.data?.refreshToken);

      dispatch(setUser(res?.data?.data?.user));
      navigate("/");
    } catch (error) {
      console.log("error: ", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
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
          <form className="mt-6" onSubmit={onSubmit}>
            <h2 className="text-lg font-bold text-primary">
              {t("create_new_passcode_title")}
            </h2>
            <p className="text-sm text-primary">
            {t("reenter_new_passcode_prompt")}
            </p>

            <label
              className={`block text-md font-semibold mt-12 ${
                error ? "text-danger" : "text-black"
              }`}
            >
            {t("reenter_new_passcode_label")
}            </label>

            <div className="flex flex-col items-center">
              <OTPInput
                className="my-3"
                otp={confirmPass}
                setOtp={handleOtpChange}
                error={!!error}
              />
              {error && <p className="text-danger text-sm">{error}</p>}

              <button
                disabled={!!error || loading}
                type="submit"
                className="w-[180px] mt-6 btn-primary disabled:bg-opacity-50"
              >
                {t("create_passcode_button")} {loading && <LoadingSpinner />} 
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReEnterNewPassCode;
