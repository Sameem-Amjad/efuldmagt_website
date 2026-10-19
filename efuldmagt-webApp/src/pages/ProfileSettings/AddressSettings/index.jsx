import { useState } from "react";
import { Custom_Input } from "../../../components/global/CustomInput/customInput";
import BackNavigation from "../../../components/global/common/BackNavigation";
import CompanyAddressForm from "./components/CompanyAddressForm";
import PrivateAddressForm from "./components/PrivateAddressForm";
import { useTranslation } from "react-i18next";

const AddressSettings = () => {
  const [isCompany, setIsCompany] = useState(false);
  const { t } = useTranslation();
  return (
    <div>
      <BackNavigation title="Address Settings" />
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center justify-center space-x-4 rounded-full bg-[#246C89] p-1 w-max mx-auto">
          {isCompany ? (
            <button
              className={`px-[40px] py-3 rounded-full bg-white bg-opacity-80 text-primary text-sm font-bold`}
              onClick={() => {
                setIsCompany(false);
              }}
            >
              {t("Private")}
            </button>
          ) : (
            <button
              className={`px-[40px] py-3 rounded-full bg-white text-primary text-sm font-bold`}
              onClick={() => {
                setIsCompany(false);
              }}
            >
              Private
            </button>
          )}
          {!isCompany ? (
            <button
              className={`px-[40px] py-3 rounded-full bg-white bg-opacity-80 text-primary text-sm font-bold`}
              onClick={() => {
                setIsCompany(true);
              }}
            >
              {t("Company")}
            </button>
          ) : (
            <button
              className={`px-[40px] py-3 rounded-full bg-white text-primary text-sm font-bold`}
              onClick={() => {
                setIsCompany(true);
              }}
            >
              Company
            </button>
          )}
        </div>
        {isCompany ? <CompanyAddressForm /> : <PrivateAddressForm />}
      </div>
    </div>
  );
};

export default AddressSettings;
