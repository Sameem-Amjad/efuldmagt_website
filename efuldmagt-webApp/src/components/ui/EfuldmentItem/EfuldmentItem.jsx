/* eslint-disable react/prop-types */
import { formatToDateOnly } from "@/utils/functions/datefunctions";
import { useNavigate } from "react-router-dom";

// This new helper function determines the correct status for a REQUEST
const getRequestStatus = (item) => {
    // 1. Check for expiry first, as it overrides a pending status
    const isExpired = new Date() > new Date(item.expiry);

    if (item.revoked === true) {
        return { text: "Revoked", className: "bg-yellow-100 text-yellow-600" };
    }
    
    if (isExpired && item.requestStatus === "pending") {
        return { text: "Expired", className: "bg-red-100 text-red-700" };
    }
    
    // 3. If not expired, continue with the original logic
    if (item.requestStatus === "approved") {
        return { text: "Approved", className: "bg-green-100 text-green-700" };
    }

    if (item.requestStatus === "pending") {
        return { text: "Pending", className: "bg-yellow-100 text-yellow-500" };
    }

    if (item.requestStatus === "rejected") {
        return { text: "Rejected", className: "bg-red-100 text-red-700" };
    }

    // Fallback for other unhandled statuses
    return { text: item.requestStatus, className: "bg-gray-100 text-gray-700" };
};


export const EFuldmagtItem = ({ item }) => {
    const navigate = useNavigate();

    const navigateToFuldmagt = (item) => {
        // This navigation logic is correct based on your API data
        const path =
            item.status === "sent_request" || item.status === "received_request"
                ? `/e-fuldmagt-requests/${item._id}`
                : `/e-fuldmagts/${item._id}`;
        navigate(path, { state: { item } });
    };

    return (
        <div className="flex items-center justify-between px-4 border mb-1 rounded-lg cursor-pointer py-2">
            <div
                onClick={() => navigateToFuldmagt(item)}
                className="flex items-center w-full"
            >
                <div className="flex items-center">
                    <img
                        src={item.icon}
                        alt={item.title}
                        className="w-20 h-20 rounded-full mr-4 object-cover bg-primary/20 p-4"
                    />
                    <div className="flex flex-col justify-between h-[70px]">
                        <p>
                            <span className="font-semibold text-md">{item.title} </span>
                            <span className="text-gray-500 text-xs">
                                Issued: {formatToDateOnly(item.createdAt)}
                            </span>
                        </p>
                       {item.isRequest ? 
                        (
                            <p className="text-gray-500 text-xs font-semibold">
                                Requested from {item.agentName} for <br />
                                {item.fuldmagtGiverName}
                            </p>
                            ) :
                            (
                            <p className="text-gray-500 text-xs font-semibold">E-fuldmagt for {item.fuldmagtGiverName}</p>
                            )}
                    </div>
                </div>
            </div>
            <div>
                {/* This block is for regular Fuldmagts and is correct */}
                {item.requestStatus === null ? (
                    <div className="flex flex-col justify-between items-end h-[70px]">
                        <p className="font-semibold text-md">Validity</p>
                        <p
                            className={`font-semibold text-xs ${
                                item.validity == "expired"
                                    ? "text-red-500"
                                    : item.validity == "revoked"
                                    ? "text-orange-500"
                                    : "text-blue-500"
                            }`}
                        >
                            {item.validity == "expired" ||
                            item.validity == "revoked" ||
                            item.validity == "request"
                                ? item.validity[0].toUpperCase() +
                                  item.validity.slice(1).toLowerCase()
                                : formatToDateOnly(item.validity)}
                        </p>
                    </div>
                ) : (
                    // ✅ This block is for REQUESTS and is now fixed
                    // It uses the new helper function to get the correct status
                    (() => {
                        const status = getRequestStatus(item);
                        return (
                            <div className={`px-2 py-1 font-medium text-sm rounded-lg ${status.className}`}>
                                {status.text}
                            </div>
                        );
                    })()
                )}
            </div>
        </div>
    );
};
