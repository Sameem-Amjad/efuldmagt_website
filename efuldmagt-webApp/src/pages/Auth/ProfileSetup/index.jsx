import React, { useState } from "react";
import topImage from "../../../assets/registration/Vector.png";
import { useForm } from "react-hook-form";
import CustomInput from "../../../components/global/CustomInput/customInput";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../../components/global/Loaders/Loader";
import { registerUser } from "../../../services/authentication.services";
import { useTranslation } from "react-i18next";
const ProfileSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlState = location.state;
  const [loading, setLoading] = useState(false);
  const {t}=useTranslation()
  const {
    register,
    handleSubmit,
    setError, // <-- Add this
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const today = new Date();
      const birthDate = new Date(data.dateOfBirth);

      const postalCodeRegex = /^[0-9]+$/;
      const nameRegex = /^[a-zA-Z\u00C0-\u017F'-]+(?:\s[a-zA-Z\u00C0-\u017F'-]+)*$/;;
      const cityCountryRegex = /^[a-zA-Z\u00C0-\u017F\s'-]+$/; 
      today.setHours(0, 0, 0, 0);


      if (!nameRegex.test(data.firstName.trim())) {
        toast.error("First name contains invalid characters.");
        setError("firstName", {
          type: "manual",
          message: "Use only letters, hyphens (-), or apostrophes (').",
        });
        return;
      }
      if (!nameRegex.test(data.lastName.trim())) {
        toast.error("Last name contains invalid characters.");
        setError("lastName", {
          type: "manual",
          message: "Use only letters, hyphens (-), or apostrophes (').",
        });
        return;
      }

      // B. Date of Birth cannot be in the future
      if (birthDate > today) {
        toast.error("Date of birth cannot be in the future.");
        setError("dateOfBirth", {
          type: "manual",
          message: "Date of birth cannot be in the future.",
        });
        return; // Stop submission
      }

      // C. Postal Code must be numeric
      if (!postalCodeRegex.test(data.postalCode)) {
        toast.error("Invalid postal code.");
        setError("postalCode", {
          type: "manual",
          message: "Postal code must contain only numbers.",
        });
        return; // Stop submission
      }

      // D. City / Country Validation
      if (!cityCountryRegex.test(data.city)) {
        toast.error("City name contains invalid characters.");
        setError("city", {
          type: "manual",
          message: "City contains invalid characters.",
        });
        return;
      }
      if (!cityCountryRegex.test(data.country)) {
        toast.error("Country name contains invalid characters.");
        setError("country", {
          type: "manual",
          message: "Country contains invalid characters.",
        });
        return;
      }

      setLoading(true);

      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      if (birthDate > eighteenYearsAgo) {
        toast.error("You must be at least 18 years old to register.");
        setLoading(false);
        return;
      }

      // --- 2. All validations passed, proceed with API call ---
      const validData = {
        emailCredentialsToken: urlState?.emailCredentialsToken,
        phoneCredentialsToken: urlState?.phoneCredentialsToken,
        name: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
        address: {
          address: data?.address,
          addressLine: data?.addressLine,
          postalCode: data?.postalCode,
          city: data?.city,
          country: data?.country,
        },
        dateOfBirth: data?.dateOfBirth,
      };

      const res = await registerUser(validData);
      console.log("res: ", res);

      if (res?.status === 200 || res?.status === 201) {
        toast.success("User has been created successfully!");
      }

      navigate("/signup/create-passcode", {
        state: {
          createPasswordToken: res?.data?.data?.createPasswordToken,
          user: res?.data?.data?.user,
        },
      });
    } catch (error) {
       console.log("error: ", error);
        const errorMessage = error?.response?.data?.message;
        if (errorMessage == "Invalid or Expired Token" || errorMessage=="Email Credential Token has expired" ||errorMessage=="Phone Credential Token has expired" ||errorMessage=="Invalid or Expired Token") {
          console.log("sa",errorMessage)
          toast.error(t("session_expired_toast", "Your session has expired. Please try again."));
            navigate("/signup"); // Navigate back to signup
        } else {
            toast.error(errorMessage || t("an_error_occurred", "An unknown error occurred."));
        }
      }  finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col py-12 align-middle w-full md:w-1/2 overflow-auto ">
      <img className="absolute z-[0] top-0 right-0 w-4/5" src={topImage} />
      <div className="flex justify-center">
        <div className="z-[1] h-1/2 align-middle w-11/12 md:w-8/12 lg:w-7/12">
          <h2 className="text-sm font-semibold text-muted">
            Welcome to Attorney
          </h2>
          <h3 className="text-lg font-bold mt-0 text-primary">Sign Up</h3>
          <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-md font-semibold">Name</label>
            <CustomInput
              errors={errors}
              name="firstName"
              header={"First Name"}
              width="120"
              className="mt-2 w-full"
              register={register}
              required
            />
            <CustomInput
              errors={errors}
              name="lastName"
              header={"Last Name"}
              width="120"
              className="mt-2 w-full"
              register={register}
              required
            />
            <CustomInput
              type={"date"}
              errors={errors}
              name="dateOfBirth"
              header={"Date of Birth"}
              width="120"
              className="mt-2 w-full"
              register={register}
              required
            />

            <label className="block text-md font-semibold mt-6">Address</label>
            <CustomInput
              errors={errors}
              name="address"
              header={"Address"}
              width="120"
              className="mt-2 w-full"
              register={register}
              required
            />
            <CustomInput
              errors={errors}
              name="addressLine"
              header={"Address Line"}
              width={120}
              className="mt-2 w-full"
              register={register}
            />
            {/* --- 4. REVERTED POSTAL CODE INPUT --- */}
            <CustomInput
              errors={errors}
              name="postalCode"
              header={"Postal Code"}
              width={120}
              className="mt-2 w-full"
              register={register}
              required
            />
            <CustomInput
              errors={errors}
              name="city"
              header={"City"}
              width={120}
              className="mt-2 w-full"
              register={register}
              required
            />
            <CustomInput
              errors={errors}
              name="country"
              header={"Country"}
              width={120}
              className="mt-2 w-full"
              register={register}
              required
            />
            <div className="flex justify-center">
              <button
                disabled={loading}
                type="submit"
                className="w-[180px] mt-6 btn-primary disabled:bg-opacity-50"
              >
                Create Account {loading && <LoadingSpinner />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;