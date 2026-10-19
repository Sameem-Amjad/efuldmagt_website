import { useEffect, useState } from "react";
import Loader from "../../components/global/Loaders/Loader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../../services/payment.service";
import {
  approveFuldmagtRequest,
  createFuldmagt,
} from "../../services/fuldmagt.services";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [status, setStatus] = useState("verifying"); // 'verifying', 'creating', 'success', 'error'
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId");
  const token = localStorage.getItem("token");
  const fuldmagtData = localStorage.getItem("fuldmagtData")
    ? JSON.parse(localStorage.getItem("fuldmagtData"))
    : null;

  useEffect(() => {
    const verifyAndCreateFuldmagt = async () => {
      if (!orderId) {
        setError("Order ID is missing in the URL.");
        setStatus("error");
        return;
      }

      try {
        const response = await verifyPayment(orderId);
        if (response.status === 200 && response.data.status === "Paid") {
          if (fuldmagtData) {
            if (fuldmagtData?.isRequest) {
              setStatus("approving");
              await handleApproveEfuldmagt();
            } else {
              setStatus("creating");
              await handleCreateFuldmagt();
            }
          } else {
            setStatus("success");
          }
        } else {
          throw new Error(
            "Payment verification failed. Please contact support."
          );
        }
      } catch (error) {
        setError(
          error?.response?.data?.message || "Payment verification failed"
        );
        setStatus("error");
      }
    };

    verifyAndCreateFuldmagt();
  }, [orderId]);

  const handleCreateFuldmagt = async () => {
    try {
      const response = await createFuldmagt(token, fuldmagtData?.body);

      localStorage.removeItem("fuldmagtData");
      toast.success(response?.data?.message || response?.data?.data?.message);
      setStatus("success");
      navigate("/");
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to create fuldmagt");
      setStatus("error");
    }
  };

  const handleApproveEfuldmagt = async () => {
    try {
      const response = await approveFuldmagtRequest(
        token,
        fuldmagtData?.body?.fuldmagtRequestId,
        {
          signature: fuldmagtData?.body?.signature,
          fuldmagtDocumentLink: fuldmagtData?.body?.fuldmagtDocumentLink, 
          fuldmagtDocumentKey: fuldmagtData?.body?.fuldmagtDocumentKey,
        }
      );

      localStorage.removeItem("fuldmagtData");
      toast.success(response?.data?.message || response?.data?.data?.message);
      setStatus("success");
      navigate("/");
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to approve fuldmagt");
      setStatus("error");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      {status === "verifying" && (
        <div className="text-center">
          <Loader />
          <p className="mt-2 text-gray-700">Verifying Payment...</p>
        </div>
      )}

      {status === "creating" && (
        <div className="text-center">
          <Loader />
          <p className="mt-2 text-gray-700">Creating Fuldmagt...</p>
        </div>
      )}

      {status === "success" && (
        <p className="text-green-600 text-xl font-bold">
          Payment Successful 🎉
        </p>
      )}

      {status === "error" && (
        <p className="text-red-500 text-xl font-bold">{error}</p>
      )}
    </div>
  );
};

export default PaymentSuccess;
