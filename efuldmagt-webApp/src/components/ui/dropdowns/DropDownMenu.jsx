/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const DropdownMenu = ({ selectedOption, setSelectedOption, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        className="flex flex-row"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className="text-black text-base">
          <span>Select{": "}</span>
          <span className="font-semibold">{selectedOption?.label}</span>
        </p>

        {isOpen ? (
          <FaChevronUp className="ml-2" />
        ) : (
          <FaChevronDown className="ml-2" />
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
          <ul className="py-2 text-gray-700">
            {options?.map((option) => (
              <li
                key={option?.key}
                onClick={() => {
                  setSelectedOption(option);
                  setIsOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                {option?.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
