import { useEffect, useRef, useState } from "react";
import HomeSVG from "@/assets/icons/home.svg";
import NotificationSVG from "@/assets/icons/notification.svg";
import SideNavbarButton from "../buttons/sideNavBarButton";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@/assets/icons/menu.svg?react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../../redux/features/user/userSlice";
import userProfile from "@/assets/home/userProfile.webp";
import { useTranslation } from "react-i18next";
const menuItems = [
  {
    text: "Home",
    path: "/",
    navigate: "/",
    icon: HomeSVG,
  },
  {
    text: "Notifications",
    path: "/notifications",
    navigate: "/notifications",
    icon: NotificationSVG,
  },
];

export default function DashboardDrawer() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [drawer, setDrawer] = useState(false);
  const blurRef = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const toggleDrawer = () => {
    setDrawer(!drawer);
  };

  const handleClickOutside = (event) => {
    if (blurRef.current && blurRef.current.contains(event.target)) {
      setDrawer(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeProfile")
    dispatch(clearUser());
    navigate("/signin");
  };

  return (
    <div className="text-center z-40">
      <button
        onClick={toggleDrawer}
        className="text-white font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        type="button"
        data-drawer-target="drawer-example"
        data-drawer-show="drawer-example"
        aria-controls="drawer-example"
      >
        <MenuIcon />
      </button>
      <div
        ref={blurRef}
        className={
          "fixed top-0 left-0 z-30 h-screen w-screen p-4 blur-lg bg-white opacity-80 " +
          (drawer ? "-translate-x-0" : "-translate-x-full")
        }
      ></div>
      <div
        id="drawer-example"
        className={
          "flex flex-col shadow fixed top-0 left-0 z-40 h-screen p-4 transition-transform w-80 bg-white " +
          (drawer ? "-translate-x-0" : "-translate-x-full")
        }
        aria-labelledby="drawer-label"
      >
        {/* Profile Section with Toggle Arrow */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center mt-4 cursor-pointer"
            onClick={() => {
              navigate("/settings");
              setDrawer(false);
            }}
          >
            <img
              src={user?.image || userProfile}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="ml-4">
              <h2 className="font-semibold">
                {user?.name?.firstName + " " + user?.name?.lastName}
              </h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Navigation Links */}
        <div className="space-y-4">
          {menuItems.map((item) => (
            <SideNavbarButton
              key={item.text}
              onClick={() => {
                navigate(item.navigate);
                setDrawer(false);
              }}
              icon={item.icon}
            >
              {t(item.text)}
            </SideNavbarButton>
          ))}
        </div>
        <div className="h-full flex flex-col justify-end">
          <SideNavbarButton onClick={handleLogout} icon={NotificationSVG}>
            {t("Sign out")}
          </SideNavbarButton>
        </div>
      </div>
    </div>
  );
}
