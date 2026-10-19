import { createSlice} from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { createSignatureOrder,checkSignatureStatus } from "./mitidThunk";


const initialState = {
    // Data from the create order call
    orderId: null,
    signatoryId: null,
    signLink: null,
    // Status from the check status call
    isVerified: false,
    // Loading states for each thunk
    createOrderLoading: false,
    checkStatusLoading: false,
    // Error state
    error: null,
};

const mitidSlice = createSlice({
    name: "mitid",
    initialState,
    reducers: {
        resetMitIdState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createSignatureOrder.pending, (state) => {
                state.createOrderLoading = true;
                state.error = null;
            })
            .addCase(createSignatureOrder.fulfilled, (state, action) => {
                state.createOrderLoading = false;
                state.orderId = action.payload.orderId;
                state.signatoryId = action.payload.signatoryId;
                state.signLink = action.payload.signLink;
            })
            .addCase(createSignatureOrder.rejected, (state, action) => {
                state.createOrderLoading = false;
                state.error = action.payload; 
            })

            .addCase(checkSignatureStatus.pending, (state) => {
                state.checkStatusLoading = true;
                state.error = null;
            })
            .addCase(checkSignatureStatus.fulfilled, (state, action) => {
                state.checkStatusLoading = false;
                
                // CORRECTED LOGIC
                const isSuccess = !!action.payload.serverSavePath;
                state.isVerified = isSuccess;

                if (!isSuccess) {
                    toast.warn("Verification is not yet complete. Please sign in the other tab.");
                }
            })
            .addCase(checkSignatureStatus.rejected, (state, action) => {
                state.checkStatusLoading = false;
                state.error = action.payload;
                state.isVerified = false;
            });
    },
});

export const { resetMitIdState } = mitidSlice.actions;

export default mitidSlice.reducer;