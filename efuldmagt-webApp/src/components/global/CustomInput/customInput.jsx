export default function CustomInput({
  initialValue,
  header,
  type,
  placeholder,
  className,
  width,
  name = "",
  register,
  errors,
  required = false,
}) {
  const validationRules = {};
  if (required) {
    validationRules.required = `${header} is required`;
  }
  return (
    <div className="gap-1">
      <div className={"flex items-center p-2 border rounded-lg " + className}>
        <p
          style={{ width: `${width}px` }}
          className={`m-1 border-r focus:border-black focus:outline-none focus:ring-0 text-base border-black`}
        >
          {header}
        </p>
        <input
          type={type}
          name={name}
          defaultValue={initialValue}
          className="border-0 w-full focus:border-0 focus:outline-none focus:ring-0 text-base text-muted placeholder:text-muted"
          placeholder={placeholder}
          {...register(name, validationRules)}
        />
      </div>
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}

export function Custom_Input({
  initialValue,
  header,
  type,
  placeholder,
  className,
  width,
  name = "",
  required = false,
  disabled = false,
}) {
  
  return (
    <div className={"flex items-center p-2 border rounded-lg " + className}>
      <p
        style={{ width: `${width}px` }}
        className={`m-1 border-r focus:border-black focus:outline-none focus:ring-0 text-base border-black`}
      >
        {header}
      </p>
      <input
        type={type}
        name={name}
        defaultValue={initialValue}
        required={required}
        disabled={disabled}
        className="border-0 w-full focus:border-0 focus:outline-none focus:ring-0 text-base"
        placeholder={placeholder}
      />
    </div>
  );
}
