import { useState } from "react";
import SetPasswordInput from "../../../components/ui/settings/SetPasswordInput";
import { AccountDeleteConfirmationModal } from "../../../components/ui/Modal/AccountDeleteModel";
import BackNavigation from "../../../components/global/common/BackNavigation";

const LoginAndSafetyPage = () => {
  const [confirmationModal, setConfirmationModal] = useState(false);

  return (
    <div>
      <BackNavigation title="Login & Safety" />
      <div className="h-full w-full flex-col justify-center p-1">
        {/* Notifications for Special Offers */}
        <div className="w-full md:w-4/5 lg:w-3/5 space-y-4 py-2">
          <SetPasswordInput />
        </div>

        {/* Delete Account */}
        <div className="mt-10">
          <p className="text-md font-semibold">Account</p>
          <button
            onClick={() => {
              setConfirmationModal(true);
            }}
            className="w-full md:w-[335px] h-[50px] rounded-lg border-solid border border-gray-800 text-gray-500 font-semibold"
          >
            Delete Account
          </button>
        </div>
        {confirmationModal && (
          <AccountDeleteConfirmationModal
            isOpen={confirmationModal}
            setIsOpen={setConfirmationModal}
          />
        )}
      </div>
    </div>
  );
};

export default LoginAndSafetyPage;
