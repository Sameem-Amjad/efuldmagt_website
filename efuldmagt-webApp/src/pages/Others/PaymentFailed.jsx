import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState(
    "Payment failed. Please try again."
  );
  const navigate = useNavigate();

  useEffect(() => {
    const error =
      searchParams.get("error") ||
      "Payment verification failed. Please contact support.";
    setErrorMessage(error);
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen text-center">
      <h1 className="text-red-500 text-2xl font-bold">Payment Failed ❌</h1>
      <p className="mt-2 text-gray-700">{errorMessage}</p>

      <div className="mt-5 space-x-4">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          onClick={() => navigate("/")}
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;
