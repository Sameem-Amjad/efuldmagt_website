import React from "react";
import CalenderSVG from "@/assets/icons/calendar.svg?react";
import MitIDSVG from "@/assets/icons/mitid.svg?react";
import "react-circular-progressbar/dist/styles.css";
import { timeDiff } from "@/utils/functions/datefunctions";

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: 'numeric', month: 'short', day: 'numeric'
    });
};

// =================================================================
// THE CORRECTED renderStatement FUNCTION
// =================================================================
const renderStatement = (fuldmagt) => {
    const { fuldmagtStatement, additionalFieldsData = [] } = fuldmagt;
    if (!fuldmagtStatement) return "No statement provided.";

    // 1. Define all known system (non-dynamic) variables
    const systemVariables = new Set([
        "$fuldmagtGiverName", "$agentName", "$agentDOB", "$agentEmail",
        "$agentPhone", "$expiry", "$revokedDate", "$createdAt",
        "$fuldmagtGiverSignature", "$agentSignature"
    ]);

    // 2. Find all placeholders in the statement IN ORDER
    const allPlaceholders = fuldmagtStatement.match(/\$\w+/g) || [];

    // 3. Filter out the system variables
    const dynamicPlaceholders = allPlaceholders.filter(p => !systemVariables.has(p));

    // 4. Create a list of *unique* dynamic placeholders. This preserves
    //    the order and matches the structure of the additionalFieldsData array.
    const uniquePlaceholders = [...new Set(dynamicPlaceholders)];

    // 5. Create the replacements map
    const replacements = {
        "$fuldmagtGiverName": fuldmagt.fuldmagtGiverName || "",
        "$agentName": fuldmagt.agentName || "",
        "$agentEmail": fuldmagt.agentEmail || "",
        "$agentPhone": fuldmagt.agentPhone ? `+${fuldmagt.agentPhone.countryCode} ${fuldmagt.agentPhone.number}` : "",
        "$revokedDate": fuldmagt.expiry ? formatDate(fuldmagt.expiry) : "N/A",
    };

    // 6. Map the unique placeholders to the data array
    uniquePlaceholders.forEach((placeholder, index) => {
        let value = additionalFieldsData[index];
        if (Array.isArray(value)) value = value.join(', ');
        if (placeholder.toLowerCase().includes('date')) value = formatDate(value);
        replacements[placeholder] = value !== undefined ? value : "";
    });

    // 7. Loop through the final map and replace ALL instances ("g" flag)
    let processedStatement = fuldmagtStatement;
    for (const [variable, value] of Object.entries(replacements)) {
        if (variable === "$fuldmagtGiverSignature") continue;
        const regex = new RegExp(`\\${variable}`, "g");
        processedStatement = processedStatement.replace(regex, String(value));
    }

    // 8. Handle the signature
    if (fuldmagt.fuldmagtGiverSignature && processedStatement.includes("$fuldmagtGiverSignature")) {
        const parts = processedStatement.split("$fuldmagtGiverSignature");
        return (
            <>
                {parts.map((part, index) => (
                    <React.Fragment key={index}>
                        {part}
                        {index < parts.length - 1 && (
                            <img
                                src={fuldmagt.fuldmagtGiverSignature}
                                alt="Signature"
                                className="w-[100px] h-[56px] my-2 inline-block object-contain"
                            />
                        )}
                    </React.Fragment>
                ))}
            </>
        );
    }
    return processedStatement.replace("$fuldmagtGiverSignature", "[Signature here]").trim();
};
// =================================================================
// END OF CORRECTION
// =================================================================


export default function PackageCollectionToken({ fuldmagt, imageUrl }) {
    if (!fuldmagt || Object.keys(fuldmagt).length === 0) {
        return <div className="text-center p-8">Loading Fuldmagt data...</div>;
    }

    const { fuldmagtGiverSignature, createdAt, expiry, fuldmagtDocumentsLink } = fuldmagt;
    const expiriesIn = timeDiff(expiry, createdAt);
    const finalStatement = renderStatement(fuldmagt);
    const isMitIdVerified = fuldmagtDocumentsLink && fuldmagtDocumentsLink.length > 0;

    return (
        <div className="test-token flex flex-col md:flex-row p-1 w-full max-w-[300px] md:max-w-full md:w-[734px] md:h-auto">

            {/* Left Column (Statement) */}
            <div className="flex flex-col items-center justify-center md:w-1/2 px-8 py-6">
                <img
                    src={imageUrl}
                    className="w-[56px] h-[56px] rounded-full object-cover mb-4"
                    alt="User"
                ></img>
                <p className="text-md text-justify whitespace-pre-line">
                    {finalStatement}
                </p>
            </div>

            <hr className="h-full border-t-dashed md:hidden" />

            {/* Right Column (Proof) */}
            <div className="flex flex-col items-center justify-center md:w-1/2 px-8 py-6 md:border-l-2 border-dashed border-gray-400">
                <p className="text-md mt-2 text-center">
                    This authorization expires {expiriesIn} after issuance.
                </p>
                <span className="my-2">
                    <CalenderSVG className="inline" />
                    <span className="text-sm"> {formatDate(createdAt)}</span>
                </span>

                {isMitIdVerified && (
                    <div className="my-2 flex items-center justify-center space-x-2 py-1 px-3 bg-green-100 text-green-800 rounded-full">
                        <MitIDSVG className="w-5 h-5" />
                        <span className="text-sm font-semibold">MitID Verified</span>
                    </div>
                )}

                {fuldmagtGiverSignature ? (
                    <img
                        src={fuldmagtGiverSignature}
                        className="w-[100px] h-[56px] mt-2 border-b-2 border-gray-600 border-solid object-contain"
                        alt="Signature"
                    ></img>
                ) : (
                    <div className="w-[100px] h-[56px] mt-2 border-b-2 border-gray-600 border-solid flex items-center justify-center">
                        <p className="text-xs text-gray-500">No Signature</p>
                    </div>
                )}

                {isMitIdVerified && (
                    <div className="mt-4 w-full text-left self-start">
                        <p className="text-sm font-semibold mb-1">Signed Document:</p>
                        <a
                            href={fuldmagtDocumentsLink[0].fuldmagtDocumentLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            View Signed Document
                        </a>
                    </div>
                )}

            </div>
            Note   </div>
    );
}