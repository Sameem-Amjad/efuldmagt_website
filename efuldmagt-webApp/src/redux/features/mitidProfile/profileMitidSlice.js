import { createSlice,} from "@reduxjs/toolkit";
import { startProfileMitIdValidation } from "./profileMitidThunk";
const initialState = {
    htmlContent: null, 
    isLoading: false,
    error: null,
};

const profileMitIdSlice = createSlice({
    name: "profileMitId",
    initialState,
    reducers: {
        resetProfileMitIdState: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(startProfileMitIdValidation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.htmlContent = null;
            })
            .addCase(startProfileMitIdValidation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.htmlContent = action.payload; 
            })
            .addCase(startProfileMitIdValidation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { resetProfileMitIdState } = profileMitIdSlice.actions;
export default profileMitIdSlice.reducer;