import getAxiosInstance from "./axiosProvider";

export async function getFuldmagtsList(token) {
  let slectedProfile= localStorage.getItem('activeProfile');
  const isCompany= slectedProfile==='company';
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.get(`/user/fuldmagts?isCompany=${isCompany}`);
  return response;
}



export async function getSpecificFuldmagtRequest(token, fuldmagtRequestId) {
  let axiosInstance = getAxiosInstance(token);

  let response = await axiosInstance.get(
    `/user/fuldmagt-requests/${fuldmagtRequestId}`
  );
  return response;
}

export async function approveFuldmagtRequest(
  token,
  fuldmagtRequestId,
  formData
) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.post(
    `/user/fuldmagt-requests/${fuldmagtRequestId}/approve`,
    formData
  );
  return response;
}

export async function getSpecificFuldmagt(token, fuldmagtId) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.get(`/user/fuldmagts/${fuldmagtId}`);
  return response;
}

export async function revokeFuldmagt(token, fuldmagtId) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.put(
    `/user/fuldmagts/${fuldmagtId}/revoke`
  );
  return response;
}

export async function issueAgainFuldmagt(token, fuldmagtId) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.put(
    `/user/fuldmagts/${fuldmagtId}/reissue`
  );
  return response;
}

export async function issueAgainRequest(token,fuldmagtID) {
  let axiosInstance=getAxiosInstance(token)
  let response=await axiosInstance.patch(
    `/user/fuldmagtsRequest/${fuldmagtID}/reissue`
  )
  
}

export async function createFuldmagt(token, formData) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.post(`/user/fuldmagts/`, formData);
  return response;
}

export async function requestFuldmagt(token, formData) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.post(`/user/fuldmagt-requests/`, formData);
  return response;
}

export async function getFuldmagt(token) {
  let axiosInstance = getAxiosInstance(token);
  // 1. Get the current value
  let selectedProfile = localStorage.getItem('activeProfile');
  if (!selectedProfile) {
    selectedProfile = 'user';
    localStorage.setItem('activeProfile', 'user');
  }
  const isCompany = selectedProfile === 'company';
  let response = await axiosInstance.get(`/user/fuldmagt-forms?isCompany=${isCompany}`);
  return response;
}
export async function getUploadUrl(token, fileName = Date.now()) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.post("/general/get-presigned-url", {
    fileName: fileName,
    fileExtension: "jpg",
  });
  return response;
}

export async function rejectFuldmagt(token, id) {
  console.log("token: ", token);

  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.delete(
    `/user/fuldmagt-requests/${id}/reject`
  );
  return response;
}

export async function getFuldmagtSpecified(token, id) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.get(`/user/fuldmagt-forms/${id}`);
  return response;
}

export async function acknowlegeFuldmagtRequest(token, id, signature) {
  let axiosInstance = getAxiosInstance(token);
  let response = await axiosInstance.put(`/user/fuldmagts/${id}/acknowledge`, {
    agentSignature: signature,
  });
  return response;
}

  export const handleCreateFuldmagt = async () => {
    try {
      const response = await createFuldmagt(token, fuldmagtData?.body);

      localStorage.removeItem("fuldmagtData");
      toast.success(response?.data?.message || response?.data?.data?.message);
      setStatus("success");
      navigate("/");
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to create fuldmagt");
      setStatus("error");
    }
  };



