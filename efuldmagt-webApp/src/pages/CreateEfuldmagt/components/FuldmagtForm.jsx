/* eslint-disable react/prop-types */
const FuldmagtForm = ({
  openedFuldmagt,
  register,
  errors,
  setValue,
  watch,
}) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full sm:4/5 xl:w-3/5 rounded-md shadow-lg border border-gray-100 p-2 sm:p-4 m-1">
        {openedFuldmagt?.additionalFields?.map((field, index) => {
          const fieldType = openedFuldmagt.additionalFieldsType[index];
          const fieldObject = openedFuldmagt.additionalFieldsObject[index];
          const fieldKey = openedFuldmagt.additionalFields[index];

          switch (fieldType) {
            case "headline":
              return (
                <div key={fieldKey} className="mt-3">
                  <input
                    id={fieldKey}
                    type="text"
                    className={`w-full border-2 p-2 rounded-md placeholder:text-gray-400
                      ${
                        errors[fieldKey]
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    placeholder={fieldObject?.text} // Text now appears inside
                    {...register(fieldKey, { required: true })}
                  />
                </div>
              );

            case "note":
              return (
                <div key={fieldKey} className="mt-3">
                  <input
                    id={fieldKey}
                    type="text"
                    className={`w-full border-2 p-2 rounded-md placeholder:text-gray-400
                      ${
                        errors[fieldKey]
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    placeholder={fieldObject?.text} // Text now appears inside
                    {...register(fieldKey, { required: true })}
                  />
                </div>
              );

case "date":
              return (
                <div key={fieldKey}>
                  <input
                    type="text"
                    placeholder={fieldObject?.placeholder || "Select a date"}
                    className={`w-full border-2 p-2 rounded-md placeholder:text-gray-400 mt-3 
                      ${
                        errors[fieldKey]
                          ? "border-red-500 focus:border-primary/30"
                          : "border-gray-200 focus:border-primary/30"
                      }
                    `}
                    {...register(fieldKey, { required: true })}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) =>
                      (e.target.type = e.target.value ? "date" : "text")
                    }
                  />
                </div>
              );
            case "radioButtons":
              return (
                <div key={fieldKey}>
                  <div className="w-full mt-3 space-y-2">
                    <p className="font-semibold text-gray-800">
                      {fieldObject?.heading}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {fieldObject.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
                        >
                          <input
                            type="radio"
                            className="hidden peer"
                            {...register(fieldKey, { required: true })}
                            value={option}
                          />
                          <div
                            className={`w-5 h-5 flex items-center justify-center border rounded-full
                            ${
                              errors[fieldKey]
                                ? "border-red-500"
                                : "border-gray-400"
                            } peer-checked:bg-primary`}
                          >
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                          </div>
                          <span className="text-gray-700 peer-checked:text-primary">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );

            case "checkBoxes":
              return (
                <div key={fieldKey} className="w-full mt-3 space-y-2">
                  <p className="font-semibold text-gray-800">
                    {fieldObject?.heading}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {fieldObject.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          className="hidden peer"
                          value={option}
                          {...register(fieldKey)}
                          onChange={(e) => {
                            const prevValues = watch(fieldKey) || [];
                            const newValues = e.target.checked
                              ? [...prevValues, option]
                              : prevValues.filter((item) => item !== option);
                            setValue(fieldKey, newValues);
                          }}
                        />
                        <div className="w-5 h-5 flex items-center justify-center border border-gray-400 rounded-md peer-checked:border-primary peer-checked:text-secondary">
                          <span>✔</span>
                        </div>
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );

            case "textArea":
              return (
                <textarea
                  key={fieldKey}
                  className={`resize-none w-full border-2 p-2 rounded-md placeholder:text-gray-400 mt-3
                    ${
                      errors[fieldKey]
                        ? "border-red-500 focus:border-primary/30"
                        : "border-gray-200 focus:border-primary/30"
                    }`}
                  rows={5}
                  placeholder={fieldObject?.placeholder || ""}
                  {...register(fieldKey, { required: true })}
                ></textarea>
              );

            case "textField":
              return (
                <div key={fieldKey}>
                  <input
                    className={`w-full border-2 p-2 rounded-md placeholder:text-gray-400 mt-3
                      ${
                        errors[fieldKey]
                          ? "border-red-500 focus:border-primary/30"
                          : "border-gray-200 focus:border-primary/30"
                      }`}
                    type="text"
                    placeholder={fieldObject?.placeholder}
                    {...register(fieldKey, { required: true })}
                  />
                </div>
              );
          }
        })}
      </div>
    </div>
  );
};

export default FuldmagtForm;
