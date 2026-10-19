import { useState } from "react";
import SignaturePopup from "../../../components/ui/popups/SignaturePopup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCompany } from "../../../redux/features/company/companySlice";
import { updateUserInfo } from "../../../services/user.services";
import { setUser } from "../../../redux/features/user/userSlice";
import SignatureCard from "./components/SignatureCard";
import { updateCompanyInfo } from "../../../services/company.services";

const SignaturesPage = () => {
  const { user } = useSelector((state) => state.user);
  const { company } = useSelector((state) => state.company);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const [signaturePopup, setSignaturePopup] = useState({
    isOpen: false,
    type: "",
  });

  const handleSignatureSave = async (signature, type) => {
    setSignaturePopup({ isOpen: false, type: "" });

    const body = {
      signature,
    };

    try {
      if (type === "user") {
        await updateUserInfo(token, body);
        dispatch(setUser({ ...user, signature: signature }));
      } else {
        await updateCompanyInfo(token, body);
        dispatch(setCompany({ ...company, signature: signature }));
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          `An error occurred while updating ${type} signature`
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full md:w-3/5 lg:w-1/2 mx-auto space-y-6">
      <SignaturePopup
        isOpen={signaturePopup.isOpen}
        onClose={() => setSignaturePopup({ isOpen: false, type: "" })}
        onSave={(signature) =>
          handleSignatureSave(signature, signaturePopup.type)
        }
      />

      <SignatureCard
        title="User Signature"
        signature={user?.signature}
        onChange={() => setSignaturePopup({ isOpen: true, type: "user" })}
      />

      {company && (
        <SignatureCard
          title="Company Signature"
          signature={company?.signature}
          onChange={() => setSignaturePopup({ isOpen: true, type: "company" })}
        />
      )}
    </div>
  );
};

export default SignaturesPage;
