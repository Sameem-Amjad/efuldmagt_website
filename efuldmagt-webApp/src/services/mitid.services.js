import getAxiosInstance from "./axiosProvider";


export const createSignatureOrderAPI = async (pdfFile, token) => {
    let axiosInstance=getAxiosInstance(token)
    const formData = new FormData();
    formData.append("file", pdfFile, "fuldmagt-agreement.pdf");
    const response = await axiosInstance.post(`/midItSignature/create`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data; // Expected to be { message, data: { orderId, signatoryId, signLink } }
};


export const checkSignatureStatusAPI = async ({ orderId, signatoryId }, token) => {
    const axiosInstance = getAxiosInstance(token);

    // This now sends order_id and signatory_id as URL query parameters for the POST request.
    const response = await axiosInstance.get(
        `/midItSignature/callback`, 
        {
            params: {
                order_id: orderId,
                signatory_id: signatoryId,
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};



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