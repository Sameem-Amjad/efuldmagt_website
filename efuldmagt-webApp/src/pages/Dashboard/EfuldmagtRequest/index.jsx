import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatToDateOnly } from "../../../utils/functions/datefunctions";
import PackageCollectionToken from "../Efuldmagt/components/PackageCollectionToken";
import ExpiryBox from "../Efuldmagt/components/ExpiryBox";
import SignaturePopup from "../../../components/ui/popups/SignaturePopup";
import { useSelector } from "react-redux";
import ApprovalPopup from "./components/ApprovalPopup";
import { handlePayment } from "../../../services/payment.service";
import BackNavigation from "../../../components/global/common/BackNavigation";
import {
    getSpecificFuldmagtRequest,
    approveFuldmagtRequest as approveFuldmagtService,
    issueAgainRequest
} from "../../../services/fuldmagt.services";
import { useTranslation } from "react-i18next";
import { LoadingSpinner } from "../../../components/global/Loaders/Loader";
import ExpiredModal from "../Efuldmagt/components/ExpiredModal";

const EfuldmagtRequest = () => {
    const [issuing, setIssuing] = useState(false);
    const [isExpiredModalOpen, setExpiredModalOpen] = useState(false);
    const [mitIdDocumentLink, setMitIdDocumentLink] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [approving, setApproving] = useState(false);
    const { user } = useSelector((state) => state.user);
    const { company } = useSelector((state) => state.company);
    const { state } = useLocation();
    const { id } = useParams();
    const { t } = useTranslation();
    const credentials = {
        authToken: token,
        user: user,
    };
    const [fuldmagt, setFuldmagt] = useState(null);
    const [isFuldmagtPending, setFuldmagtPending] = useState(false);
    const [isSignatureOpen, setSignatureOpen] = useState(false);
    const [mitIdDocumentKey, setMitIdDocumentKey] = useState(null);

    // Initial data setup from navigation state
    useEffect(() => {
        if (state?.item) {
            let fuldmagtData = {
                ...state.item,
                expiry: new Date(state.item.expiry),
                createdAt: new Date(state.item.createdAt),
                agentDOB: formatToDateOnly(state.item.agentDOB),
            };
            setFuldmagtPending(fuldmagtData.requestStatus === "pending");
            setFuldmagt(fuldmagtData);
        }
    }, [state]);

    // Handle re-issuing an expired request
    const handleIssueAgain = async () => {
        try {
            setIssuing(true);
            await issueAgainRequest(token, id);
            setExpiredModalOpen(false);
            await getData();
            toast.success(t("issued_again_successfully_toast"));
            navigate('/');
        } catch (error) {
            console.error("Error reissuing request:", error);
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                t("error_issuing_fuldmagt")
            );
        } finally {
            setIssuing(false);
        }
    };

    // Fetch data from API
    const getData = async () => {
        try {
            const response = await getSpecificFuldmagtRequest(token, id);
            const fuldmagtRequestData = response?.data?.data?.fuldmagtRequest;



            if (fuldmagtRequestData) {
                fuldmagtRequestData.expiry = new Date(fuldmagtRequestData.expiry);
                fuldmagtRequestData.createdAt = new Date(fuldmagtRequestData.createdAt);
                setFuldmagt(fuldmagtRequestData);
                setFuldmagtPending(fuldmagtRequestData.requestStatus === "pending");
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || t("error_fetching_data_toast"));
            if (error?.response?.data?.message === "Fuldmagt Request not found by given Id") {
                navigate('/');
                return;
            }
        }
    };

    useEffect(() => {
        if (id) {
            getData();
        }
    }, [id]);

    // Check for expiration logic for the Owner (Agent)
    useEffect(() => {
        if (fuldmagt && user) {
            const isOwner = fuldmagt.agentId === user._id;
            const isRejected = fuldmagt.requestStatus === 'rejected';
            const isExpired = new Date() > fuldmagt.expiry && !isRejected;

            if (isOwner && isExpired) {
                setExpiredModalOpen(true);
                if (isFuldmagtPending) {
                    setFuldmagtPending(false);
                }
            }
        }
    }, [fuldmagt, user, isFuldmagtPending]);

    const handleApprove = (mitIdData) => {
        setMitIdDocumentLink(mitIdData.link);
        setMitIdDocumentKey(mitIdData.key);
        setSignatureOpen(true);
    };

    const approveFuldmagtRequest = async (signature) => {
        try {
            setApproving(true);
            setSignatureOpen(false);

            if (fuldmagt?.price > 0) {
                const body = { token, fuldmagtRequestId: fuldmagt?._id, signature, fuldmagtDocumentLink: mitIdDocumentLink, fuldmagtDocumentKey: mitIdDocumentKey };
                const fuldmagtData = { body, isRequest: true };
                localStorage.setItem("fuldmagtData", JSON.stringify(fuldmagtData));
                await handlePayment(fuldmagt?.price, "DKK");
            } else {
                await approveFuldmagtService(token, fuldmagt?._id, {
                    signature,
                    fuldmagtDocumentLink: mitIdDocumentLink,
                    fuldmagtDocumentKey: mitIdDocumentKey
                });
                toast.success(t("request_approved_successfully_toast") || "Request approved successfully!");
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            toast.error(t("error_approving_request_toast"));
        } finally {
            setApproving(false);
        }
    };

    if (!fuldmagt) {
        return (
            <div>
                <BackNavigation title={"Efuldmagt Request for package collection"} />
                <div className="text-center p-10">{t("loading")}</div>
            </div>
        );
    }

    // --- FIX START: Calculate Expiry ---
    const isExpired = new Date() > fuldmagt.expiry;
    // --- FIX END ---

    return (
        <div>

            <BackNavigation title={"Efuldmagt Request for package collection"} />
            <div className="flex flex-col space-y-4 w-full justify-center items-center">


                {isFuldmagtPending && !isExpired && (fuldmagt?.fuldmagtGiverId === user?._id || fuldmagt?.fuldmagtGiverId === company?._id) && (
                    <ApprovalPopup {...{ fuldmagt, handleApprove, approving }} />
                )}

                {/* Optional: Show message if expired and still pending */}
                {isFuldmagtPending && isExpired && fuldmagt?.fuldmagtGiverId === user?._id && (
                    <div className="w-full max-w-md p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-center mx-auto">
                        {t("request_expired_message") || "This request has expired and can no longer be approved."}
                    </div>
                )}

                <SignaturePopup
                    isOpen={isSignatureOpen}
                    onClose={() => setSignatureOpen(false)}
                    onSave={approveFuldmagtRequest}
                    selectedUser={credentials}
                />

                <ExpiryBox
                    revoked={fuldmagt.revoked}
                    expiryDate={fuldmagt.expiry}
                    issuedDate={fuldmagt.createdAt}
                    rejected={fuldmagt.requestStatus}
                />

                <PackageCollectionToken
                    fuldmagt={fuldmagt}
                    imageUrl={fuldmagt.fuldmagtGiverImage || fuldmagt.imageUrl}
                />

                {isFuldmagtPending && !isExpired && fuldmagt?.agentId === user?._id && (
                    <p className="my-5 text-red-500 font-bold text-xl">
                        {t("pending_for_approval")}
                    </p>
                )}

                <ExpiredModal
                    isOpen={isExpiredModalOpen}
                    setIsOpen={setExpiredModalOpen}
                    callBackFunction={handleIssueAgain}
                    isLoading={issuing}
                    expiredDate={fuldmagt?.expiry}
                />
            </div>
        </div>
    );
};

export default EfuldmagtRequest;