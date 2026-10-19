import { useState, useEffect, useCallback } from "react";
import "reactjs-popup/dist/index.css";
import { useParams } from "react-router-dom";
import { formatToDateOnly } from "../../../utils/functions/datefunctions";
import { toast } from "react-toastify";
import ExpiryBox from "./components/ExpiryBox";
import PackageCollectionToken from "./components/PackageCollectionToken";
import ExpiredModal from "./components/ExpiredModal";
import RevokeModal from "./components/RevokeModal";
import RevokeConfirmationModal from "./components/RevokeConfirmationModal";
import SignaturePopup from "@/components/ui/popups/SignaturePopup";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  acknowlegeFuldmagtRequest,
  getSpecificFuldmagt,
  issueAgainFuldmagt,
  revokeFuldmagt,
} from "../../../services/fuldmagt.services";
import { LoadingSpinner } from "../../../components/global/Loaders/Loader";
import { useNavigate } from "react-router-dom";
const Efludmagt = () => {
  const navigate = useNavigate()
  const { t } = useTranslation();
  const { id } = useParams();
  const fuldmagtItem = useSelector((state) => state.fuldmagts)?.fuldmagts?.find(
    (item) => item._id === id
  );
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(fuldmagtItem);
  const { user } = useSelector((state) => state.user);
  const { company } = useSelector((state) => state.company);
  const token = localStorage.getItem("token");
  const [fuldmagt, setFuldmagt] = useState({});
  const [openRevoke, setOpenRevoke] = useState(false);
  const [isExpired, setExpired] = useState(false);
  const [isRevoked, setRevoked] = useState(false);
  const [isSignatureOpen, setSignatureOpen] = useState(false);
  const [issuing, setIssuing] = useState(false);

  const filterData = useCallback(() => {
    let fuldmagtData = {
      ...item,
      expiry: new Date(item.expiry),
      createdAt: new Date(item.createdAt),
      agentDOB: formatToDateOnly(item.agentDOB),
    };

    if (fuldmagtData.expiry < new Date() && !fuldmagtData.revoked) {
      setExpired(true);
    } else {
      setExpired(false);
    }

    if (fuldmagtData.revoked) {
      setRevoked(true);
    } else {
      setRevoked(false);
    }

    setFuldmagt(fuldmagtData);
  }, [item]);

  const updateFulmagtInformation = useCallback(async () => {
    setLoading(true); // ✅ Set loading to true at the start
    try {
      const res = await getSpecificFuldmagt(token, id);
      setItem(res.data.data.fuldmagt);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "error getting fuldmagt"
      );
    } finally {
      setLoading(false); // ✅ Set loading to false when done (success or error)
    }
  }, [id, token]);

  useEffect(() => {
    updateFulmagtInformation();
  }, []);

  useEffect(() => {
    if (item) {
      filterData();
    }
  }, [filterData, item]);

  const issueAgainCall = async () => {
    await issueAgainFuldmagt(token, id);
    // await updateFulmagtInformation();
    navigate('/')
    toast.success(t("issued_again_successfully_toast"))
  };

  const handleIssueAgain = async () => {
    try {
      setIssuing(true);
      await issueAgainCall();
    } catch (error) {
      console.log("error: ", error);
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        t("error_issuing_fuldmagt")
      );
    } finally {
      setIssuing(false);
    }
  };

  const revokeCall = async () => {
    await revokeFuldmagt(token, id);
    // await updateFulmagtInformation();
    toast.success(t("fuldmagt_revoked_toast"));
    window.location.href = '/'
    setOpenRevoke(false);

  };

  const handleFuldmagtPickup = async (signature) => {
    await acknowlegeFuldmagtRequest(token, fuldmagt._id, signature)
      .then((res) => {
        toast.success(t("fuldmagt_signed_successfully_toast"));
        const updatedFuldmagt = res.data.data.fuldmagt;
        updatedFuldmagt.expiry = new Date(updatedFuldmagt.expiry);
        setFuldmagt(updatedFuldmagt);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setSignatureOpen(false);
      });
  };

  const closePopup = () => {
    setSignatureOpen(false);
  };

  console.log("fuldmagt: ", fuldmagt);
  if (loading) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-4 justify-center items-center">
      <ExpiryBox
        revoked={fuldmagt.revoked}
        expiryDate={fuldmagt.expiry}
        issuedDate={fuldmagt.createdAt}
        rejected={fuldmagt.requestStatus}
      />
      {fuldmagt.acknowledged && <p>{t("fuldmagt_acknowledged")}</p>}
      <PackageCollectionToken
        fuldmagt={fuldmagt}
        imageUrl={user.image}
      />

      {(fuldmagt.fuldmagtGiverId == user._id ||
        (company && fuldmagt.fuldmagtGiverId == company._id)) && (
          <>
            {!fuldmagt.revoked && !fuldmagt.acknowledged && fuldmagt.requestStatus != "approved" && (
              <button
                className="btn-primary w-[150px] h-[60px]"
                onClick={() => {
                  if (fuldmagt.expiry > new Date()) {
                    setOpenRevoke(true);
                  } else {
                    revokeCall();
                  }
                }}
              >
                {t("Revoke")}
              </button>
            )}

            <ExpiredModal
              key={fuldmagt.acknowledged}
              expiredDate={fuldmagt.expiry}
              isOpen={isExpired}
              setIsOpen={setExpired}
              callBackFunction={issueAgainCall}
            />
            <RevokeModal
              revokedDate={fuldmagt.revokedDate}
              isOpen={isRevoked}
              setIsOpen={setRevoked}
              callBackFunction={issueAgainCall}
              fuldmagt={fuldmagt}
            />

            <RevokeConfirmationModal
              isOpen={openRevoke}
              setIsOpen={setOpenRevoke}
              callBackFunction={revokeCall}
              fuldmagt={fuldmagt}
            />

            {(new Date() > fuldmagt.expiry || fuldmagt.revoked) && (
              <button
                disabled={issuing}
                className="btn-primary w-[150px] h-[60px] disabled:bg-opacity-50 disabled:cursor-not-allowed"
                onClick={handleIssueAgain}
              >
                {t("issue_again")} {issuing && <LoadingSpinner />}
              </button>
            )}

          </>
        )}
      {!fuldmagt.requestStatus && fuldmagt.fuldmagtGiverId !== user._id && fuldmagt.fuldmagtGiverId !== company?._id && fuldmagt?.validity !== "revoked" && (
        <button
          className="btn-primary w-[150px] h-[60px]"
          onClick={() => {
            // if (fuldmagt?.isAgentSignRequired) {
            setSignatureOpen(true);
            // }
          }}
          disabled={fuldmagt?.acknowledged}
        >
          {fuldmagt.acknowledged ? "Signed" : "Sign Now"}
        </button>
      )}

      {isSignatureOpen && (
        <SignaturePopup
          isOpen={isSignatureOpen}
          onClose={closePopup}
          onSave={handleFuldmagtPickup}
          selectedUser={user}
        />
      )}
    </div>
  );
};

export default Efludmagt;
