/* eslint-disable react/prop-types */
const tabOptions = [
  { label: "Offers and Updates", value: false },
  { label: "Account", value: true },
];

const Switcher = ({ isAccount, setIsAccount }) => {
  return (
    <div>
      <div className="flex items-center justify-center space-x-2 rounded-full bg-[#246C89] p-1 w-max mx-auto">
        {tabOptions.map(({ label, value }) => (
          <button
            key={label}
            type="button"
            className={`px-10 py-3 rounded-full text-sm font-bold transition ${
              isAccount === value
                ? "bg-white text-primary shadow-md border-2 border-black"
                : "bg-white bg-opacity-50 text-primary border-2 border-transparent"
            }`}
            onClick={() => setIsAccount(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Switcher;
