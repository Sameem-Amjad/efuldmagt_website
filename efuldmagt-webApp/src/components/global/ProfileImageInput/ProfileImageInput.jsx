import { useRef } from "react";
import { defaultProfileImage } from "../../../utils/data/common";

const ProfileImageInput = ({ image, handler }) => {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newImageUrl = URL.createObjectURL(file);

      handler(newImageUrl, file);
    }
  };

  return (
    <div className="relative w-[163px] h-[163px]">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Profile Image */}
      <img
        src={image || defaultProfileImage} // Use a default placeholder if image is missing
        className="w-full h-full rounded-full object-cover cursor-pointer"
        onClick={handleImageClick}
        alt={image ? "Profile Image" : "Default Profile"}
      />
    </div>
  );
};

export default ProfileImageInput;
