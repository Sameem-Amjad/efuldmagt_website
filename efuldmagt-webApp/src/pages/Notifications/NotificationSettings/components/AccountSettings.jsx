/* eslint-disable react/prop-types */
import {
  setActivityNotification,
  setReminderNotification,
} from "../../../../services/notification.services";
import { toast } from "react-toastify";
import SetNotificationsItem from "@/components/ui/notifications/SetNotificationsItem";
import { useTranslation } from "react-i18next";
const AccountSettings = ({ notifications, setNotifications }) => {
  const token = localStorage.getItem("token");
  const { t } = useTranslation();
  // Generic handler for updating notification settings
  const handleNotificationChange = async (type, field, value) => {
    const updatedNotifications = {
      ...notifications,
      [type]: {
        ...notifications[type],
        [field]: value,
      },
    };

    try {
      let res;
      if (type === "activityNotification") {
        res = await setActivityNotification(token, updatedNotifications[type]);
      } else if (type === "reminder") {
        res = await setReminderNotification(token, updatedNotifications[type]);
      }

      setNotifications(updatedNotifications);
      toast.success(res?.data?.message || t("notification_settings_updated"));
    } catch (error) {
      console.error(`Failed to update ${type} notifications`, error);
      toast.error(t("failed_update_notification_settings"));    }
  };

  return (
    <div className="md:w-4/5 lg:w-3/5 space-y-4 py-2 px-2">
      <div className="text-lg font-bold">{t("Account activity and policies")}</div>
      <p className="text-md">
       {t("Get notified when someone sends you a Request or that have signed.")}
      </p>
      <SetNotificationsItem
        className="mb-10"
        header="Account Activity"
        subHeadingText="Account Activity"
        text="We will notify you about any activity"
        notification={notifications.activityNotification}
        handleEmailChange={(value) =>
          handleNotificationChange("activityNotification", "email", value)
        }
        handlePushNotificationChange={(value) =>
          handleNotificationChange(
            "activityNotification",
            "pushNotification",
            value
          )
        }
      />
      <div className="text-lg font-bold mt-10">Reminders</div>
      <p className="text-md mb-10">
       {t("Get important reminders about your power Of Attorney and your account activity.")}
      </p>
      <SetNotificationsItem
        header={t("Reminders")}
        subHeadingText={t("Reminders")}
        text={t("We will notify you about remainders.")}
        notification={notifications.reminder}
        handleEmailChange={(value) =>
          handleNotificationChange("reminder", "email", value)
        }
        handlePushNotificationChange={(value) =>
          handleNotificationChange("reminder", "pushNotification", value)
        }
      />
    </div>
  );
};

export default AccountSettings;
