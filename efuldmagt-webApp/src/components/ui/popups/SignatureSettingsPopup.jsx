import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "react-i18next";
const SignaturePopup = ({ isOpen, onClose, onSave }) => {
  const sigCanvas = useRef({});
  const { t } = useTranslation();
  const clear = () => sigCanvas.current.clear();

  const save = () => {
    const trimmedData = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    onSave(trimmedData);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 space-y-4 w-[500px]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex justify-start space-x-4">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-sm font-semibold"
              >
                {t("Cancel")}
              </button>
              <button
                onClick={clear}
                className="flex items-center text-sm text-gray-600 font-bold border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100"
              >
                {t("clear")}
              </button>
            </div>
            <button
              onClick={save}
              className="text-white bg-blue-500 hover:bg-blue-600 text-sm px-4 py-2 rounded-lg"
            >
              {t("Done")}
            </button>
          </div>

          <SignatureCanvas
            penColor="black"
            canvasProps={{
              width: 400,
              height: 200,
              className: "border border-gray-300 rounded-lg",
            }}
            ref={sigCanvas}
          />

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500 font-semibold">
              {t("Your Signature")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignaturePopup;
