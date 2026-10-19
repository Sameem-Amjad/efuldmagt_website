import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../components/global/Loaders/Loader"; 
import {setMitIdVerified} from "../../redux/features/user/userSlice"


const ProfileVerified = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [statusMessage, setStatusMessage] = useState("Verifying your profile...");

    useEffect(() => {
        // Parse the query parameters from the URL
        const searchParams = new URLSearchParams(location.search);
        const error = searchParams.get("error");

        if (error) {
            // --- HANDLE ERROR CASE ---
            // Decode the error message (e.g., "Authentication failed" from "Authentication%20failed")
            const decodedError = decodeURIComponent(error);
            
            setStatusMessage(`Verification Failed: ${decodedError}`);
            toast.error(decodedError);
            
            // Redirect home after 3 seconds
            setTimeout(() => navigate("/"), 3000);

        } else {
            // --- HANDLE SUCCESS CASE ---
            setStatusMessage("Profile verified successfully! Redirecting...");
            
            // 1. Dispatch the new reducer to update the state
            dispatch(setMitIdVerified());
            
            // 2. Show a success toast
            toast.success("Profile verified successfully!");
            
            // 3. Redirect home after 2 seconds
            setTimeout(() => navigate("/"), 2000);
        }
    // We only want this effect to run once on page load
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full text-center p-4">
            <LoadingSpinner />
            <h1 className="text-2xl font-semibold mt-4">{statusMessage}</h1>
            <p className="text-gray-600">Please wait, you will be redirected shortly.</p>
        </div>
    );
};

export default ProfileVerified;
