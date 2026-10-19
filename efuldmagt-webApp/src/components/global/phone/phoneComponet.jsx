/* eslint-disable react/prop-types */
import "react-international-phone/style.css";
import { PhoneInput } from "react-international-phone";
import { useEffect, useState } from "react";
import { validatePhone } from "../../../utils/functions/functions";

const PhoneComponent = ({ phone, setPhone }) => {
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  useEffect(() => {
    if (phone) {
      setIsPhoneValid(validatePhone(phone));
    }
  }, [phone]);

  return (
    <div className="flex">
      <PhoneInput
        defaultCountry="dk"
        value={phone}
        onChange={(value) => setPhone(value)}
        inputProps={{
          name: "phone",
          required: true,
          autoFocus: true,
        }}
        inputClassName={"w-full rounded-full font-block"}
        className={`w-full focus-within:ring-[#3CB4E4] focus-within:ring-2 border rounded p-1 ${
          !isPhoneValid ? "border-red-500" : "border-gray-200"
        }`}
        style={{
          "--react-international-phone-border-color": "transparent",
        }}
      />
    </div>
  );
};

export default PhoneComponent;
