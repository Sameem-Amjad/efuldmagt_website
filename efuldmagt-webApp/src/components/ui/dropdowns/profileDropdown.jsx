import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// Redux imports
import {
  clearUser,
  setCurrentlyActiveProfile,
} from "../../../redux/features/user/userSlice";
import { clearCompany } from "../../../redux/features/company/companySlice";

// Asset imports
import userProfile from "../../../assets/home/userProfile.webp";
import companyIcon from "../../../assets/icons/company.svg";

const ProfileDropdown = () => {
    const {t}=useTranslation()
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const menuRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const { user, currentlyActiveProfile } = useSelector((state) => state.user);
    const { company } = useSelector((state) => state.company);
    const dispatch = useDispatch();

    const companyExists = company && company.companyName;
    const showUser = currentlyActiveProfile === "user" || !companyExists;

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            menuRef.current &&
            !menuRef.current.contains(event.target)
        ) {
            setIsOpen(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("activeProfile")
        dispatch(clearUser());
        dispatch(clearCompany());
        navigate("/signin");
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block text-left shadow w-48 rounded-full bg-white">
            <div
                ref={dropdownRef}
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex items-center justify-center h-[66px] px-4 cursor-pointer"
            >
                {showUser ? (
                    <div className="flex items-center">
                        <img
                            src={user?.image || userProfile}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="ml-2 text-base font-semibold ">
                            {user?.name?.firstName}
                        </span>
                    </div>
                ) : (
                    // ✅ This is the corrected block
                    <div className="flex items-center">
                        <img
                            src={companyIcon}
                            alt="Company Profile"
                            className="w-10 h-10"
                        />
                        <span className="ml-2 text-base font-semibold ">
                            {company?.companyName}
                        </span>
                    </div>
                )}

                {isOpen ? (
                    <FaChevronUp className="ml-2" />
                ) : (
                    <FaChevronDown className="ml-2" />
                )}
            </div>

            {isOpen && (
                <div
                    ref={menuRef}
                    className="absolute z-40 right-0 shadow-lg mt-1 ring-1 ring-black ring-opacity-5 left-0 w-full bg-white text-black rounded-2xl"
                >
                    <div className="py-2 space-y-1" role="menu">
                        {companyExists &&
                            (currentlyActiveProfile === "user" ? (
                                <button
                                    role="menuitem"
                                    onClick={() => {
                                        dispatch(setCurrentlyActiveProfile("company"));
                                        setIsOpen(false);
                                    }}
                                    className="p-3 text-sm hover:bg-gray-200 rounded-sm cursor-pointer w-full text-left flex flex-row items-center"
                                >
                                    <img
                                        src={companyIcon}
                                        alt="Company Profile"
                                        className="w-7 h-7" // Also removed rounded-full here
                                    />
                                    <span className="ml-2 text-base ">{company?.companyName}</span>
                                </button>
                            ) : (
                                <button
                                    role="menuitem"
                                    onClick={() => {
                                        dispatch(setCurrentlyActiveProfile("user"));
                                        setIsOpen(false);
                                    }}
                                    className="p-3 text-sm hover:bg-gray-200 rounded-sm cursor-pointer w-full text-left flex flex-row items-center"
                                >
                                    <img
                                        src={user?.image || userProfile}
                                        alt="User Profile"
                                        className="w-7 h-7 rounded-full object-cover"
                                    />
                                    <span className="ml-2 text-base ">{user?.name?.firstName}</span>
                                </button>
                            ))}
                        <button
                            onClick={handleLogout}
                            className="p-3 text-base hover:bg-gray-200 rounded-sm cursor-pointer w-full text-left"
                            role="menuitem"
                        >
                            {t("Sign out")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;