import { PhoneNumberUtil } from "google-libphonenumber";
import { getToken } from "firebase/messaging";
import { messaging } from "../../firebaseConfig";
import { addNotifcationId } from "../../services/notification.services";
import { toast } from "react-toastify";
import "../../firebaseConfig";

const phoneUtil = PhoneNumberUtil.getInstance();

export const validatePhone = (phone) => {
  try {
    console.log(phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone)));

    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

export async function requestPermission() {
  const authToken = localStorage.getItem("token");

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      toast.error(
        "Please allow notification permission to receive notifications"
      );
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_APP_VAPID_KEY,
    });

    console.log("Requesting notification permission: ", token);

    console.log("FCM Token:", token); // Debugging purpose

    // Send token to backend
    await addNotifcationId(authToken, { notificationId: token });
  } catch (error) {
    console.error("Error in requesting notification permission:", error);
    if (error.response?.data?.message === "Invalid Token") {
      console.warn("Invalid Token encountered");
    }
  }
}
