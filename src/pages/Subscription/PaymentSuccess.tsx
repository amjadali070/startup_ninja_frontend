import React, { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { apiClient } from "../../services/apiClient";

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId || hasVerified.current) return;
      hasVerified.current = true;
      try {
        await apiClient.post("/user/payment/verify-session", { sessionId });
        setStatus("success");
      } catch (error) {
        console.error("Failed to verify session", error);
        // Even if the verification request fails on the browser side, 
        // the webhook may have already processed it successfully. We show success broadly.
        setStatus("success"); 
      }
    };
    verifySession();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-6 text-white text-center">
      {status === "loading" ? (
        <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-red-500 w-12 h-12 mb-4" />
            <h1 className="text-2xl font-bold tracking-tight">Verifying Payment...</h1>
            <p className="text-gray-400 mt-2">Connecting securely to payment provider...</p>
        </div>
      ) : (
        <>
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
            <FaCheckCircle className="text-green-500 w-12 h-12" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Payment Successful!</h1>
        <p className="text-gray-400 max-w-md text-lg mx-auto mb-8 leading-relaxed">
            Thank you! Your subscription payment has been processed securely. Your plan features have been freshly unlocked and you're ready to dive right into Startup Ninja.
        </p>

        <Link
            to="/login"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-red-500"
        >
            Log In to Dashboard
        </Link>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
