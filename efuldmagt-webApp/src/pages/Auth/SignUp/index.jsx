import topImage from "../../../assets/registration/Vector.png";
import { Link } from "react-router-dom";
import EmailComponent from "../../../components/global/Email/emailComponent";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { sendOTP } from "../../../services/authentication.services";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../components/global/Loaders/Loader";
import { useDispatch, useSelector } from "react-redux";
import { checkEmailExists } from "../../../redux/features/user/userThunk";
import { useTranslation } from "react-i18next";



const Signup = () => {
  const {t}=useTranslation()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { emailCheckStatus } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const emailAlreadyExists = await dispatch(
        checkEmailExists({ email: data.email })
      ).unwrap();

      if (emailAlreadyExists) {
        toast.error(t("email_already_registered_toast"));
        setLoading(false)
        return; 
      }

      const res = await sendOTP({
        email: data?.email,
      });
      // console.log(res?.data?.data?.encryptedOTPToken)
      if (res.status === 200) {
        toast.success(t("otp_sent_successfully"))
      }

      navigate("/signup/email-otp-verification", {
        state: {
          email: data.email,
          encryptedToken: res?.data?.data?.encryptedOTPToken,
        },
      });

    } catch (error) {
       const errorMessage = error || t("unexpected_error_toast");
      toast.error(errorMessage);
      setLoading(false);
    } 
  };


  
  return (
    <div className="relative flex flex-col py-12 align-middle w-full md:w-1/2 overflow-auto	">
      <img className="absolute z-[0] top-0 right-0 w-4/5" src={topImage}></img>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-center">
          <div className="z-[1] h-1/2 align-middle w-9/12 md:w-8/12 lg:w-7/12">
            <h2 className="text-sm font-semibold text-muted">
              {t("welcome_to_attorney")}
            </h2>
            <h3 className="text-lg font-bold mt-0 text-primary">Sign Up</h3>

            <EmailComponent register={register} errors={errors} />

            <p className="text-xs text-muted mt-2">
             {t("we_will_send_email_verification_code")}
            </p>
            <div className="mt-4">
              <div className="text-sm inline-flex items-center mt-2">
                <div className="flex items-center">
                  <input
                    {...register("termsAndConditions", {
                      required: t("terms_agree_required"),
                    })}
                    type="checkbox"
                    id="terms"
                    className="peer hidden"
                  />
                  <label
                    htmlFor="terms"
                    className="w-5 h-5 flex items-center justify-center border-2 border-primary rounded-sm cursor-pointer 
               peer-checked:bg-primary text-secondary peer-checked:text-white"
                  >
                    ✔
                  </label>
                </div>

                <span className="ml-2 text-muted">
                  {t("by_signing_up_you_agree")}{" "}
                  <a
                    href="https://www.e-fuldmagt.dk/en/privatliv/handelsbetingelser"
                    target="_blank"
                  >
                    <span className="text-black font-bold cursor-pointer z-50">
                      {t("Term of Service")}
                    </span>{" "}
                  </a>
                  and{" "}
                  <a
                    href="https://www.e-fuldmagt.dk/en/privatliv/handelsbetingelser"
                    target="_blank"
                  >
                    <span className="text-black font-bold cursor-pointer z-50">
                      {t("Privacy Policy")}
                    </span>
                  </a>
                  .
                </span>
              </div>
              {errors.termsAndConditions && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.termsAndConditions.message}
                </p>
              )}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-[180px] mt-6 btn-primary text-white disabled:bg-opacity-50"
              >
                {t("Continue")} {loading && <LoadingSpinner />}
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="flex justify-center items-end flex-1">
        <button
          onClick={() => navigate("/signin")}
          className="w-[180px] h-12 mt-6 btn-primary-outline text-white"
        >
          {t("Login")}
        </button>
      </div>
    </div>
  );
};
export default Signup;
