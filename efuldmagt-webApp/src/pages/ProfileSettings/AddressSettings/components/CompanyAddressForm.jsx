import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CustomInput from "../../../../components/global/CustomInput/customInput";
import { useDispatch, useSelector } from "react-redux";
import { updateCompanyInfo } from "../../../../services/company.services";
import { setCompany } from "../../../../redux/features/company/companySlice";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../../components/global/Loaders/Loader";

const CompanyAddressForm = () => {
  const token = localStorage.getItem("token");
  const { company } = useSelector((state) => state.company);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: company?.address?.address,
      addressLine: company?.address?.addressLine,
      postalCode: company?.address?.postalCode,
      city: company?.address?.city,
      country: company?.address?.country,
    },
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await updateCompanyInfo(token, {
        ...company,
        address: data,
      });
      dispatch(setCompany(res?.data?.data?.company));
      console.log("res: ", res);
      toast.success("address updated successfully!");
    } catch (error) {
      console.log("error: ", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "error updating address"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-row items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:w-3/5 lg:w-2/5  space-y-2"
      >
        <CustomInput
          header={"Address"}
          type={"text"}
          width={140}
          placeholder={"Enter Address Line"}
          name={"address"}
          register={register}
          errors={errors}
        />
        <CustomInput
          header={"Address Line"}
          type={"text"}
          width={140}
          placeholder={"Enter Address Line"}
          name={"addressLine"}
          register={register}
          errors={errors}
        />
        <CustomInput
          header={"Postal Code"}
          type={"number"}
          width={140}
          placeholder={"Enter Postal Code"}
          name={"postalCode"}
          register={register}
          errors={errors}
        />
        <CustomInput
          header={"City"}
          type={"text"}
          width={140}
          placeholder={"Enter City"}
          name={"city"}
          register={register}
          errors={errors}
        />
        <CustomInput
          header={"Country"}
          type={"text"}
          width={140}
          placeholder={"Enter Country"}
          name={"country"}
          register={register}
          errors={errors}
        />

        <div className="flex justify-center w-full">
          <button
            disabled={loading}
            className="btn-primary w-3/5 md:w-2/5 h-[50px] disabled:bg-opacity-50"
            type="submit"
          >
            Save {loading && <LoadingSpinner />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyAddressForm;
