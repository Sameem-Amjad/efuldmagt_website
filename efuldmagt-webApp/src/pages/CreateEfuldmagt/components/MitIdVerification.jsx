import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import html2pdf from 'html2pdf.js';
import { toast } from "react-toastify";
import { createSignatureOrder } from "../../../redux/features/mitId/mitidThunk";
import { resetMitIdState } from "../../../redux/features/mitId/mitidSlice";
import appLogo from "../../../assets/icons/logo.jpeg";


const formatDate = (dateString) => {
    if (!dateString) return "[Date not set]";
    try {
        return new Date(dateString).toLocaleDateString('en-GB');
    } catch (error) {
        console.warn("Could not format date:", dateString);
        return dateString;
    }
};


const getFilledStatement = (fuldmagtTemplate, allFormData, loggedInUserProp, phone, expiry, selectedUser) => {
    let statement = fuldmagtTemplate?.fuldmagtStatement;
    if (!statement) return "";
    const replacements = {};

    if (fuldmagtTemplate.additionalFields) {
        fuldmagtTemplate.additionalFields.forEach(fieldName => {
            const placeholder = `$${fieldName}`;
            let value = allFormData[fieldName];
            if (Array.isArray(value)) value = value.join(', ');
            if (fieldName.toLowerCase().includes('date')) value = formatDate(value);
            replacements[placeholder] = value !== undefined ? value : "[Not provided]";
        });
    }
   
    const giver = loggedInUserProp; 
    const giverName = (giver && giver.name)
        ? `${giver.name.firstName || ''} ${giver.name.lastName || ''}`.trim()
        : "[Giver Name]";
    replacements["$fuldmagtGiverName"] = giverName;

    let agentName, agentEmail, agentPhone;

    if (selectedUser && !allFormData.isChooseMannually) {
        agentName = selectedUser.name || "[Agent Name]";
        agentEmail = selectedUser.email || "[Agent Email]";
        if (selectedUser.phone) {
            agentPhone = `${selectedUser.phone.countryCode || ''} ${selectedUser.phone.number || ''}`.trim();
        } else {
            agentPhone = "[Agent Phone]";
        }
    } else {
        agentName = `${allFormData.FirstName || ''} ${allFormData.LastName || ''}`.trim() || "[Agent Name]";
        agentEmail = allFormData.email || "[Agent Email]";
        agentPhone = phone || "[Agent Phone]";
    }

    replacements["$agentName"] = agentName;
    replacements["$agentEmail"] = agentEmail;
    replacements["$agentPhone"] = agentPhone;

    replacements["$revokedDate"] = formatDate(expiry);


    for (const [variable, value] of Object.entries(replacements)) {
        const regex = new RegExp(`\\${variable}`, "g");
        statement = statement.replace(regex, String(value));
    }

    statement = statement.replace(/\$\w+/g, "[Not provided]");

    return statement;
};

const MitIdVerification = ({ openedFuldmagt, watch, user, phone, expiry, selectedUser, isDisabled }) => {
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
     const currentDateFormatted = formatDate(new Date().toISOString());
    const { createOrderLoading, signLink, orderId, signatoryId } = useSelector((state) => state.mitid);
    const handleVerificationClick = async () => {
        const allFormData = watch();

        const giver = user;
        const giverName = (giver && giver.name) ? `${giver.name.firstName || ''} ${giver.name.lastName || ''}`.trim() : "";
        const giverAddress = giver.address 
            ? `${giver.address.address || ''}<br>${giver.address.postalCode || ''} ${giver.address.city || ''}`
            : "[Giver Address]";

        // 2. The Receiver (Agent)
        let agentName, agentAddress;
        if (selectedUser && !allFormData.isChooseMannually) {
            agentName = selectedUser.name || "[Agent Name]";
            agentAddress = selectedUser.address
                ? `${selectedUser.address.address || ''}<br>${selectedUser.address.postalCode || ''} ${selectedUser.address.city || ''}`
                : "[Agent Address]";
        } else {
            agentName = `${allFormData.FirstName || ''} ${allFormData.LastName || ''}`.trim() || "[Agent Name]";
            agentAddress = `${allFormData.address || ''}<br>${allFormData.postalCode || ''} ${allFormData.city || ''}`;
        }
        
        // 3. The Content
        const filledStatement = getFilledStatement(openedFuldmagt, allFormData, user, phone, expiry, selectedUser);

        if (!filledStatement) {
            toast.error("Fuldmagt statement is not available or could not be generated.");
            return;
        }

        // --- B. Build the HTML string ---
        const htmlContent = `
            <div style="font-family: Helvetica, Arial, sans-serif; padding: 40px; font-size: 11pt;">
                
                <!-- Header -->
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

                <!-- Title -->
                <h1 style="text-align: center; font-size: 14pt; margin-top: 40px; margin-bottom: 30px;">
                    FULDMAGT
                </h1>

                <!-- Giver Info -->
                <p style="font-weight: bold; margin-bottom: 5px;">Undertegnede (Giver)</p>
                <div style="padding-left: 20px; margin-bottom: 25px;">
                    ${giverName}<br>
                    ${giverAddress}
                </div>

                <!-- Receiver Info -->
                <p style="font-weight: bold; margin-bottom: 5px;">giver herved (Receiver)</p>
                <div style="padding-left: 20px; margin-bottom: 30px;">
                    ${agentName}<br>
                    ${agentAddress}
                </div>

                <!-- Content -->
                <h2 style="font-size: 12pt; font-weight: bold; border-top: 1px solid #eee; padding-top: 20px;">
                    Fuldmagtens Indhold (Content)
                </h2>
                <div style="line-height: 1.6;">
                    ${filledStatement.replace(/\n/g, '<br>')}
                </div>
                <div style="margin-top: 50px; text-align: right; font-size: 11pt; color: #333;">
                    Dato: ${currentDateFormatted}
                </div>
            </div>
        `;

        // --- C. Generate the PDF ---
        try {
            const element = document.createElement('div');
            element.innerHTML = htmlContent;

            // Options for html2pdf
            const opt = {
                margin:       10, // mm
                filename:     'fuldmagt-agreement.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Use .output('blob') to get the file data
            const pdfBlob = await html2pdf().from(element).set(opt).output('blob');
            const pdfFile = new File([pdfBlob], "fuldmagt-agreement.pdf", { type: "application/pdf" });

            // 5. Dispatch the PDF
            dispatch(createSignatureOrder({ pdfFile, token }));

        } catch (error) {
            console.error("Failed to generate PDF:", error);
            toast.error("An error occurred while creating the document.");
        }
    };

    useEffect(() => {
        if (signLink && orderId && signatoryId) {
            sessionStorage.setItem("mitIdOrderId", orderId);
            sessionStorage.setItem("mitIdSignatoryId", signatoryId);
            window.open(signLink, "_blank");
        }
    }, [signLink, orderId, signatoryId, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(resetMitIdState());
        }
    }, [dispatch]);

    return (
        <div className="p-4 bg-gray-100 border rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Trin 1: Bekræft med MitID (Step 1: Verify with MitID)</h3>
            <p className="text-sm text-gray-600 mb-4">
                You must verify the agreement with MitID before you can submit it. This will open a new tab.
            </p>
            <button
                type="button"
                onClick={handleVerificationClick}
                disabled={isDisabled || createOrderLoading}
                className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {createOrderLoading
                    ? "Generating Document..."
                    : (isDisabled ? "Please fill all required fields" : "Verify Agreement with MitID")
                }
            </button>
        </div>
    );
};

export default MitIdVerification;