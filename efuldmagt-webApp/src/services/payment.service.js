import { toast } from "react-toastify";
import getAxiosInstance from "./axiosProvider";

// const paymentBaseUrl = "https://efulmagt-backend-payment-1.onrender.com";
// const paymentBaseUrl = "http://localhost:8000/payment";

const axiosInstance = getAxiosInstance();

const handlePayment = async (amount, currency) => {
  const orderId = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;

  try {
    const response = await axiosInstance.post("/payment/create-quickpay-link", {
      orderId,
      amount: amount * 100,
      currency,
    });

    // Open the payment URL in a new tab
    if (response.data.paymentUrl) {
      window.location.href = response.data.paymentUrl;
      return true;
    }
  } catch (error) {
    console.error("Payment link creation failed:", error);
    toast.error("Failed to create payment link");
  }
};

const verifyPayment = async (orderId) => {
  if (!orderId) throw new Error("Order ID is required");

  const response = await axiosInstance.get(
    `/payment/verify-payment/${orderId}`
  );
  return response;
};

export { handlePayment, verifyPayment };
