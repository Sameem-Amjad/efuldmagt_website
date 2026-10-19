/* eslint-disable react/prop-types */
import NotificationItem from "@/components/ui/notifications/NotificationItem";

const NotificationSection = ({ title, items }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2 overflow-auto">{title}</h3>
    {items.map((item, index) => (
      <NotificationItem key={index} item={item} />
    ))}
  </div>
);

export default NotificationSection;
