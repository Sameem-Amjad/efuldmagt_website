/* eslint-disable react/prop-types */
import { useState } from "react";
import PhoneComponent from "../../../components/global/phone/phoneComponet";
import UserSearchBar from "../../../components/ui/searchBars/UserSearchBar";
import { useTranslation } from "react-i18next";
const PackagePicker = ({
  setSelectedUser,
  isChooseMannually,
  setChooseMannually,
  selectedUser,
  register,
  errors,
  phone,
  setPhone,
}) => {
  // State to remember the previously selected user when toggling to manual mode
  const [previousUser, setPreviousUser] = useState(null);
  const { t } = useTranslation();
  const [searchBarKey, setSearchBarKey] = useState(0);

  // When a user is selected from the search bar
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setChooseMannually(false);
    setPreviousUser(null); // Clear any previously remembered user
  };

  // Handles toggling between search and manual entry
   const handleManualToggle = () => {
    if (!isChooseMannually) {
      setPreviousUser(selectedUser); // Remember the current user
      setSelectedUser(null);         // Clear the active user for the form
      setChooseMannually(true);
      setSearchBarKey(prev => prev + 1); // <--- RESET SEARCH BAR HERE
    } else {
      setSelectedUser(previousUser);  // Restore the remembered user
      setPreviousUser(null);          // Clear the temporary state
      setChooseMannually(false);
    }
  };


  const handleSearchClick = () => {
    if (isChooseMannually) {
        setChooseMannually(false);
    }
  };

  return (
    <>
      <div>
        <p className="font-semibold">{t("Who will pickup the package for you?")}</p>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 items-center w-full justify-around rounded-full p-1">
          <UserSearchBar
            key={searchBarKey} // <--- ADD KEY TO RESET COMPONENT
            className="w-full p-3"
            setSelectedUser={handleSelectUser}
            onFocus={handleSearchClick}
          />

          <div className="flex md:flex-col items-center w-full md:w-1/2">
            <div className="hidden md:block border-l border-gray-400 h-12"></div>
            <hr className="md:hidden w-full" />
            <span className="text-gray-500 my-2">{t("or_divider")}</span>            <hr className="md:hidden w-full" />
            <div className="hidden md:block border-l border-gray-400 h-12"></div>
          </div>

          <button
            type="button"
            className={`w-full h-[100px] rounded-full border-2 ${
              isChooseMannually
                ? "border-solid text-secondary font-bold"
                : "border-dashed"
            }`}
            onClick={handleManualToggle}
          >
            {isChooseMannually ? t("Cancel Manual Typing") : t("Type Manually")}
          </button>
        </div>
      </div>

      {isChooseMannually && !selectedUser && (
        <div className="flex flex-col items-center w-full md:w-[416px] p-4">
          <label className="block">{t("Full Name")}</label>
          <input
            type="text"
            placeholder="First Name"
            className={`w-full border-2 p-2 rounded-md mt-3 ${
              errors.firstName
                ? "border-red-500 focus-within:border-red-500"
                : "border-gray-200 focus-within:border-gray-200"
            }`}
            {...register("firstName", { required: "First name is required" })}
          />
          <input
            type="text"
            placeholder="Last Name"
            className={`w-full border-2 p-2 rounded-md mt-3 ${
              errors.lastName
                ? "border-red-500 focus-within:border-red-500"
                : "border-gray-200 focus-within:border-gray-200"
            }`}
            {...register("lastName", { required: "Last name is required" })}
          />

          <label className="block mt-4">{t("Date of Birth")}</label>
          <input
            type="date"
            className={`w-full border-2 p-2 rounded-md mt-3 ${
              errors.userDOB
                ? "border-red-500 focus-within:border-red-500"
                : "border-gray-200 focus-within:border-gray-200"
            }`}
            {...register("userDOB", { required: "Date of Birth is required" })}
          />

          <label className="block mt-4">{t("personal_info")}</label>
          <input
            type="email"
            placeholder="Email"
            className={`w-full border-2 p-2 rounded-md mt-3 ${
              errors.email
                ? "border-red-500 focus-within:border-red-500"
                : "border-gray-200 focus-within:border-gray-200"
            }`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
            })}
          />

          <div className="mt-3 w-full">
            <PhoneComponent phone={phone} setPhone={setPhone} />
          </div>
        </div>
      )}
    </>
  );
};

export default PackagePicker;