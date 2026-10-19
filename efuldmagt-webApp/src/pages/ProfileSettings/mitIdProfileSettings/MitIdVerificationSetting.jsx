import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import SecuritySVG from "../../../assets/icons/security.svg?react";
import { LoadingSpinner } from "../../../components/global/Loaders/Loader";
import { MdVerifiedUser } from "react-icons/md";
const TickIcon = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M20 6L9 17L4 12"
            stroke="#22C55E" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const MitIdVerificationSetting = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);

    const userEmail = useSelector((state) => state.user.user?.email);
    // 2. Get the verification status from the Redux store
    const isMitIdVerified = useSelector((state) => state.user.user?.mitIdVerified);

    const handleMitIdClick = () => {
        // This function does not need to change
        if (!userEmail) {
            toast.error("User email is not available.");
            return;
        }
        setIsLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_BASE_URL;
            if (!apiUrl) {
                console.error("VITE_BASE_URL environment variable is not set.");
                toast.error("Configuration error. Please contact support.");
                setIsLoading(false);
                return;
            }
            const verificationUrl = `${apiUrl}/user/auth/mitid/start/?email=${userEmail}&client_type=web`;
            const newTab = window.open(verificationUrl, "_blank");
            if (!newTab) {
                toast.error("Please allow popups for this site to complete MitID verification.");
            }
        } catch (error) {
            console.error("Failed to open MitID URL:", error);
            toast.error("An error occurred.");
        } finally {
            setTimeout(() => setIsLoading(false), 1000);
        }
    };

    const loading = isLoading;
    // 3. Button is disabled if loading OR if already verified
    const isDisabled = loading || isMitIdVerified;

    // 4. Set the button text based on the state
    const buttonText = isMitIdVerified
        ? t("Mitid Profile verified")
        : loading
            ? t("Starting Verification...")
            : t("Verify Profile with MitID");

    return (
        <button
            type="button"
            onClick={handleMitIdClick}
            // 5. Use the new isDisabled state
            disabled={isDisabled}
            className={`flex justify-between items-center h-[64px] w-full border border-solid rounded-md shadow px-4 mb-2 ${
                // 6. Update the styling for the disabled state
                isDisabled
                    ? "bg-gray-100 opacity-70 cursor-not-allowed"
                    : "hover:bg-primary hover:bg-opacity-5 cursor-pointer"
                }`}
        >
            <div className="flex items-center space-x-3">
                <div className="flex justify-center items-center h-[40px] w-[40px] bg-primary bg-opacity-35 rounded-full">
                    <SecuritySVG className="h-[18px] w-[18px] text-secondary stroke-current" />
                </div>
                <p className="text-md">
                    {/* 7. Use the new text variable */}
                    {buttonText}
                </p>
            </div>

            <div className="mr-4">
                {
                    // 8. The new icon logic
                    isMitIdVerified ? (
                        <MdVerifiedUser height={24} size={24} color="green" />

                    ) : loading ? (
                        <LoadingSpinner />
                    ) : (
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9 18L15 12L9 6"
                                stroke="black"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
            </div>
        </button>
    );
};

export default MitIdVerificationSetting;