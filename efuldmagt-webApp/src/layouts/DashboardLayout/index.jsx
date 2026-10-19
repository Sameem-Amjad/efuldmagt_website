/* eslint-disable react/prop-types */
import { Link, useLocation, useNavigate } from "react-router-dom";
import rightImage from "@/assets/dashboard/right-side.png";
import leftImage from "@/assets/dashboard/left-side.png";
import ProfileDropdown from "@/components/ui/dropdowns/profileDropdown";
import DashboardDrawer from "@/components/ui/drawers/dashboardDrawer";
import TopNavbarButton from "@/components/ui/buttons/topNavBarButton";
import { menuItems } from "../../lib/menuItems";
import { useEffect } from "react";
import { requestPermission } from "../../utils/functions/functions";
import { onMessage } from "firebase/messaging";
import { messaging } from "../../firebaseConfig";
import { toast } from "react-toastify";
import { getFuldmagtsList } from "../../services/fuldmagt.services";
import { setFuldmagts } from "../../redux/features/fuldmagts/fuldmagtsSlice";
import { useDispatch } from "react-redux";
import { getUserNotifications } from "../../services/notification.services";
import { setNotifications } from "../../redux/features/notifications/notificationSlice";

const DashboardLayout = ({ children }) => {
  const pathName = useLocation().pathname;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    requestPermission();
  }, []);

  const getData = async () => {
    try {
      const [fuldmagtRes, userNotificationsRes] = await Promise.all([
        getFuldmagtsList(token),
        getUserNotifications(token),
      ]);

      console.log("fuldmagtRes:", fuldmagtRes);
      console.log("userNotificationsRes:", userNotificationsRes);

      dispatch(setFuldmagts(fuldmagtRes?.data?.data?.fuldmagts || []));
      dispatch(
        setNotifications(userNotificationsRes?.data?.data?.notifications || [])
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  onMessage(messaging, async (payload) => {
    try {
      toast(payload?.notification?.body || "New notification received");
      await getData();
    } catch (error) {
      console.error("Error in onMessage handler:", error);
    }
  });

  return (
    <>
      <div className="relative flex flex-col h-screen bg-white px-2 md:px-10">
        <img
          src={rightImage}
          className="z-0 absolute top-0 right-0 w-[60vh] h-screen"
        />
        <img
          src={leftImage}
          className="z-0  absolute left-0 bottom-0 w-[20vh] h-[50vh]"
        />

        <div className="mt-5 h-[85px]   justify-between items-center hidden md:flex">
          <Link to="/">
            <img className="w-[75px]" src={"/images/logo.jpeg"}></img>
          </Link>
          <div className="z-10 h-[75px] bg-white flex items-center w-2/5 lg:w-4/12 justify-around rounded-full shadow-md">
            {menuItems.map((item, index) => (
              <TopNavbarButton
                key={index}
                onClick={() => {
                  navigate(item.navigate);
                }}
                Icon={item.Icon}
                isSelected={item.isSelected}
                text={"Home"}
                iconType={item.iconType}
                imgClassName={item.imgClassName}
                active={pathName === item.path}
              >
                {item.text}
              </TopNavbarButton>
            ))}
          </div>
          <ProfileDropdown />
        </div>
        <div className="mt-5 h-[35px]  justify-between items-center flex md:hidden">
          <Link to="/">
            <img className="w-[30px]" src={"/images/logo.jpeg"}></img>
          </Link>

          <DashboardDrawer />
        </div>

        <div className="my-5 w-full h-full z-20 overflow-auto no-scrollbar">
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
