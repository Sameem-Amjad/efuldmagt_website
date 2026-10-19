import { useEffect, useState } from "react";

import Switcher from "./components/Switcher";
import BackNavigation from "../../../components/global/common/BackNavigation";
import OffersAndUpdateSettings from "./components/OffersAndUpdateSettings";
import AccountSettings from "./components/AccountSettings";
import { getNotificationSettings } from "../../../services/notification.services";

export default function NotificationsSettings() {
  const [isAccount, setIsAccount] = useState(false);
  const token = localStorage.getItem("token");

  const [notifications, setNotifications] = useState({
    activityNotification: { email: true, pushNotification: false },
    feedback: { email: true, pushNotification: false },
    news: { email: true, pushNotification: false },
    reminder: { email: true, pushNotification: false },
    specialOffers: { email: false, pushNotification: false },
  });

  useEffect(() => {
    if (!token) return;

    getNotificationSettings(token)
      .then((res) => {
        const notificationSettings = res?.data?.data?.notificationSettings;
        console.log("notificationSettings: ", notificationSettings);

        if (notificationSettings) {
          setNotifications(notificationSettings);
        }
      })
      .catch((error) => console.error("Failed to fetch notifications", error));
  }, [token]);

  return (
    <div>
      <BackNavigation title={"Notifications Setting"} />
      <div className="h-full w-full flex  flex-col  items-center">
        <Switcher
          {...{
            isAccount,
            setIsAccount,
          }}
        />
        {!isAccount ? (
          <OffersAndUpdateSettings
            {...{
              notifications,
              setNotifications,
            }}
          />
        ) : (
          <AccountSettings
            {...{
              notifications,
              setNotifications,
            }}
          />
        )}
      </div>
    </div>
  );
}
