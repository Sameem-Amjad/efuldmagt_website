/* eslint-disable react/prop-types */
const SignatureCard = ({ title, signature, onChange }) => (
  <div className="flex flex-col w-full bg-white shadow-md rounded-lg p-5">
    <p className="text-gray-600 font-semibold text-center">{title}</p>
    <div className="mt-3 flex justify-center items-center h-[120px] border border-gray-300 rounded-md">
      {signature ? (
        <img
          src={signature}
          alt={`${title} Signature`}
          className="h-full object-contain"
        />
      ) : (
        <span className="text-gray-500 font-medium">No Signature</span>
      )}
    </div>
    <button
      className="mt-3 text-blue-600 font-semibold hover:underline self-center"
      onClick={onChange}
    >
      Change
    </button>
  </div>
);

export default SignatureCard;
