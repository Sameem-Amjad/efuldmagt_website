import React, { useState } from "react";
import {
  getPresignedUrl,
  updateUserInfo,
  uploadFileToS3,
} from "../../../../services/user.services";
import { toast } from "react-toastify";
import ProfileImageInput from "../../../../components/global/ProfileImageInput/ProfileImageInput";
import { updateUserData } from "../../../../redux/features/user/userSlice";

import { useDispatch } from "react-redux";
const ChangeProfileImageWrapper = ({ user, setUser}) => {
  const dispatch=useDispatch()
  const token = localStorage.getItem("token");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);

  const changeProfileImage = async () => {
    try {
      setUploadingProfileImage(true);
      const res = await getPresignedUrl({
        fileName: user?.firstName + user?.lastName,
        fileExtension: uploadFile.name.split(".").pop(),
      });
      await uploadFileToS3(res?.data?.data?.url, uploadFile);

      const imageUrl = res?.data?.data?.imageUrl;
      
      await updateUserInfo(token, {
        image: imageUrl,
      });

      // Update Redux store
      dispatch(updateUserData({ image: imageUrl }));

      setUploadFile(null);
      toast.success("Profile image updated successfully");
    } catch (error) {
      console.log("error: ", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "error while changing profile image"
      );
    } finally {
      setUploadingProfileImage(false);
    }
  };

  const updateProfileImage = (imageUrl, file) => {
    setUser((prev) => ({
      ...prev,
      imageUrl,
    }));
    console.log("file: ", file);

    setUploadFile(file);
  };

  return (
    <>
      <ProfileImageInput image={user.imageUrl} handler={updateProfileImage} />
      {uploadFile && (
        <button
          onClick={changeProfileImage}
          disabled={uploadingProfileImage}
          className="bg-primary text-white p-1 px-2 text-sm rounded-md mt-2 disabled:opacity-50"
        >
          Upload {uploadingProfileImage && "ing..."}
        </button>
      )}
    </>
  );
};

export default ChangeProfileImageWrapper;