import { createSlice } from "@reduxjs/toolkit";
import { checkEmailExists, checkPhoneExists } from "./userThunk";

// Updated initial state to handle both email and phone checks
const initialState = {
  user: {},
  currentlyActiveProfile: localStorage.getItem('activeProfile') || 'user',  emailCheckStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  emailExists: null,
  phoneCheckStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  phoneExists: null,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    updateUserData: (state, action) => {
      const updatedFields = action.payload;

     if (updatedFields.name) {
        state.user.name = { ...state.user.name, ...updatedFields.name };
      }

      if (updatedFields.phone) {
        state.user.phone = { ...state.user.phone, ...updatedFields.phone };
      }

      if (updatedFields.email) {
        state.user.email = updatedFields.email;
      }
      if (updatedFields.image) {
        state.user.image = updatedFields.image;
      }
    },
    clearUser: (state) => {
      state.user = {};
      state.emailCheckStatus = 'idle';
      state.emailExists = null;
      state.phoneCheckStatus = 'idle';
      state.phoneExists = null;
      state.error = null;
    },
setCurrentlyActiveProfile: (state, action) => {
      const newProfile = action.payload;
      state.currentlyActiveProfile = newProfile;
      localStorage.setItem('activeProfile', newProfile);
    },
        setMitIdVerified: (state) => {
        if (state.user) {
            state.user.mitIdVerified = true;
        }
    }
  },


  extraReducers: (builder) => {
    builder
      // Cases for checkEmailExists
      .addCase(checkEmailExists.pending, (state) => {
        state.emailCheckStatus = 'loading';
        state.error = null;
      })
      .addCase(checkEmailExists.fulfilled, (state, action) => {
        state.emailCheckStatus = 'succeeded';
        state.emailExists = action.payload;
      })
      .addCase(checkEmailExists.rejected, (state, action) => {
        state.emailCheckStatus = 'failed';
        state.error = action.payload;
      })
      // --- NEW: Cases for checkPhoneExists ---
      .addCase(checkPhoneExists.pending, (state) => {
        state.phoneCheckStatus = 'loading';
        state.error = null;
      })
      .addCase(checkPhoneExists.fulfilled, (state, action) => {
        state.phoneCheckStatus = 'succeeded';
        state.phoneExists = action.payload;
      })
      .addCase(checkPhoneExists.rejected, (state, action) => {
        state.phoneCheckStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser, setCurrentlyActiveProfile,updateUserData,setMitIdVerified } = userSlice.actions;
export default userSlice.reducer;