import React, { useState } from "react";
import CustomInput, {
  Custom_Input,
} from "../../../../components/global/CustomInput/customInput";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo } from "../../../../services/user.services";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../../components/global/Loaders/Loader";
import { setUser } from "../../../../redux/features/user/userSlice";

const PrivateAddressForm = () => {
  const token = localStorage.getItem("token");
  const { user } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: user?.address?.address,
      addressLine: user?.address?.addressLine,
      postalCode: user?.address?.postalCode,
      city: user?.address?.city,
      country: user?.address?.country,
    },
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await updateUserInfo(token, {
        ...user,
        address: data,
      });
      dispatch(setUser(res?.data?.data?.user));
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
          width={120}
          placeholder={"Enter Your Address"}
          name={"address"}
          required={true}
          register={register}
          errors={errors}
        />
        <CustomInput
          header={"Address Line"}
          type={"text"}
          width={120}
          placeholder={"Enter Address Line"}
          name={"addressLine"}
          required={true}
          register={register}
          errors={errors}
        />
        <CustomInput
          header={"Postal Code"}
          type={"number"}
          width={120}
          placeholder={"Enter Postal Code"}
          name={"postalCode"}
          required={true}
          register={register}
          errors={errors}
        />
        <CustomInput
          header={"City"}
          type={"text"}
          width={120}
          placeholder={"Enter City"}
          name={"city"}
          required={true}
          register={register}
          errors={errors}
        />
        <CustomInput
          header={"Country"}
          type={"text"}
          width={120}
          placeholder={"Enter Country"}
          name={"country"}
          required={true}
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

export default PrivateAddressForm;
