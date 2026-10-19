import React, { useState, useEffect } from "react";
import { useCountries } from "use-react-countries";

export default function PhoneInput({
  phoneNumber,
  setPhoneNumber,
  onCountryCodeChange,
  countryCodeName = "countryCode",
  phoneNumberName = "phoneNumber",
  required,
}) {
  const { countries } = useCountries();
  const [countryCode, setCountryCode] = useState("+235");
  const handleCountryCodeChange = (e) => {
    const selectedCode = e.target.value;
    setCountryCode(selectedCode);
    onCountryCodeChange(selectedCode);
  };

  const handlePhoneNumberChange = (e) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
  };

  return (
    <div className="flex p-1 border rounded-lg text-base inline">
      <select
        name={countryCodeName}
        value={countryCode}
        required={true}
        onChange={handleCountryCodeChange}
        className="pr-0 border-y-0 border-l-0 focus:border-black focus:outline-none focus:ring-0 text-base border-black"
      >
        {countries
          .filter(({ countryCallingCode }) => countryCallingCode.length <= 4)
          .map(({ countryCallingCode, flags }) => {
            return (
              <option value={countryCallingCode}>
                {countryCallingCode}
                {/* <object
                       type="image/svg+xml"
                       data="https://flagcdn.com/ke.svg"
                       style={{ width: '20px', height: 'auto' }}
                        >
                        </object> */}
              </option>
            );
          })}
      </select>
      <input
        type="text"
        required={required}
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        name={phoneNumberName}
        className="border-0 w-full focus:border-0 focus:outline-none focus:ring-0 text-base"
      />
    </div>
  );
}
