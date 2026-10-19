import { createSignatureOrderAPI,checkSignatureStatusAPI } from "../../../services/mitid.services";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import getAxiosInstance from "../../../services/axiosProvider";

export const createSignatureOrder = createAsyncThunk(
    "mitid/createSignatureOrder",
    async (payload, { rejectWithValue }) => {
        const { pdfFile, token } = payload;
        try {
            const response = await createSignatureOrderAPI(pdfFile, token);
            return response.data; 
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to create signature order.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);


export const checkSignatureStatus = createAsyncThunk(
    "mitid/checkSignatureStatus",
    async (payload, { rejectWithValue }) => {
        try {
            const { orderId, signatoryId, token } = payload;
            const response = await checkSignatureStatusAPI({ orderId, signatoryId, token });
        
            return response; 
        } catch (error) {
            console.error("Axios error caught inside thunk:", error.response);
            
            const errorMessage = error.response?.data?.message || "Failed to verify signature status from thunk.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

export const startProfileMitIdValidationAPI = async ({ email }) => {
    const axiosInstance = getAxiosInstance(); 

    const response = await axiosInstance.get(
        "/user/auth/mitid/start/",
        {
            params: {
                email: email,
                client_type: "web"
            }
        }
    );
    
    return response.data;
};
