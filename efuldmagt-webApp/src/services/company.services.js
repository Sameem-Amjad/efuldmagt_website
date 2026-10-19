import getAxiosInstance from "./axiosProvider";

export async function updateCompanyPhoneNumber(
  token,
  { encryptedOTPToken, otp }
) {
  console.log(encryptedOTPToken, otp);
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.put("/company/updatePhoneNumber", {
    encryptedOTPToken,
    otp,
  });
  return response;
}

export async function updateCompanyEmail(token, { encryptedOTPToken, otp }) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.put("/company/updateEmail", {
    encryptedOTPToken,
    otp,
  });
  return response;
}

export async function getCompanies({ token, q }) {
  let axiosInstance = getAxiosInstance(token);
  console.log("is Token attached?", axiosInstance.defaults.headers.common["Authorization"]);
  let response = await axiosInstance.get(`/company/getCompanies?q=${q}`);
  return response;
}

export async function addCompany(
  token,
  { cvr, companyName, email, phone, address }
) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.post(`/company/registerUnverified`, {
    cvr,
    companyName,
    email,
    phone,
    address,
  });
  return response;
}

export async function assignCompany(token, companyId) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.put(`/company/assignCompany/${companyId}`);
  return response;
}

export async function updateCompanySign(token, formData) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.put("/company/uploadSignature", formData);
  return response;
}

export async function updateCompanyInfo(token, companyBody) {
  console.log(companyBody);
  console.log(token);

  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.put("/company/update", { ...companyBody });
  return response;
}
