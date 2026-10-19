import topImage from "../../../assets/registration/Vector.png";
import EmailComponent from "../../../components/global/Email/emailComponent";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// 1. Import the necessary tools
import { checkEmailExists } from "../../../redux/features/user/userThunk";
import { LoadingSpinner } from "../../../components/global/Loaders/Loader";

const LoginPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // 2. Get the loading status from your Redux store
    const { emailCheckStatus } = useSelector((state) => state.user);
    const isLoading = emailCheckStatus === 'loading';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // 3. Make the onSubmit function async and add the validation logic
    const onSubmit = async (data) => {
        try {
            // Check if the email exists in the database
            const emailExists = await dispatch(
                checkEmailExists({ email: data.email })
            ).unwrap();

            // If the email does NOT exist, show an error and stop
            if (!emailExists) {
                toast.error(t("email_not_registered_toast") || "This email is not registered.");
                return;
            }

            // If the email exists, proceed to the passcode page
            navigate("/signin/enter-passcode", {
                state: { email: data.email },
            });

        } catch (error) {
            const errorMessage = error || t("unexpected_error_toast");
            toast.error(errorMessage);
        }
    };

    return (
        <div className="relative flex flex-col py-12 align-middle w-full md:w-1/2 overflow-auto ">
            <img className="absolute z-[0] top-0 right-0 w-4/5" src={topImage} alt="background"/>
            <div className="flex justify-center">
                <div className="z-[1] h-1/2 align-middle w-9/12 md:w-8/12 lg:w-7/12">
                    <h2 className="text-sm font-semibold text-muted">
                        {t("welcome_to_attorney")}
                    </h2>
                    <h3 className="text-lg font-bold mt-0 text-primary">Login</h3>
                    <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                        <EmailComponent register={register} errors={errors} />

                        <div className="flex justify-center mt-4">
                            {/* 4. Update the button to handle the loading state */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-[180px] mt-6 btn-primary disabled:bg-opacity-50"
                            >
                                {t("Continue")} {isLoading && <LoadingSpinner />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="flex justify-center items-end flex-1">
                <button
                    onClick={() => navigate("/signup")}
                    className="w-[180px] h-12 mt-6 btn-primary-outline text-white"
                >
                    {t("Sign up")}
                </button>
            </div>
        </div>
    );
};

export default LoginPage;