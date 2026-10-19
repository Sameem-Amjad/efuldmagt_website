import { useForm } from "react-hook-form";
import CustomInput from "../../../../components/global/CustomInput/customInput";
import PhoneComponent from "../../../../components/global/phone/phoneComponet";
import { useState } from "react";
import { toast } from "react-toastify";
import { addCompany } from "../../../../services/company.services";
import parsePhoneNumber from "libphonenumber-js";
import { LoadingSpinner } from "../../../../components/global/Loaders/Loader";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const AddCompanyForm = ({ initialData }) => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (initialData) {
reset({
        cvr: initialData.cvr || "",
        companyName: initialData.companyName || "",
        address: initialData.address?.address || "", 
        addressLine: initialData.address?.addressLine || "",
        postalCode: initialData.address?.postalCode || "",
        city: initialData.address?.city || "",
        country: initialData.address?.country || "",
        email: initialData.email || "",
      });
      setPhone("");
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    const paresedPhoneNumber = parsePhoneNumber(phone);
    try {
      setLoading(true);
      const validData = {
        cvr: data.cvr,
        companyName: data.companyName,
        email: data?.email,
        phone: {
          countryCode: paresedPhoneNumber?.countryCallingCode,
          number: paresedPhoneNumber?.nationalNumber,
        },
        address: {
          address: data?.address,
          addressLine: data?.addressLine,
          postalCode: data?.postalCode,
          city: data?.city,
          country: data?.country,
        },
      };
      const res = await addCompany(token, validData);
      console.log("res: ", res);
      toast.success("Company added successfully!");
      window.location.href='/'
    } catch (error) {
      console.log("error: ", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add company"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form
        className="flex flex-col w-full md:w-3/5 lg:w-2/5 space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className="text-lg font-bold">{"Company"}</p>
        <CustomInput
          register={register}
          errors={errors}
          header={"CVR"}
          type="text"
          width={120}
          placeholder="Enter CVR Number"
          name="cvr"
          required
        />
        <CustomInput
          register={register}
          errors={errors}
          header={"Company Name"}
          type="text"
          width={120}
          placeholder="Enter Company Name"
          name="companyName"
          required
        />
        <CustomInput
          register={register}
          errors={errors}
          header={"Address"}
          type="text"
          width={120}
          placeholder="Enter Your Address"
          name="address"
          required
        />
        <CustomInput
          register={register}
          errors={errors}
          header={"Address Line"}
          type="text"
          width={120}
          placeholder="Enter Address Line"
          name="addressLine"
          required
        />
        <CustomInput
          register={register}
          errors={errors}
          header={"Postal Code"}
          type="number"
          width={120}
          placeholder="Enter Postal Code"
          name="postalCode"
          required
        />
        <CustomInput
          register={register}
          errors={errors}
          header={"City"}
          type="text"
          width={120}
          placeholder="Enter City"
          name="city"
          required
        />
        <CustomInput
          register={register}
          errors={errors}
          header={"Country"}
          type="text"
          width={120}
          placeholder="Enter Country"
          name="country"
          required
        />
        <p className="text-lg font-bold">{"Contact Details"}</p>
        <CustomInput
          register={register}
          errors={errors}
          header={"Email"}
          type="email"
          width={120}
          placeholder="Enter Email"
          name="email"
          required
        />
        <PhoneComponent phone={phone} setPhone={setPhone} />
        <div className="flex justify-center">
          <button
            disabled={loading}
            type="submit"
            className="btn-primary w-[200px] disabled:bg-opacity-50"
          >
            Add Company {loading && <LoadingSpinner />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCompanyForm;
