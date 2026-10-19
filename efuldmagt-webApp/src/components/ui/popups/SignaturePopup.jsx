/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { getUploadUrl } from "../../../services/fuldmagt.services";
import axios from "axios";
import { LoadingSpinner } from "../../global/Loaders/Loader";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
const SignaturePopup = ({ isOpen, onClose, onSave }) => {
    const { user } = useSelector((state) => state.user);
    const sigCanvas = useRef({});
    const token = localStorage.getItem("token");
    const [showSignatureOptions, setShowSignatureOptions] = useState(false);
    const [selectedSignature, setSelectedSignature] = useState();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const clear = () => sigCanvas.current.clear();
    // 450px canvas, narrower on small screens so the popup (and its Cancel/Done buttons) fits on a phone
    const canvasWidth = Math.min(450, window.innerWidth - 80);

    const save = async () => {
        try {
            setLoading(true);
            const trimmedCanvas = sigCanvas.current.getTrimmedCanvas();
            if (sigCanvas.current.isEmpty()) {
                toast.error(t("signature_required_toast"));
                return;
            }

            const blob = await new Promise((resolve, reject) => {
                trimmedCanvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error("Failed to convert canvas to Blob"));
                }, "image/png");
            });

            const res = await getUploadUrl(token, `${user?._id}-${Date.now()}`);
            const uploadUrl = res?.data?.data?.url;
            if (!uploadUrl) throw new Error("Upload URL not found in response.");

            await axios.put(uploadUrl, blob, { headers: { "Content-Type": "image/png" } });

            const imageUrl = res?.data?.data?.imageUrl;
            if (!imageUrl) throw new Error("Image URL missing from response.");

            onSave(imageUrl);
        } catch (error) {
            console.error("Error saving signature:", error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const handleSavedSignatureClick = () => {
        // Pre-select the user's signature if it exists
        if (user?.signature) {
            setSelectedSignature(user.signature);
        }
        setShowSignatureOptions(true);
    };

    return (
        <>
            {!showSignatureOptions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 space-y-4 w-auto max-w-[calc(100vw-1rem)] sm:w-[500px]">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex justify-start space-x-4">
                                <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                                    {t("Cancel")}
                                </button>
                                <button onClick={clear} disabled={loading} className="flex items-center text-sm text-gray-600 font-bold border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                     {t("clear")}
                                </button>
                            </div>
                            <button onClick={save} disabled={loading} className="text-white bg-blue-500 hover:bg-blue-600 text-sm px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                {t("Done")}{loading && <LoadingSpinner />}
                            </button>
                        </div>
                        <SignatureCanvas
                            penColor="black"
                            canvasProps={{ width: canvasWidth, height: 200, className: "border border-gray-300 rounded-lg" }}
                            ref={sigCanvas}
                        />
                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-500 font-semibold">{t("Your Signature")}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                {t("saved_signature_prompt_1")}{" "}
                                <button className="text-blue-500 underline disabled:cursor-not-allowed" onClick={handleSavedSignatureClick} disabled={loading}>
                                    {t("saved_signature_prompt_2_link")}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {showSignatureOptions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 space-y-4 w-auto max-w-[calc(100vw-1rem)] sm:w-[600px]">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={() => setShowSignatureOptions(false)} className="text-gray-500 hover:text-gray-700 text-sm font-semibold">
                                {t("Back")}
                            </button>
                            <button
                                onClick={() => {
                                    if (selectedSignature) {
                                        onSave(selectedSignature);
                                        setShowSignatureOptions(false);
                                    } else {
                                         toast.error(t("select_signature_toast"));
                                    }
                                }}
                                className="text-white bg-blue-500 hover:bg-blue-600 text-sm px-4 py-2 rounded-lg"
                            >
                                Done
                            </button>
                        </div>

                        {/* --- USER SIGNATURE SECTION (FIXED) --- */}
                        {user?.signature ? (
                            <div className="p-4 flex items-center justify-between border-b">
                                <div className="flex flex-col">
                                    <p className="text-sm text-gray-500">{t("your_saved_signature")}</p>
                                    <img src={user.signature} alt="User Signature" className="w-48 border rounded-md mt-2" />
                                </div>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="signature"
                                        value={user.signature}
                                        onChange={() => setSelectedSignature(user.signature)}
                                        checked={selectedSignature === user.signature}
                                        className="h-4 w-4 text-blue-500 focus:ring-blue-400"
                                    />
                                    <span className="text-blue-500 font-medium">{t("use_this_signature")}</span>
                                </label>
                            </div>
                        ) : (
                            <p className="p-4 text-center text-gray-500">{t("no_saved_user_signature")}</p>
                        )}
                        
                        {/* --- COMPANY SIGNATURE SECTION (FIXED) --- */}
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-sm text-gray-500">{t("Company Signature")}</p>
                                <img src="/images/sign.png" alt="Company Signature" className="w-48 border rounded-md mt-2" />
                            </div>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="signature"
                                    value="/images/sign.png"
                                    onChange={() => setSelectedSignature("/images/sign.png")}
                                    checked={selectedSignature === "/images/sign.png"}
                                    className="h-4 w-4 text-blue-500 focus:ring-blue-400"
                                />
                                <span className="text-blue-500 font-medium">{t("use_this_signature")}</span>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SignaturePopup;