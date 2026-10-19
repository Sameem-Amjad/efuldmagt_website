import getAxiosInstance from "./axiosProvider";

export async function updateUserInfo(token, userBody) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.put("/user/updateInfo", {
    ...userBody,
  });
  return response;
}

export async function getUsers({ q }) {
  let axiosInstance = getAxiosInstance();
  let response = await axiosInstance.get(`/user/users?q=${q}`);
  return response;
}

export async function updateUserSignature(token, formData) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.put("/user/uploadSignature", formData);

  return response;
}

export async function updateProfileImage(token, formData) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.put("/user/uploadProfileImage", formData);

  return response;
}

export async function getUser(id) {
  let axiosInstance = getAxiosInstance();
  let response = await axiosInstance.get(`/user/users/${id}`);

  return response;
}

export async function getUserByToken(token) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.get(`/user/user`);

  return response;
}

export async function getPresignedUrl(body) {
  let axiosInstance = getAxiosInstance();
  let response = await axiosInstance.post("/general/get-presigned-url", body);
  return response;
}

export async function uploadFileToS3(url, file) {
  let response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type, // Ensure correct MIME type (e.g., image/jpeg, image/png)
    },
    body: file, // Send file as binary
  });

  return response;
}

export async function getUserSignature(userId) {
  let axiosInstance = getAxiosInstance();
  let response = await axiosInstance.get(`user/getSignature/${userId}`);

  return response;
}
