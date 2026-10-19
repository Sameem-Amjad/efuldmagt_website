/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

export default function NotificationItem({ item }) {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center p-4 border mb-1 rounded-lg shadow-sm cursor-pointer space-x-3 h-[64px]"
      onClick={() => {
        console.log("notification item: ", item);
        if (
          item?.data?.actionType == "create_fuldmagt" ||
          item?.data?.actionType == "revoke_fuldmagt" ||
          item?.data?.actionType == "reissue_fuldmagt" ||
          item?.data?.actionType == "acknowledge_fuldmagt"
        ) {
          navigate(`/e-fuldmagts/${item?.data?.fuldmagtId}`);
        } else if (
          item?.data?.actionType == "request_fuldmagt" ||
          item?.data?.actionType == "reject_fuldmagt_request" ||
          item?.data?.actionType == "approve_fuldmagt_request" ||
          item?.data?.actionType == "reissue_fuldmagt_request"
        ) {
          navigate(`/e-fuldmagt-requests/${item?.data?.fuldmagtRequestId}`);
        }
      }}
    >
      <img
        src={item?.imageUrl}
        alt={item?.user}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p className="text-gray-700  text-sm">{item?.body}</p>
        <p className="text-gray-500 text-sm">{item?.time}</p>
      </div>
    </div>
  );
}
