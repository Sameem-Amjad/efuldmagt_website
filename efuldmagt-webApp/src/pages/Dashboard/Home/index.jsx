import homeNavImage from "@/assets/home/topNav.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { EFuldmagtItem } from "../../../components/ui/EfuldmentItem/EfuldmentItem";
import NotificationSection from "../../../components/global/NotificationSection";
import Loader from "../../../components/global/Loaders/Loader";
import {
  getFuldmagt,
  getFuldmagtsList,
} from "../../../services/fuldmagt.services";
import { getUserNotifications } from "../../../services/notification.services";
import { useDispatch, useSelector } from "react-redux";
import { setFuldmagts } from "../../../redux/features/fuldmagts/fuldmagtsSlice";
import { setNotifications } from "../../../redux/features/notifications/notificationSlice";
import { useTranslation } from "react-i18next";

export default function Home() {
  const navigate = useNavigate();
  const {t}=useTranslation()
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { fuldmagts } = useSelector((state) => state.fuldmagts);
  const { notifications } = useSelector((state) => state.notifications);

  const [earlierNotifications, setEarlierNotifications] = useState([]);
  const [todayNotifications, setTodayNotifications] = useState([]);
  const { currentlyActiveProfile } = useSelector((state) => state.user);
  const [fuldmagtForms, setFuldmagtForms] = useState([]);

  console.log("token: ", token);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);

        // Execute all requests in parallel
        const [fuldmagtFormRes, fuldmagtRes, userNotificationsRes] =
          await Promise.all([
            getFuldmagt(token),
            getFuldmagtsList(token),
            getUserNotifications(token),
          ]);

        console.log("fuldmagtFormRes:", fuldmagtFormRes);
        console.log("fuldmagtRes:", fuldmagtRes);
        console.log("userNotificationsRes:", userNotificationsRes);

        setFuldmagtForms(fuldmagtFormRes?.data?.data?.fuldmagtForms);
        dispatch(setFuldmagts(fuldmagtRes?.data?.data?.fuldmagts));
        dispatch(
          setNotifications(userNotificationsRes?.data?.data?.notifications)
        );
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [token, dispatch, currentlyActiveProfile]);

  useEffect(() => {
    setTodayNotifications(
      notifications.filter((n) => n.section === "today").slice(0, 6)
    );
    setEarlierNotifications(
      notifications.filter((n) => n.section === "earlier").slice(0, 6)
    );
  }, [notifications]);

  if (loading) {
    return <Loader />;
  }

  const handleFuldmagtFormSelect = (fuldmagt) => {
    navigate("/e-fuldmagts/request", { state: { fuldmagt } });
  };

  return (
    <div className="flex flex-col">
      <div className="w-full rounded-lg relative h-[295px]">
        <img
          src={homeNavImage}
          className="z-[0] absolute top-0 left-0 w-full rounded-lg h-[295px]"
        />
        <h2 className="z-[1] text-xl font-semibold absolute text-white top-3 left-3">
          Request or send
          <br />
          e-fuldmagt
        </h2>
      </div>

      <div className="w-full z-10 -mt-32 rounded-t-lg p-2">
        <div className="flex flex-row flex-wrap gap-2 justify-center">
          {fuldmagtForms.map((item) => (
            <div
              className="flex flex-col bg-white text-xl font-semibold text-primary p-2 rounded-lg shadow-lg h-[160px] md:h-[222px] w-[160px] md:w-[212px] text-left cursor-pointer"
              onClick={() => handleFuldmagtFormSelect(item)}
              key={item._id}
            >
              <div className="w-full flex justify-between mb-3">
                <img src={item.icon} alt="" className="w-7 h-7 rounded-full" />
                <p className="border border-green-400 flex justify-center items-center px-3 rounded-lg text-sm">
                  {item.price} DKK
                </p>
              </div>
              <p className="line-clamp-3 overflow-hidden text-ellipsis">
    {item.title}
  </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5 lg:space-y-0 md:flex flex-col lg:flex-row lg:space-x-12 md:justify-between p-2">
        <div className="w-full bg-white rounded-lg shadow-md outline-gray-200 outline outline-1 overflow-auto p-2">
          <h2 className="text-center text-xl font-semibold p-4">
            {t("My e-fuldmagt")}
          </h2>
          {fuldmagts.slice(0, 3).map((item) => {
            return <EFuldmagtItem key={item._id} item={item} />;
          })}
          {fuldmagts.length === 0 && (
            <h2 className="text-center text-base font-semibold p-2">
              {"No e-fuldmagt found"}
            </h2>
          )}
          {fuldmagts.length > 3 && (
            <Link to={"/allFuldmagts"}>
              <h2 className="text-center text-base font-semibold p-2 text-secondary underline">
                {"See All e-Fuldmagts"}
              </h2>
            </Link>
          )}
        </div>
        <div className="w-full bg-white rounded-lg shadow-md outline-gray-200 outline outline-1 p-2">
          <div className="flex justify-center items-center">
            <h2 className="text-center text-xl font-semibold p-4">
              Notifications
            </h2>
          </div>
          {todayNotifications.length > 0 && (
            <NotificationSection title={"Today"} items={todayNotifications} />
          )}
          {earlierNotifications.length > 0 && todayNotifications.length < 6 && (
            <NotificationSection
              title={"Earlier"}
              items={earlierNotifications.slice(
                0,
                6 - todayNotifications.length
              )}
            />
          )}

          {notifications.length === 0 && (
            <h2 className="text-center text-base font-semibold p-2">
              {"No notifications found"}
            </h2>
          )}
          {notifications.length > 3 && (
            <Link
              to="/notifications"
              className="flex items-center justify-center"
            >
              <h2 className="text-center text-base font-semibold p-2 text-secondary underline">
                {"See All Notifications"}
              </h2>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
