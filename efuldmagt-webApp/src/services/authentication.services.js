import getAxiosInstance from "./axiosProvider";

export async function login({ credentials, pin }) {
  let axiosInstance = getAxiosInstance();
  let response = await axiosInstance.post("/user/login", {
    credentials,
    pin,
  });
  return response;
}

export async function sendOTP(credentials) {
  let axiosInstance = getAxiosInstance();
  let response = await axiosInstance.post("/user/sendOTP", {
    ...credentials,
  });
  return response;
}

export async function forgetPasscodeSendOTP(credentials) {
  let axiosInstance = getAxiosInstance();
  let response = await axiosInstance.post("/user/forget-password/sendOTP", {
    ...credentials,
  });
  return response;
}




export async function verifySignupOTP({ encryptedOTPToken, otp }) {
  let axiosInstance = getAxiosInstance();
  let response = await axiosInstance.post("/user/signup/verifyOTP", {
    encryptedOTPToken,
    otp,
  });
  return response;
}

export async function verifyForgotPasswordOTP({ encryptedOTPToken, otp }) {
  let axiosInstance = getAxiosInstance();
  let response = await axiosInstance.post("/user/forgot-password/verifyOTP", {
    encryptedOTPToken,
    otp,
  });
  return response;
}

export async function registerUser({
  emailCredentialsToken,
  phoneCredentialsToken,
  name,
  address,
  dateOfBirth,
}) {
  let axiosInstance = getAxiosInstance();
  let response = await axiosInstance.post("/user/signup/registerUser", {
    emailCredentialsToken,
    phoneCredentialsToken,
    name,
    address,
    dateOfBirth,
  });
  return response;
}

export async function createPassword({ createPasswordToken, pin }) {
  let axiosInstance = getAxiosInstance();
  let response = await axiosInstance.post("/user/create-password", {
    createPasswordToken,
    pin,
  });
  
  return response;
}

export async function changePassword(token, { oldPin, newPin }) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.put("/user/setPassword", {
    oldPin,
    newPin,
  });
  return response;
}

export async function deleteUserAccount(token) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.delete("/user/deactivateAccount");
  return response;
}

export async function updatePhoneNumber(token, { encryptedOTPToken, otp }) {
  console.log(encryptedOTPToken, otp);
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.put("/user/updatePhoneNumber", {
    encryptedOTPToken,
    otp,
  });
  return response;
}

export async function updateEmail(token, { encryptedOTPToken, otp }) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.put("/user/updateEmail", {
    encryptedOTPToken,
    otp,
  });
  // setTimeout(() => window.location.reload(), 1000);
  return response;
}

export async function verifyPassword(token, { pin }) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.post("/user/verifyPassword", { pin });
  return response;
}
