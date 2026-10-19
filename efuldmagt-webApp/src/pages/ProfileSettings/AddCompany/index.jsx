import { useState } from "react";
import CompanySearchBar from "../../../components/ui/searchBars/CompanySearchBar";
import { toast } from "react-toastify";
import BackNavigation from "../../../components/global/common/BackNavigation";
import AddCompanyForm from "./components/AddCompanyForm";
import { LoadingSpinner } from "../../../components/global/Loaders/Loader";
import parsePhoneNumber from "libphonenumber-js";
import { useTranslation } from "react-i18next";
const AddCompanyPage = () => {
  const [addMannually, setAddMannually] = useState(false);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  const [initialCompanyData, setInitialCompanyData] = useState(null); 
  const { t } = useTranslation();
  const assignCompanyHandle = async () => {
    if (!company) {
      return toast.error(t("select_company_first_toast"));
    }
    
    setLoading(true);
    try {
      const parsedPhone = company.phone ? parsePhoneNumber(String(company.phone), 'DK') : null;

      const validData = {
        cvr: company.vat || "",
        companyName: (company.name || "").split(' - ')[0],
        email: company.email || "",
        phone: parsedPhone ? {
          countryCode: parsedPhone.countryCallingCode || "",
          number: parsedPhone.nationalNumber || "",
        } : null, // Set to null if not present
        address: {
          address: company.address || "",
          addressLine: company.addressco || "",
          postalCode: company.zipcode || "",
          city: company.city || "",
          country: "Denmark",
        },
      };
      
      // ✅ THE FIX:
      // 1. Set the data for the manual form.
      setInitialCompanyData(validData);
      
      // 2. Switch to the manual form view.
      setAddMannually(true); 

    } catch (error) {
      console.error("Failed to process company data:", error);
      toast.error(t("failed_to_process_company_data_toast"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BackNavigation title={"Add Company"} />
      <div className="flex flex-col items-center">
        {!addMannually && (
          <div className="flex flex-col w-full md:w-3/5 lg:w-2/5 space-y-5 items-center">
            <div className="flex flex-row w-full">
              <label className="font-medium">
                {t("cvr_or_company_name_label")}
              </label>
            </div>
            <CompanySearchBar
              className={"w-full"}
              setSelectedCompany={setCompany}
            />
            <button
              className="w-[200px] btn-primary disabled:bg-opacity-50"
              onClick={assignCompanyHandle}
              disabled={loading}
            >
              Continue {loading && <LoadingSpinner />}
            </button>
            <div className="flex items-center justify-center w-full">
              <div className="w-full border border-gray-200"></div>
              <p className="mx-2 text-gray-500">{t("or_divider")}</p>
              <div className="w-full border border-gray-200"></div>
            </div>
            <div
              className="w-4/5 flex items-center justify-center text-md font-bold h-[100px] border-2 border-dashed rounded-lg hover:cursor-pointer"
              onClick={() => {
                  setInitialCompanyData(null); // Clear any previous data
                  setAddMannually(true);
              }}
            >
            {t("add_company_manually")}
            </div>
          </div>
        )}
        
        {addMannually && <AddCompanyForm initialData={initialCompanyData} />}
      </div>
    </div>
  );
};

export default AddCompanyPage;