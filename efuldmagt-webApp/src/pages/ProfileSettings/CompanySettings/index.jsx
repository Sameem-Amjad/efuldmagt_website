import SettingsInput from "../../../components/global/SettingInput/SettingsInput";
import SettingsEmailInput from "../../../components/global/SettingsEmailInput/SettingsEmailInput";
import SettingsPhoneInput from "../../../components/global/SettingsPhoneInput/SettingsPhoneInput";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import BackNavigation from "../../../components/global/common/BackNavigation";

const CompanySettingsPage = () => {
  const { company } = useSelector((state) => state.company);

  const fieldHandler = (field) => {
    return (value) => {
      let newCompany = { ...company };
      newCompany[field] = value;
    };
  };

  const changeCVR = (value) => {
    console.log(value);
  };

  const changeName = (value) => {
    console.log(value);
  };

  const sendOTPToEMail = async (value) => {
    console.log("Sending OTP to email:", value);
  };

  const verifyEmailOTP = async (otp) => {
    console.log("Verifying email OTP:", otp);
  };

  const sendOTPToPhone = async (value) => {
    console.log("Sending OTP to phone:", value);
  };

  const verifyPhoneOTP = async (otp) => {
    console.log("Verifying phone OTP:", otp);
  };

  return (
    <div>
      <BackNavigation title="Company Info" />
      <div className="flex flex-col w-full items-center justify-center">
        <div className="w-full md:w-[400px]">
          <div>
            <p className="text-md font-bold mt-4 mb-2">CVR</p>
            <SettingsInput
              disabled
              input={company.cvr}
              type={"text"}
              setInput={fieldHandler("cvr")}
              updateFunction={changeCVR}
            />
            <p className="text-md font-bold mt-4 mb-2">Company Name</p>
            <SettingsInput
              disabled
              input={company.companyName}
              type={"text"}
              setInput={fieldHandler("companyName")}
              updateFunction={changeName}
            />
            <p className="text-md font-bold mt-4 mb-2">Email</p>
            <SettingsEmailInput
              disabled
              input={company.email}
              type={"text"}
              setInput={fieldHandler("email")}
              sendOTPToEMail={sendOTPToEMail}
              verifyOTP={verifyEmailOTP}
            />
            <p className="text-md font-bold mt-4 mb-2">Phone</p>
            <SettingsPhoneInput
              disabled
              input={company?.phone?.countryCode + company?.phone?.number}
              setInput={fieldHandler("phone")}
              sendOTPToPhone={sendOTPToPhone}
              verifyOTP={verifyPhoneOTP}
            />
            <p className="text-md font-bold mt-4 mb-2">Address</p>
            <div className="flex relative w-full h-[54px] px-2 border border-solid items-center rounded-lg">
              <div className="text-base">{`${company?.address?.address}, ${company?.address?.city}, ${company?.address?.country}`}</div>
              <Link
                to="/profile-settings/user/address"
                className={`absolute right-4 top-[18px] text-sm underline hover:cursor-pointer text-secondary font-semibold`}
              >
                Change
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySettingsPage;
