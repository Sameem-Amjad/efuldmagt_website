import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import parsePhoneNumber from "libphonenumber-js";
import SignaturePopup from "../../components/ui/popups/SignaturePopup.jsx";
import BackNavigation from "../../components/global/common/BackNavigation.jsx";
import Switcher from "./components/Switcher.jsx";
import Expirer from "./components/Expirer.jsx";
import PackagePicker from "./components/PackagePicker.jsx";
import SubmitionButton from "./components/SubmitionButton.jsx";
import FuldmagtForm from "./components/FuldmagtForm.jsx";
import { validatePhone } from "../../utils/functions/functions.js";
import { handlePayment } from "../../services/payment.service.js";
import { requestFuldmagt, createFuldmagt } from "../../services/fuldmagt.services.js";
import MitIdVerification from "./components/MitIdVerification.jsx";
import { checkSignatureStatus } from "../../redux/features/mitId/mitidThunk.js";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { resetMitIdState } from "../../redux/features/mitId/mitidSlice.js";



const CreateEfuldmagt = () => {
    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
    } = useForm({
        mode: 'onChange'
    });
    const location = useLocation();
    const { user } = useSelector((state) => state.user);
    let currentlyActiveProfile = localStorage.getItem('activeProfile');
    const { company } = useSelector((state) => state.company);
    const [loading, setLoading] = useState(false);
    const [mitIdDocumentLink, setMitIdDocumentLink] = useState(null);
    const [mitIdDocumentKey, setMitIdDocumentKey] = useState(null);

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const credentials = {
        authToken: token,
        selected: currentlyActiveProfile,
        user: user?.user, // Pass the nested user object
        company: company?.company,
    };

    const [expiry, setExpiry] = useState(null);
    const [phone, setPhone] = useState("");
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [pendingFormData, setPendingFormData] = useState(null);
    const [signature, setSignature] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isRequest, setIsRequest] = useState(false);
    const [isSignatureOpen, setIsSignatureOpen] = useState(false);
    const [isChooseMannually, setChooseMannually] = useState(false);
    const [openedFuldmagt, setOpenedFuldmagt] = useState(null);

    useEffect(() => {
        if (phone) setIsPhoneValid(validatePhone(phone));
    }, [phone]);

    useEffect(() => {
        setOpenedFuldmagt(location.state?.fuldmagt || null);
    }, [location]);


    useEffect(() => {
        console.log("Component mounted. Clearing all MitID state and storage.");

        // setMitIdDocumentLink(null);

        // dispatch(resetMitIdState()); // Assuming you exported this from your slice

        // sessionStorage.removeItem("mitIdOrderId");
        // sessionStorage.removeItem("mitIdSignatoryId");

    }, [dispatch]);

    const onSubmit = async (data) => {
        if (openedFuldmagt) {
            const { visibleTo, selectedUsers = [], selectedCompanies = [] } = openedFuldmagt;

            // This is the profile that is *currently* active
            const activeProfile = currentlyActiveProfile;

            // These are the IDs for the active user and company
            const currentUserId = user?._id;
            const currentCompanyId = company?._id;
            if (visibleTo === "allUsers" && activeProfile !== "user") {
                toast.error("This fuldmagt can only be sent by a personal user profile.");
                return;
            }

            if (visibleTo === "allCompanies" && activeProfile !== "company") {
                toast.error("This fuldmagt can only be sent by a company profile.");
                return;
            }

            if (visibleTo === "specificUsersAndCompanies") {
                console.log("current user ID:", currentUserId);
                console.log("current company ID:", currentCompanyId);
                console.log("allowed users:", selectedUsers);
                if (activeProfile === "user" && !selectedUsers.includes(currentUserId)) {
                    toast.error("Your user profile is not authorized to send this fuldmagt.");
                    return;
                }
                if (activeProfile === "company" && !selectedCompanies.includes(currentCompanyId)) {
                    toast.error("Your company profile is not authorized to send this fuldmagt.");
                    return;
                }
            }
        }
        const runOriginalSubmission = () => {
            // alert("Finalizing request submission without signature.");
            if (!expiry || expiry < new Date()) {
                toast.error("Expiry date must be at least 10 minutes from now");
                return;
            }
            let fuldmagtUser = isChooseMannually
                ? validatePhone(phone) && parsePhoneNumber(phone)
                    ? {
                        agentName: `${data.firstName} ${data.lastName}`,
                        agentDOB: new Date(data.userDOB).toISOString().replace(/\.\d{3}Z$/, "+0000"),
                        agentEmail: data.email,
                        agentPhoneNumber: parsePhoneNumber(phone).nationalNumber,
                        agentCountryCode: `+${parsePhoneNumber(phone).countryCallingCode}`
                    }
                    : null
                : selectedUser;
            if (!fuldmagtUser) {
                toast.error("Please Select a User or Enter Details Manually");
                return;
            }
            const finalData = { ...data, fuldmagtUser };
            setPendingFormData(finalData);
            if (isRequest) {
                // For a request, we skip the signature entirely and finalize submission.
                // The signature will be handled by the Giver later.
                // alert("Finalizing request submission without signature.");
                finalizeSubmission(finalData, null);
            } else {
                // For a creation (non-request), signature is required now.
                signature ? finalizeSubmission(finalData, signature) : setIsSignatureOpen(true);
            }
        };

        if (isRequest) {
            runOriginalSubmission();
            return;
        }
        // if (mitIdDocumentLink || mitIdDocumentKey) {
        //     console.log("MitID link/key already exists in state. Bypassing check.");
        //     toast.info("MitID already verified.");
        //     runOriginalSubmission();
        //     return; // Exit the function
        // }

        // const orderId = sessionStorage.getItem("mitIdOrderId");
        // const signatoryId = sessionStorage.getItem("mitIdSignatoryId");
        // if (
        //     !orderId || orderId === "null" || orderId === "undefined" ||
        //     !signatoryId || signatoryId === "null" || signatoryId === "undefined"
        // ) {
        //     toast.error("Please complete the MitID verification step first.");
        //     return; // Stop the function here.
        // }

        try {
            setLoading(true);
            // const resultAction = await dispatch(checkSignatureStatus({ orderId, signatoryId, token }));
            // const result = unwrapResult(resultAction);

            // if (result.serverSavePath && result.fuldmagtDocumentKey) {
            //     toast.success("MitID signature verified!");
            //     setMitIdDocumentLink(result.serverSavePath);
            //     setMitIdDocumentKey(result.fuldmagtDocumentKey); // <-- STORE THE KEY
            runOriginalSubmission();
            // } else {
            // alert("Verification successful, but serverSavePath not found in response:", result);
            // console.error("Verification successful, but serverSavePath not found in response:", result);
            // toast.error("Could not confirm verification. Please try again.");
            // }
        } catch (err) {
            console.error("Failed to check MitID status:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSignatureSave = (savedSignature) => {
        if (!savedSignature) {
            toast.error("Signature is required");
            return;
        }
        setSignature(savedSignature);
        setIsSignatureOpen(false);
        finalizeSubmission(pendingFormData, savedSignature);
    };

    const finalizeSubmission = async (data, savedSignature) => {
        // if (!isRequest && (!mitIdDocumentLink || !mitIdDocumentKey)) {
        //     toast.error("Document verification data is missing. Please try verifying with MitID again.");
        //     return;
        // }
        try {
            setLoading(true);
            // --- (All the code to build the 'body' object is correct and stays the same) ---
            const formattedExpiry = expiry.toISOString().replace(/\.\d{3}Z$/, "+0000");
            let additionalFieldsData = openedFuldmagt?.additionalFields?.map((field) => data[field] || "") || [];
            const accountType = localStorage.getItem('activeProfile') || 'user';
            let body = {
                fuldmagtFormId: openedFuldmagt._id,
                accountType: accountType,
                expiry: formattedExpiry,
                additionalFieldsData,
            }

            if (!isRequest) {
                body = {
                    ...body,
                    fuldmagtGiverSignature: savedSignature,
                    agentId: isChooseMannually ? "" : selectedUser._id,
                    ...(isChooseMannually && { ...data.fuldmagtUser }),
                    fuldmagtDocumentLink: "https://example.com/document.pdf",
                    fuldmagtDocumentKey: "https://example.com/document.pdf",
                };
            } else {
                body = {
                    ...body,
                    fuldmagtGiverId: selectedUser._id,
                    ...(isChooseMannually && {
                        fuldmagtGiverName: user.fullName,
                        fuldmagtGiverDOB: user.dateOfBirth,
                        fuldmagtGiverEmail: user.email,
                        fuldmagtGiverPhoneNumber: user.phoneNumber,
                        fuldmagtGiverCountryCode: user.countryCode,
                    }),

                };
                accountType === 'company' && (body.isRequestedByCompany = true);
            }
            const fuldmagtData = { body, isRequest };

            if (isRequest) {
                console.log("Submitting fuldmagt request:", fuldmagtData);
                await requestFuldmagt(token, fuldmagtData.body);
                toast.success("Request sent successfully!");
                sessionStorage.removeItem("mitIdOrderId");
                sessionStorage.removeItem("mitIdSignatoryId");
                navigate("/");

            } else if (openedFuldmagt?.price > 0) {
                // --- PAID FLOW ---
                console.log("Saving fuldmagt data and redirecting to payment.");
                localStorage.setItem("fuldmagtData", JSON.stringify(fuldmagtData));

                await handlePayment(openedFuldmagt.price, "DKK");

            } else {
                await createFuldmagt(token, fuldmagtData.body);
                toast.success("Fuldmagt created successfully!");
                sessionStorage.removeItem("mitIdOrderId");
                sessionStorage.removeItem("mitIdSignatoryId");
                navigate("/");
            }

        } catch (error) {
            console.error("Error form submission:", error);
            toast.error(error?.response?.data?.message || "Failed to form submission");
        } finally {
            // The finally block should ONLY handle things that must happen
            // for both success and failure, like turning off a spinner.
            setLoading(false);
        }
    };

    return (
        <div>
            <BackNavigation title="Send/Request" />
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 w-full">
                <Switcher isRequest={isRequest} setIsRequest={setIsRequest} activeProfile={currentlyActiveProfile} />
                <Expirer setExpiry={setExpiry} />
                <PackagePicker
                    {...{
                        setSelectedUser,
                        isChooseMannually,
                        setChooseMannually,
                        selectedUser,
                        register,
                        errors,
                        setValue,
                        watch,
                        phone,
                        setPhone,
                        isPhoneValid,
                    }}
                />
                <FuldmagtForm
                    {...{ openedFuldmagt, register, errors, setValue, watch }}
                />
                {/* {openedFuldmagt && !isRequest && (
                    <MitIdVerification openedFuldmagt={openedFuldmagt} watch={watch} user={user} phone={phone} expiry={expiry} selectedUser={selectedUser} isDisabled={!isValid || (!isChooseMannually && selectedUser === null)} />
                )} */}

                <SubmitionButton
                    {...{
                        isRequest,
                        credentials,
                        loading,
                    }}
                />
            </form>
            <SignaturePopup
                isOpen={isSignatureOpen}
                onClose={() => {
                    setIsSignatureOpen(false);
                    setPendingFormData(null);
                    setSignature(null); // Fully reset state
                }}
                onSave={handleSignatureSave}
                selectedUser={credentials}
            />
        </div>
    );
};

export default CreateEfuldmagt;