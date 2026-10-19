import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const checkEmailExists = createAsyncThunk(
  'auth/checkEmail',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/existing-email-phone`, {
        email: email,
      });

      return response.data.data;

    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);


export const checkPhoneExists = createAsyncThunk(
  'auth/checkPhone',
  async ({ phone }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/existing-email-phone`, {
        phone: phone,
      });

      return response.data.data;

    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);



