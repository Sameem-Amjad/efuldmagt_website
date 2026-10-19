import { useState } from "react";
import SettingsInput from "../../../components/global/SettingInput/SettingsInput";
import SettingsEmailInput from "../../../components/global/SettingsEmailInput/SettingsEmailInput";
import SettingsPhoneInput from "../../../components/global/SettingsPhoneInput/SettingsPhoneInput";
import { Link } from "react-router-dom";
import BackNavigation from "../../../components/global/common/BackNavigation";
import { useSelector, useDispatch } from "react-redux"; // Added useDispatch
import { updateUserInfo } from "../../../services/user.services";
import ChangeProfileImageWrapper from "./components/ChangeProfileImageWrapper";
import { useTranslation } from "react-i18next";
import {
  sendOTP,
  updateEmail,
  updatePhoneNumber,
} from "../../../services/authentication.services";
import { updateUserData } from "../../../redux/features/user/userSlice";
import { checkEmailExists } from "../../../redux/features/user/userThunk";
import { toast } from "react-toastify";
const User = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch(); // Initialize dispatch
  const { user: userData } = useSelector((state) => state.user);
  const token = localStorage.getItem("token");

  const [user, setUser] = useState({
    firstName: userData?.name?.firstName,
    lastName: userData?.name?.lastName,
    email: userData?.email,
    phoneNumber: userData?.phone?.countryCode + userData?.phone?.number,
    address: `${userData?.address?.addressLine}, ${userData?.address?.address}, ${userData?.address?.city}, ${userData?.address?.country}`,
    imageUrl: userData?.image,
  });

  const fieldHandler = (field) => {
    return (value) => {
      let newUser = { ...user };
      newUser[field] = value;
      setUser(newUser);
    };
  };

  const changeFirstName = async (value) => {
    const validBody = { name: { firstName: value, lastName: user.lastName } };
    try {
      await updateUserInfo(token, validBody);
      dispatch(updateUserData(validBody)); // This will now work
    } catch (error) {
      console.error("Failed to update first name:", error);
      // Optional: Revert local state or show an error toast
    }
  };

  const changeLastName = async (value) => {
    const validBody = { name: { firstName: user.firstName, lastName: value } };
    try {
      await updateUserInfo(token, validBody);
      dispatch(updateUserData(validBody)); // This will now work
    } catch (error) {
      console.error("Failed to update last name:", error);
    }
  };

  const sendOTPToEMail = async (value) => {
    // Check if the new email is different from current email
    if (value === userData?.email) {
      toast.info(t("This is already your current email"));
      // throw new Error("Same email");
    }

    try {
      // Check if email already exists
      const emailAlreadyExists = await dispatch(
        checkEmailExists({ email: value })
      ).unwrap();

      if (emailAlreadyExists) {
        // toast.error(t("email_already_registered_toast") || "Email already registered");
        throw new Error("Email already exists");
      }

      // If email doesn't exist, send OTP
      return await sendOTP({ email: value });
    } catch (error) {
      // If it's our custom error, just rethrow it
      if (error.message === "Email already exists") {
        throw error;
      }
      // For other errors, show toast and rethrow
      const errorMessage = error || t("unexpected_error_toast") || "An error occurred";
      toast.error(errorMessage);
      throw error;
    }
  };

  const verifyEmailOTP = async (body) => {
    return await updateEmail(token, body);
  };

  const sendOTPToPhone = async (value) => {
    return await sendOTP({ phone: value });
  };

  const verifyPhoneOTP = async (body) => {
    return await updatePhoneNumber(token, body);
  };

  return (
    <div>
      <BackNavigation title="Personal Information" />
      <div className="flex flex-col w-full items-center justify-center">
        <ChangeProfileImageWrapper user={user} setUser={setUser} />
        <div className="w-full md:w-[400px] space-y-4">
          <div className="space-y-1">
            <label className="text-md font-medium mt-4 mb-2">{t("First Name")}</label>
            <SettingsInput
              input={user.firstName}
              type={"text"}
              setInput={fieldHandler("firstName")}
              updateFunction={changeFirstName}
            />
          </div>
          <div className="space-y-1">
            <label className="text-md font-medium mt-4 mb-2">{t("Last Name")}</label>
            <SettingsInput
              input={user.lastName}
              type={"text"}
              setInput={fieldHandler("lastName")}
              updateFunction={changeLastName}
            />
          </div>
          <div className="space-y-1">
            <label className="text-md font-medium mt-4 mb-2">{t("Email")}</label>
            <SettingsEmailInput
              input={user.email}
              type={"text"}
              setInput={fieldHandler("email")}
              sendOTPToEMail={sendOTPToEMail}
              verifyOTP={verifyEmailOTP}
            />
          </div>
          <div className="space-y-1">
            <label className="text-md font-medium mt-4 mb-2">{t("Phone")}</label>
            <SettingsPhoneInput
              input={user.phoneNumber}
              setInput={fieldHandler("phoneNumber")}
              sendOTPToPhone={sendOTPToPhone}
              verifyOTP={verifyPhoneOTP}
            />
          </div>
          <div className="space-y-1">
            <label className="text-md font-medium mt-4 mb-2">{t("Adress")}</label>
            <div className="flex relative w-full h-[54px] px-2 pe-10 border border-solid items-center rounded-lg border-gray-500">
              <div className="text-base">{user.address}</div>
              <Link
                to="address"
                className={`absolute right-4 top-[18px] text-sm underline hover:cursor-pointer text-secondary font-semibold`}
              >
                {t("change")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;