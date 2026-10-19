import { useRef, useState } from "react";
import CloseSVG from "../../../assets/icons/close.svg?react";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../Loaders/Loader";

export default function SettingsInput({
  input,
  setInput,
  type = "text",
  placeholder = "",
  disabled = false,
  updateFunction,
  className = "",
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [preValue, setPreValue] = useState(input);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await updateFunction(inputRef.current.value);
      console.log("res: ", res);

      setIsEditing(false);
      toast.success("Field updated successfully");
    } catch (error) {
      console.log("error: ", error);

      toast.error(error.response?.data?.message || error.message);
      setInput(preValue);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setInput(preValue);
    setIsEditing(false);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        value={input}
        ref={inputRef}
        onChange={(e) => setInput(e.target.value)}
        className="py-3 w-full rounded-lg text-base border-gray-500"
        disabled={!isEditing}
        placeholder={placeholder}
      />

      {!isEditing && !disabled && (
        <p
          onClick={() => {
            setIsEditing(true);
            setPreValue(input);
          }}
          className="absolute right-4 top-[18px] text-sm underline cursor-pointer text-secondary font-semibold"
        >
          Change
        </p>
      )}

      {/* Buttons for desktop */}
      {isEditing && (
        <div className=" w-full space-x-2 justify-between my-4 hidden md:flex">
          <button
            disabled={loading}
            className="h-[46px] w-1/2 text-base font-bold text-black bg-[#F3F3F3] rounded-lg border"
            onClick={handleCancel}
          >
            Decline
          </button>
          <button
            disabled={loading}
            onClick={handleUpdate}
            className="h-[46px] w-1/2 text-base font-bold text-white bg-primary rounded-lg border disabled:bg-opacity-50"
          >
            Update {loading && <LoadingSpinner />}
          </button>
        </div>
      )}

      {/* Mobile modal for editing */}
      {isEditing && (
        <div className="z-40 md:hidden fixed top-0 left-0 h-screen w-screen">
          <div className="flex flex-col justify-end h-full">
            <div
              className="w-full h-full bg-white bg-opacity-40"
              onClick={handleCancel}
            />
            <div className="py-8 w-full border bg-white rounded-t-[30px]">
              <div className="relative">
                <div
                  className="absolute top-2 left-4 cursor-pointer"
                  onClick={handleCancel}
                >
                  <CloseSVG />
                </div>
                <div className="text-center mx-6 space-y-5">
                  <div className="text-md font-semibold">Update Field</div>
                  <input
                    type={type}
                    value={input}
                    ref={inputRef}
                    onChange={(e) => setInput(e.target.value)}
                    className="h-[54px] w-full rounded-lg text-base"
                    placeholder={placeholder}
                  />
                  <div className="flex w-full space-x-2 justify-between my-4">
                    <button
                      className="h-[46px] w-1/2 text-base font-bold text-black bg-[#F3F3F3] rounded-lg border"
                      onClick={handleCancel}
                    >
                      Decline
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="h-[46px] w-1/2 text-base font-bold text-white bg-primary rounded-lg border"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
