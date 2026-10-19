import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { startProfileMitIdValidationAPI } from "../mitId/mitidThunk";
export const startProfileMitIdValidation = createAsyncThunk(
    "profileMitId/startValidation",
    async (payload, { rejectWithValue }) => {
        try {
            const htmlString = await startProfileMitIdValidationAPI({ email: payload.email });
            return htmlString; 
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to start MitID validation.";
            toast.error(errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);