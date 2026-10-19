/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";
import SetNotificationsItem from "@/components/ui/notifications/SetNotificationsItem";
import {
  updateFeedbackNotification,
  updateNewsNotification,
  updateSpecialOffersNotification,
} from "../../../../services/notification.services";
import { useCallback } from "react";
import { toast } from "react-toastify";

const OffersAndUpdateSettings = ({ notifications, setNotifications }) => {
  const token = localStorage.getItem("token");
  const { t } = useTranslation();
  const updateNotification = useCallback(
    async (type, key, value) => {
      try {
        const updateFunctions = {
          specialOffers: updateSpecialOffersNotification,
          news: updateNewsNotification,
          feedback: updateFeedbackNotification,
        };

        const updatedData = {
          ...notifications[type],
          [key]: value,
        };

        const res = await updateFunctions[type](token, updatedData);
        setNotifications((prev) => ({
          ...prev,
          [type]: updatedData,
        }));

        toast.success(res.data.message);
      } catch (error) {
        console.error(`Failed to update ${type} notification`, error);
        toast.error(t("failed_update_notification_settings"));      }
    },
    [notifications, setNotifications, token]
  );

  const handleNotificationChange = useCallback(
    (type, key) => (value) => updateNotification(type, key, value),
    [updateNotification]
  );

  return (
    <div className="md:w-4/5 lg:w-3/5 space-y-4 py-2 px-2">
      <div className="text-lg font-bold">Offers and Updates</div>
      <p className="text-md">
      {t("We will send you offers from lawyers in our partner network, as well as exclusive special offers tailored just for you.")}
      </p>

      <SetNotificationsItem
        className="mb-10"
        header={t("Special Offers")}
        subHeadingText={t("Offers and Updates")}
        text={t("receive_special_offers_text")}
        notification={notifications.specialOffers}
        handleEmailChange={handleNotificationChange("specialOffers", "email")}
        handlePushNotificationChange={handleNotificationChange(
          "specialOffers",
          "pushNotification"
        )}
      />

      <div className="text-lg font-bold mt-10">{t("updates_from_efulmagt_title")}</div>
      <p className="text-md mb-10">
       {t("stay_updated_prompt")}
      </p>

      <SetNotificationsItem
        header="News and Updates"
        subHeadingText="Offers and Updates"
        text="Get the latest news and updates from e-fuldmagt."
        notification={notifications.news}
        handleEmailChange={handleNotificationChange("news", "email")}
        handlePushNotificationChange={handleNotificationChange(
          "news",
          "pushNotification"
        )}
      />

      <SetNotificationsItem
        header="Feedback"
        subHeadingText="Offers and Updates"
        text="Share your feedback and help us improve our services."
        notification={notifications.feedback}
        handleEmailChange={handleNotificationChange("feedback", "email")}
        handlePushNotificationChange={handleNotificationChange(
          "feedback",
          "pushNotification"
        )}
      />
    </div>
  );
};

export default OffersAndUpdateSettings;
