import { useEffect, useState } from "react";
import SettingsSVG from "@/assets/icons/settings.svg?react";
import { useNavigate } from "react-router-dom";
import { getUserNotifications } from "@/services/notification.services";
import NotificationItem from "../../../components/ui/notifications/NotificationItem";
import BackNavigation from "../../../components/global/common/BackNavigation";
import Loader from "../../../components/global/Loaders/Loader";
import { useTranslation } from "react-i18next";
const AllNotifications = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [todayNotifications, setTodayNotifications] = useState([]);
  const [earlierNotifications, setEarlierNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const result = await getUserNotifications(token);
        const fetchedNotifications = result?.data?.data?.notifications || [];

        let today = [];
        let earlier = [];

        fetchedNotifications.forEach((notification) => {
          notification.section === "today"
            ? today.push(notification)
            : earlier.push(notification);
        });

        setTodayNotifications(today);
        setEarlierNotifications(earlier);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="h-full w-full justify-center">
      <div className="flex w-full justify-between">
        <BackNavigation title={"Notifications"} />
        <button
          className="flex flex-col items-center"
          onClick={() => navigate("/notifications/settings")}
        >
          <SettingsSVG />
          <p>{t("Settings")}</p>
        </button>
      </div>

      <div className="flex justify-center w-full overflow-auto">
        <div className="flex flex-col w-4/5 lg:w-3/5">
          {todayNotifications.length > 0 && (
            <div className="text-md font-bold">{t("Today")}</div>
          )}
          {todayNotifications.map((item) => (
            <NotificationItem key={item._id} item={item} />
          ))}

          {earlierNotifications.length > 0 && (
            <div className="mt-10 text-md font-bold">{t("Earlier")}</div>
          )}
          {earlierNotifications.map((item) => (
            <NotificationItem key={item._id} item={item} />
          ))}
        </div>
      </div>
      {
        // If no notifications are found
        todayNotifications.length === 0 &&
          earlierNotifications.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg font-bold mt-5">{t("no_notifications_found")}</p>
            </div>
          )
      }
    </div>
  );
};

export default AllNotifications;
