import { useState, useCallback, useMemo } from "react";
import topImage from "../../../assets/registration/Vector.png";
import OTPInput from "../../../components/global/OtpInput/otpInput";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../../services/authentication.services";
import { LoadingSpinner } from "../../../components/global/Loaders/Loader";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/features/user/userSlice";
import { useTranslation } from "react-i18next";
const EnterPassCodePage = () => {
  const [passCode, setPassCode] = useState(new Array(4).fill(""));
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const urlState = useLocation().state || {};
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // Prevent unnecessary re-renders
  const handleOtpChange = useCallback((newOtp) => {
    setPassCode(newOtp);
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const enteredPasscode = passCode.join("");

      const res = await login({
        credentials: {
          email: urlState?.email,
        },
        pin: enteredPasscode,
      });

      console.log("res: ", res);

      const validUser = res?.data?.data?.user;

      if (validUser?.deleted) {
        toast.error(t("user_account_deleted_toast"));
        return;
      }

      if (validUser?.locked) {
        toast.error(t("user_account_locked_toast"));;
        return;
      }

      localStorage.setItem("token", res?.data?.data?.authToken);
      localStorage.setItem("refreshToken", res?.data?.data?.refreshToken);

      dispatch(setUser(validUser));

      setError("");
      navigate("/");
      toast.success("Login Successful");
    } catch (err) {
        const errorMessage = err?.response?.data?.message;

        if (errorMessage === "This account has not set their pin") {
            toast.error(t("setup_your_pin_toast"));
            navigate('/forgot-passcode');
        } else {
            console.log(err);
            toast.error(errorMessage || t("unknown_error_toast"));
        }
    } finally {
      setLoading(false);
    }
  };

  // Memoize error visibility logic
  const isErrorVisible = useMemo(() => !!error, [error]);

  return (
    <div className="relative flex flex-col py-12 w-full md:w-1/2 overflow-auto">
      <img
        className="absolute z-[0] top-0 right-0 w-4/5"
        src={topImage}
        alt="Decoration"
      />

      <div className="flex justify-center">
        <div className="z-[1] w-9/12 md:w-8/12 lg:w-7/12">
          <h2 className="text-sm font-semibold text-muted">
            {t("welcome_to_attorney")}
          </h2>
          <h3 className="text-lg font-bold text-primary">Login</h3>

          <form className="mt-4" onSubmit={handleSubmit}>
            <label
              className={`block text-md font-semibold mt-12 ${
                isErrorVisible ? "text-danger" : "text-black"
              }`}
            >
              {t("enter_your_passcode_label")}
            </label>

            <div className="flex flex-col items-center">
              <OTPInput
                className="my-3"
                otp={passCode}
                setOtp={handleOtpChange}
              />

              <div className="flex justify-between w-full">
                <p
                  className={`text-danger text-xs ${
                    isErrorVisible ? "" : "invisible"
                  }`}
                >
                  {error}
                </p>
                <Link className="text-xs" to="/forgot-passcode">
                  {t("Forgot password?")}
                </Link>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-[180px] mt-6 btn-primary disabled:bg-opacity-50"
              >
                {t("Continue")} {loading && <LoadingSpinner />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnterPassCodePage;
