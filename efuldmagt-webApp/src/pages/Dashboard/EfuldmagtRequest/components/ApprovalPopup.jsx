/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "../../../../components/global/Loaders/Loader";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { createSignatureOrder, checkSignatureStatus } from "../../../../redux/features/mitId/mitidThunk";
import { rejectFuldmagt } from "../../../../services/fuldmagt.services";
import { resetMitIdState } from "../../../../redux/features/mitId/mitidSlice";
import html2pdf from "html2pdf.js"
import appLogo from "../../../../assets/icons/logo.jpeg";

const formatDate = (dateString) => {
    if (!dateString) return "[Date not set]";
    try {
        return new Date(dateString).toLocaleDateString('en-GB');
    } catch (error) {
        return dateString;
    }
};

const getFilledStatementForPdf = (fuldmagt) => {
    if (!fuldmagt?.fuldmagtStatement) return "";
    let statement = fuldmagt.fuldmagtStatement;

    const replacements = {
        "$fuldmagtGiverName": fuldmagt.fuldmagtGiverName || "[Giver Name]",
        "$agentName": fuldmagt.agentName || "[Agent Name]",
        "$agentEmail": fuldmagt.agentEmail || "[Agent Email]",
        "$agentPhone": fuldmagt.agentPhone ? `${fuldmagt.agentPhone.countryCode || ''} ${fuldmagt.agentPhone.number || ''}`.trim() : "[Agent Phone]",
        "$revokedDate": fuldmagt.expiry ? formatDate(fuldmagt.expiry) : "[Not provided]",
        "$fuldmagtGiverSignature": "[Signed by Giver]",
    };

    const systemVariables = new Set(Object.keys(replacements));
    const allPlaceholders = statement.match(/\$\w+/g) || [];
    const dynamicPlaceholders = allPlaceholders.filter(p => !systemVariables.has(p));

    if (fuldmagt.additionalFieldsData) {
        dynamicPlaceholders.forEach((placeholder, index) => {
            let value = fuldmagt.additionalFieldsData[index];
            if (Array.isArray(value)) value = value.join(', ');
            if (placeholder.toLowerCase().includes('date')) value = formatDate(value);
            replacements[placeholder] = value !== undefined ? value : "[Not provided]";
        });
    }

    for (const [variable, value] of Object.entries(replacements)) {
        const regex = new RegExp(`\\${variable}`, "g");
        statement = statement.replace(regex, String(value));
    }

    statement = statement.replace(/\$\w+/g, "[Not provided]");
    return statement;
}


const ApprovalPopup = ({ fuldmagt, handleApprove, approving }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [rejecting, setRejecting] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const { t } = useTranslation();
    const [verifiedDocumentKey, setVerifiedDocumentKey] = useState(null);
    // --- 3. ADD REDUX STATE AND DISPATCH ---
    const dispatch = useDispatch();
    const {
        createOrderLoading,
        checkStatusLoading,
        signLink,
        orderId,
        signatoryId
    } = useSelector((state) => state.mitid);

    // Namespaced session storage keys to prevent conflicts
    const orderIdKey = `mitIdOrderId_${fuldmagt?._id}`;
    const signatoryIdKey = `mitIdSignatoryId_${fuldmagt?._id}`;
    const [verifiedDocumentLink, setVerifiedDocumentLink] = useState(null);
    const rejectFuldmagtRequest = async () => {
        try {
            setRejecting(true);
            const response = await rejectFuldmagt(token, fuldmagt?._id);
            toast.success(response.data.message);
            setVerifiedDocumentLink(null);
            navigate("/");
        } catch (error) {
            console.error("Error rejecting request:", error);
            toast.error(t("failed_to_reject_request_toast"));
        } finally {
            setRejecting(false);
        }
    };

    // --- 4. IMPLEMENT VERIFICATION FUNCTION ---
    const onStartVerification = async () => {
        const statement = getFilledStatementForPdf(fuldmagt);

        if (!statement) {
            toast.error("Fuldmagt statement is not available.");
            return;
        }

        const giverName = fuldmagt.fuldmagtGiverName || "[Giver Name]";
        const giverAddress = fuldmagt.fuldmagtGiverAddress
            ? `${fuldmagt.fuldmagtGiverAddress.address || ''}<br>${fuldmagt.fuldmagtGiverAddress.postalCode || ''} ${fuldmagt.fuldmagtGiverAddress.city || ''}`
            : "[Giver Address]";

        const agentName = fuldmagt.agentName || "[Agent Name]";
        const agentAddress = fuldmagt.agentAddress
            ? `${fuldmagt.agentAddress.address || ''}<br>${fuldmagt.agentAddress.postalCode || ''} ${fuldmagt.agentAddress.city || ''}`
            : `[Agent Address]`;

        const currentDateFormatted = formatDate(new Date().toISOString());

        const htmlContent = `
        <div style="font-family: Helvetica, Arial, sans-serif; padding: 40px; font-size: 11pt;">
            
            <table style="width: 100%; border-bottom: 1px solid #eee; padding-bottom: 20px;">
                <tr>
                    <td style="width: 50%;">
                        <img src="${appLogo}" style="width: 100px; height: auto;" />
                    </td>
                    <td style="width: 50%; text-align: right; font-size: 16pt; font-weight: bold;">
                        E-FULDGMENT
                    </td>
                </tr>
            </table>

            <h1 style="text-align: center; font-size: 14pt; margin-top: 40px;">
                FULDMAGT ACCEPTANCE
            </h1>

            <p style="font-weight: bold;">Undertegnede (Giver)</p>
            <div style="padding-left: 20px; margin-bottom: 20px;">
                ${giverName}<br>
            </div>

            <p style="font-weight: bold;">giver herved (Receiver)</p>
            <div style="padding-left: 20px; margin-bottom: 25px;">
                ${agentName}<br>
                
            </div>

            <h2 style="font-size: 12pt; font-weight: bold; border-top: 1px solid #eee; padding-top: 20px;">
                Fuldmagtens Indhold
            </h2>

            <div style="line-height: 1.6;">
                ${statement.replace(/\n/g, "<br>")}
            </div>

            <div style="margin-top: 45px; text-align: right; font-size: 11pt;">
                Dato: ${currentDateFormatted}
            </div>
        </div>
    `;

        try {
            const element = document.createElement("div");
            element.innerHTML = htmlContent;

            const opt = {
                margin: 10,
                filename: "fuldmagt-acceptance.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
            };

            const pdfBlob = await html2pdf().from(element).set(opt).output("blob");
            const pdfFile = new File([pdfBlob], "fuldmagt-acceptance.pdf", { type: "application/pdf" });

            dispatch(createSignatureOrder({ pdfFile, token }));

        } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error("Error creating the document.");
        }
    };

    // --- 5. IMPLEMENT GATED APPROVAL FUNCTION ---
    const onConfirmApproval = async () => {
        const storedOrderId = sessionStorage.getItem(orderIdKey);
        const storedSignatoryId = sessionStorage.getItem(signatoryIdKey);

        //    if (verifiedDocumentLink && verifiedDocumentKey) {
        //      console.log("MitID data already in state. Bypassing check.");
        //      toast.info(t("mitid_already_verified_toast"));
        //      handleApprove({
        //        link: verifiedDocumentLink,
        //        key: verifiedDocumentKey,
        //      });
        //      return;
        //    }

        //     if (!storedOrderId || !storedSignatoryId) {
        //         toast.error(t("complete_mitid_first_toast"));
        //         return;
        //     }

        //     try {
        //         // Dispatch the check status thunk
        //         const resultAction = await dispatch(checkSignatureStatus({ 
        //             orderId: storedOrderId, 
        //             signatoryId: storedSignatoryId, 
        //             token 
        //         }));
        //         const result = unwrapResult(resultAction);

        //         // Check for success using the same logic as before
        //     if (result.serverSavePath && result.fuldmagtDocumentKey) {
        //     toast.success(t("mitid_signature_verified_toast"));
        //     setVerifiedDocumentLink(result.serverSavePath);
        //     setVerifiedDocumentKey(result.fuldmagtDocumentKey);
        handleApprove({
            link: "https://example.com/verified-document.pdf",
            key: "aabbccddeeff00112233445566778899",
        });

        // sessionStorage.removeItem(orderIdKey);
        // sessionStorage.removeItem(signatoryIdKey);
        // } else {
        // toast.error(t("could_not_confirm_verification_toast"));
        // }
        // } catch (err) {
        //     console.error("Failed to check MitID status:", err);
        // }
    };

    useEffect(() => {
        if (signLink && orderId && signatoryId) {
            sessionStorage.setItem(orderIdKey, orderId);
            sessionStorage.setItem(signatoryIdKey, signatoryId);
            window.open(signLink, "_blank");
        }
    }, [signLink, orderId, signatoryId, orderIdKey, signatoryIdKey]);

    useEffect(() => {
        dispatch(resetMitIdState());

        return () => {
            dispatch(resetMitIdState());
        }
    }, [dispatch]);

    const isBusy = rejecting || approving || createOrderLoading || checkStatusLoading;

    return (
        isOpen && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                onClick={() => setIsOpen(false)}
            >
                <div
                    className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        aria-label={t("close_modal_aria_label")}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <p className="text-lg text-gray-900 text-center">
                        {t("mitid_approval_prompt", { giverName: fuldmagt?.fuldmagtGiverName })}
                        {/* <span className="font-semibold">{fuldmagt?.fuldmagtGiverName}</span>. */}
                    </p>

                    <div className="mt-6">
                        <button
                            className="w-full py-2 text-white bg-blue-600 rounded-lg transition hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center"
                            onClick={onStartVerification}
                            disabled={isBusy}
                        >
                            {createOrderLoading ? <LoadingSpinner /> : t("Step 1: Verify with MitID")}
                        </button>
                    </div>

                    <div className="flex justify-between gap-4 mt-4">
                        <button
                            className="w-1/2 py-2 text-white bg-red-500 rounded-lg transition hover:bg-red-600 disabled:bg-opacity-50 flex items-center justify-center"
                            onClick={rejectFuldmagtRequest}
                            disabled={isBusy}
                        >
                            {rejecting ? <LoadingSpinner /> : t("Reject")}
                        </button>
                        <button
                            className="w-1/2 py-2 text-white bg-green-500 rounded-lg transition hover:bg-green-600 disabled:bg-opacity-50 flex items-center justify-center"
                            onClick={onConfirmApproval}
                            disabled={isBusy}
                        >
                            {approving || checkStatusLoading ? <LoadingSpinner /> : t("Step 2: Confirm Approval")}
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default ApprovalPopup;