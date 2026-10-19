/* eslint-disable react/prop-types */
import { toast } from "react-toastify"; // Make sure toast is imported
import { useEffect } from "react";
const Switcher = ({ isRequest, setIsRequest, activeProfile }) => {
  const options = [
    { label: "Send", active: !isRequest, value: false },
    { label: "Request", active: isRequest, value: true },
  ];

  const handleOptionClick = (value) => {
    // if (value === true && activeProfile === 'company') {
    //   toast.error("Companies can't request fuldmagter.");
    //   return;
    // }

    setIsRequest(value);
  };
  // useEffect(() => {
  //   if (activeProfile === 'company' && isRequest) {
  //     setIsRequest(false);
  //   }
  // }, [activeProfile, isRequest, setIsRequest]);


  return (
    <div>
      <p className="font-semibold">e-fuldmagt for package Collection</p>
      <div className="flex items-center justify-center space-x-2 rounded-full bg-[#246C89] p-1 w-max mx-auto">
        {options.map(({ label, active, value }) => (
          <button
            type="button"
            key={label}
            className={`px-10 py-3 rounded-full text-sm font-bold transition ${active
              ? "bg-white text-primary shadow-md border-2 border-black"
              : "bg-white bg-opacity-50 text-primary border-2 border-transparent"
              }`}
            // 4. Call the new handler function on click
            onClick={() => handleOptionClick(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Switcher;