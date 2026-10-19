import HomeIcon from "@/assets/icons/home.svg?react";
import NotificationIcon from "@/assets/icons/notification.svg?react";

export const menuItems = [
  {
    text: "Home",
    path: "/",
    navigate: "/",
    Icon: HomeIcon,
    iconType: "svg",
  },
  {
    text: "Notifications",
    path: "/notifications",
    navigate: "/notifications",
    Icon: NotificationIcon,
    iconType: "svg",
  },
  {
    text: "Profile",
    path: "/profile-settings",
    navigate: "/profile-settings",
    Icon: "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659652_640.png",
    imgClassName: "rounded-full",
    iconType: "img",
  },
];
