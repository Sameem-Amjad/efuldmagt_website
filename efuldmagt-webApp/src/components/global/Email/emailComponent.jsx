const EmailComponent = ({ register, errors }) => {
  return (
    <div className="mt-6">
      <label className="block text-md font-semibold">Email</label>
      <input
        type="email"
        placeholder="Enter Your Email"
        className="w-full mt-2 txt-field-primary text-muted"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: "Invalid email address",
          },
        })}
      />
      {errors.email && (
        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
      )}
    </div>
  );
};

export default EmailComponent;
