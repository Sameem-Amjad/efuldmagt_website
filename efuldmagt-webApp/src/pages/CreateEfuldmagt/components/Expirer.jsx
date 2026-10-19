/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
const defaultTime = 180; // Default: 3 hours ahead
import { useTranslation } from "react-i18next";
const Expirer = ({ setExpiry }) => {
  const {t}=useTranslation()
  const [chooseDate, setChooseDate] = useState(false);
  const [expiryDate, setExpiryDate] = useState(getLocalISODateTime(180)); // Default: 3 hours ahead
  const [error, setError] = useState(""); // Store validation error

  // Convert to local ISO string (YYYY-MM-DDTHH:MM) without UTC shift
  function getLocalISODateTime(offsetMinutes = 0) {
    const now = new Date();
    now.setMinutes(now.getMinutes() + offsetMinutes);
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  }

  const handleSelection = (isChoosingDate) => {
    setChooseDate(isChoosingDate);

    if (!isChoosingDate) {
      // If user selects "After 3 hours", set default expiry
      const newExpiry = getLocalISODateTime(defaultTime);
      setExpiryDate(newExpiry);
      setExpiry(new Date(newExpiry));
      setError(""); // Clear any previous error
    }
  };

  useEffect(() => {
    if (!chooseDate) {
      // If user selects "After 3 hours", set default expiry
      const newExpiry = getLocalISODateTime(defaultTime);
      setExpiryDate(newExpiry);
      setExpiry(new Date(newExpiry));
    }
  }, [chooseDate]);

  const handleExpiryChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const minDate = new Date();
    minDate.setMinutes(minDate.getMinutes() + 10);

    if (selectedDate < minDate) {
      setError(t("expiry_min_time_error"));;
      setExpiry(null); // Reset expiry if invalid
    } else {
      setError(""); // Clear error
      setExpiryDate(e.target.value);
      setExpiry(selectedDate);
    }
  };

  return (
    <div>
      <p className="font-semibold">{t("When should it expire?")}</p>
      <div className="text-center">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6">
          {["After 3 hours", "Choose Date and Time"].map((label, index) => (
            <button
              key={label}
              type="button"
              className={`w-[250px] h-[50px] rounded-full transition ${
                chooseDate === (index === 1)
                  ? "bg-primary text-secondary bg-opacity-20"
                  : "outline outline-1 outline-gray-300"
              }`}
              onClick={() => handleSelection(index === 1)}
            >
              {label}
            </button>
          ))}
        </div>

        {chooseDate && (
          <div className="flex flex-col items-center justify-center mt-4">
            <input
              type="datetime-local"
              className={`w-[250px] p-2 rounded-full border outline-none ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              value={expiryDate}
              onChange={handleExpiryChange}
              min={getLocalISODateTime(10)}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Expirer;
