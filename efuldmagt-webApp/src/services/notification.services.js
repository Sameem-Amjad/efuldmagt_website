import getAxiosInstance from './axiosProvider';

export async function getUserNotifications(token){
    let axiosInstance = getAxiosInstance(token);
    let response = await axiosInstance.get('/user/notifications');
    return response;
}

export async function addNotifcationId(token, {notificationId}){
    let axiosInstance = getAxiosInstance(token);
    let response = await axiosInstance.put('/user/add-notifications-token/', {notificationId});
    return response;
}

export async function getNotificationSettings(token){
    let axiosInstance = getAxiosInstance(token);
    let response = await axiosInstance.get('/user/notificationSettings');
    return response;
}

export async function setActivityNotification(token, data){
    let axiosInstance = getAxiosInstance(token);
    console.log(data);
    
    let response = await axiosInstance.put('/user/setActivityNotification',  data);
    return response;
}

export async function setReminderNotification(token, data){
    let axiosInstance = getAxiosInstance(token);
    let response = await axiosInstance.put('/user/setReminderNotification',  data);
    return response;
}

export async function updateFeedbackNotification(token, data){
    let axiosInstance = getAxiosInstance(token);
    let response = await axiosInstance.put('/user/setFeedbackNotification',  data);
    return response;
}

export async function updateSpecialOffersNotification(token, data){
    let axiosInstance = getAxiosInstance(token);
    let response = await axiosInstance.put('/user/setSpecialOfferNotification', data);
    return response;
}

export async function updateNewsNotification(token, data){
    let axiosInstance = getAxiosInstance(token);
    let response = await axiosInstance.put('/user/setNewsNotification', data);
    return response;
}
