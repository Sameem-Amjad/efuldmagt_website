import { useState } from "react";
import CloseSVG from "../../../assets/icons/close.svg?react";
import AddressSettings from "../../../pages/ProfileSettings/AddressSettings";

export default function AddressChange({ address, setAddress }) {
  const [update, setUpdate] = useState(false);
  const [isCompany, setIsCompany] = useState(false);

  return (
    <div className="md:hidden flex relative w-full h-[54px] px-2 border border-solid items-center rounded-lg">
      <div className="text-base font-bold">{address}</div>
      <div
        onClick={() => {
          setUpdate(true);
        }}
        className={`absolute right-4 top-[18px] text-sm underline hover:cursor-pointer text-secondary font-semibold`}
      >
        Change
      </div>
      {update && (
        <div className="z-[40] md:hidden fixed top-0 left-0 h-screen w-screen">
          <div className="flex flex-col justify-end h-full">
            <div
              className="w-full h-full bg-white bg-opacity-40"
              onClick={() => {
                setUpdate(false);
                setAddress(prevInput);
              }}
            >
              {/* Giving White Space */}
            </div>
            <div className="py-8 w-full border border-solid bg-white rounded-t-[30px]">
              <div className="relative">
                <div
                  className="absolute top-2 left-4 hover:cursor-pointer"
                  onClick={() => {
                    setUpdate(false);
                    setAddress(prevInput);
                  }}
                >
                  <CloseSVG />
                </div>
                <div className="text-center m-3 mx-6 space-y-5">
                  <AddressSettings />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
