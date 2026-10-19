import { useTranslation } from "react-i18next";
import SettingsItem from "../../components/ui/settings/SettingsItem";
import AboutSVG from "../../assets/icons/about.svg?react";
import CompanySVG from "../../assets/icons/company.svg?react";
import NotificationSVG from "../../assets/icons/notification.svg?react";
import PhoneSVG from "../../assets/icons/phone.svg?react";
import PolicySVG from "../../assets/icons/policies.svg?react";
import SecuritySVG from "../../assets/icons/security.svg?react";
import ServicesSVG from "../../assets/icons/services.svg?react";
import UserSVG from "../../assets/icons/user.svg?react";
import SignSVG from "../../assets/icons/sign.svg?react";
import LanguageSVG from "../../assets/icons/Language.svg?react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentlyActiveProfile } from "../../redux/features/user/userSlice";
import MitIdVerificationSetting from "./mitIdProfileSettings/MitIdVerificationSetting";



const ProfileSettings = () => {
  const { t } = useTranslation();
  const { user, currentlyActiveProfile } = useSelector((state) => state.user);
  const { company } = useSelector((state) => state.company);
  const dispatch = useDispatch();

  const handleToggle = (val) => {
    dispatch(setCurrentlyActiveProfile(val));
  };

  return (
    <div className="md:flex md:space-x-12 w-full">
      <div className="flex flex-col md:items-center w-1/5">
        <h2 className="text-md font-bold  mb-4">Accounts</h2>
        <div className="flex md:block p-1 md:border md:border-solid space-x-4 md:space-x-0 w-full md:h-[438px]  md:w-4/5 rounded-lg ">
          <div className="flex items-center justify-center w-[120px] h-[120px] md:w-full md:h-[215px]">
            <div
              onClick={() => handleToggle("user")}
              className={`flex flex-col space-y-2 items-center justify-center w-[120px] h-[120px] md:w-[144px] md:h-[144px]  border rounded-lg border-solid hover:cursor-pointer ${
                currentlyActiveProfile == "user"
                  ? "bg-primary bg-opacity-20 border-primary"
                  : ""
              }`}
            >
              <img
                src={user?.image}
                className="w-[64px] h-[64px] rounded-full object-cover"
              ></img>
              <p className="text-sm">
                {user?.name?.firstName + " " + user?.name?.lastName}
              </p>
            </div>
          </div>
          <hr className="hidden md:block border-dashed"></hr>
          <div className="flex items-center justify-center w-[120px] h-[120px] md:w-full md:h-[215px]">
            <div
              onClick={() => handleToggle("company")}
              className={`flex flex-col space-y-2 items-center cursor-pointer justify-center w-[120px] h-[120px] md:w-[144px] md:h-[144px]  border rounded-lg ${
                currentlyActiveProfile == "company"
                  ? "border-solid hover:cursor-pointer"
                  : "border-dashed"
              } ${
                currentlyActiveProfile == "company"
                  ? "bg-primary bg-opacity-20 border-primary"
                  : ""
              }`}
            >
                <CompanySVG className="w-[64px] h-[64px]" />
             
              <p className="text-sm">
                {company && company.companyName
                  ? company?.companyName
                  : "Not Available"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-8/12 lg:w-3/5">
        <h2 className="text-md font-bold mb-4">{"Settings"}</h2>
        <SettingsItem
          SvgItem={UserSVG}
          text={t("Personal Information")}
          navigateTo={"user"}
          className={"mb-2"}
        />
        {company ? (
          <SettingsItem
            SvgItem={CompanySVG}
            text={t("Company Information")}
            navigateTo={"company-settings"}
            className={"mb-2"}
          />
        ) : (
          <SettingsItem
            SvgItem={CompanySVG}
            text={t("Add Company")}
            navigateTo={"add-company"}
            className={"mb-2"}
          />
        )}

        <SettingsItem
          SvgItem={SignSVG}
          text={t("Signatures")}
          navigateTo={"signatures"}
          className={"mb-2"}
        />
        <SettingsItem
          SvgItem={SecuritySVG}
          text={t("Login and Safety")}
          navigateTo={"login-and-safety"}
          className={"mb-2"}
        />
        <SettingsItem
          SvgItem={LanguageSVG}
          text={t("Change Language")}
          navigateTo={"changelanguage"}
          className={"mb-2"}
        />
         <MitIdVerificationSetting />
        <SettingsItem
          SvgItem={NotificationSVG}
          text={t("Notifications")}
          navigateTo={"/notifications/settings"}
          className={"mb-2"}
        />
        <h2 className="text-md font-bold mb-4 mt-6">{t("Support")}</h2>
        <SettingsItem
          SvgItem={AboutSVG}
          text={t("How e-fuldmagt works")}
          navigateTo={"workflow"}
          className={"mb-2"}
        />
        <SettingsItem
          SvgItem={PhoneSVG}
          text={t("Contact Us")}
          navigateTo={"contact-us"}
          className={"mb-2"}
        />
        <h2 className="text-md font-bold mb-4 mt-6">
          {t("Services and Policies")}
        </h2>
        <SettingsItem
          SvgItem={ServicesSVG}
          text={t("Term of Service")}
          className={"mb-2"}
          navigateTo={
            "https://www.e-fuldmagt.dk/en/privatliv/handelsbetingelser"
          }
        />
        <SettingsItem
          SvgItem={PolicySVG}
          text={t("Privacy Policy")}
          navigateTo={
            "https://www.e-fuldmagt.dk/en/privatliv/handelsbetingelser"
          }
          className={"mb-2"}
        />
      </div>
    </div>
  );
};

export default ProfileSettings;
