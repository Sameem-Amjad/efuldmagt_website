import React from "react";

export const Components = {
  // Sign Up
  SignUp: React.lazy(() => import("../../pages/Auth/SignUp")),
  OtpVerification: React.lazy(() => import("../../pages/Auth/OtpVerification")),
  Phone: React.lazy(() => import("../../pages/Auth/Phone")),
  PhoneOtpVerfication: React.lazy(() =>
    import("../../pages/Auth/PhoneOtpVerfication")
  ),
  ProfileSetup: React.lazy(() => import("../../pages/Auth/ProfileSetup")),
  CreatePasscode: React.lazy(() => import("../../pages/Auth/CreatePassCode")),
  RenterPasscode: React.lazy(() => import("../../pages/Auth/RenterPasscode")),

  // Login
  Login: React.lazy(() => import("../../pages/Auth/Login")),
  EnterPassCode: React.lazy(() => import("../../pages/Auth/EnterPassCode")),

  // Forgot Password
  ForgotPasscodeEmail: React.lazy(() =>
    import("../../pages/Auth/ForgotPasscode/EmailPage")
  ),
  ForgotPasscodePhone: React.lazy(() =>
    import("../../pages/Auth/ForgotPasscode/PhonePage")
  ),
  ForgotPasscodeOtpVerification: React.lazy(() =>
    import("../../pages/Auth/ForgotPasscode/OtpVerification")
  ),
  ForgotNewPasscode: React.lazy(() =>
    import("../../pages/Auth/ForgotPasscode/CreateNewPassCode")
  ),
  ForgotRePasscode: React.lazy(() =>
    import("../../pages/Auth/ForgotPasscode/ReEnterNewPassCode")
  ),

  // Dashboard
  Home: React.lazy(() => import("../../pages/Dashboard/Home")),
  AllFuldmagts: React.lazy(() => import("../../pages/Dashboard/AllEfuldmagts")),
  Efludmagt: React.lazy(() => import("../../pages/Dashboard/Efuldmagt")),

  // Notifications
  AllNotifications: React.lazy(() =>
    import("../../pages/Notifications/AllNotifications")
  ),
  NotificationSettings: React.lazy(() =>
    import("../../pages/Notifications/NotificationSettings")
  ),

  // Profile Settings
  ProfileSettings: React.lazy(() => import("../../pages/ProfileSettings")),
  User: React.lazy(() => import("../../pages/ProfileSettings/User")),
  CompanySettings: React.lazy(() =>
    import("../../pages/ProfileSettings/CompanySettings")
  ),
  AddCompany: React.lazy(() =>
    import("../../pages/ProfileSettings/AddCompany")
  ),
  Signatures: React.lazy(() =>
    import("../../pages/ProfileSettings/Signatures")
  ),
  LoginAndSafety: React.lazy(() =>
    import("../../pages/ProfileSettings/LoginAndSafety")
  ),
  AddressSettings: React.lazy(() =>
    import("../../pages/ProfileSettings/AddressSettings")
  ),
  EfludmagtsWorks: React.lazy(() =>
    import("../../pages/ProfileSettings/EfludmagtsWorks")
  ),
  ContactUs: React.lazy(() => import("../../pages/ProfileSettings/ContactUs")),

  // Fuldmagt Creation
  CreateEfuldmagt: React.lazy(() => import("../../pages/CreateEfuldmagt")),

  // Request Fuldmagt
  FuldmagtRequest: React.lazy(() =>
    import("../../pages/Dashboard/EfuldmagtRequest")
  ),

  // Payment
  PaymentSuccess: React.lazy(() => import("../../pages/Others/PaymentSuccess")),
  PaymentFailed: React.lazy(() => import("../../pages/Others/PaymentFailed")),

  // Page not found
  PageNotFound: React.lazy(() => import("../../pages/PageNotFound")),
  ChangeLanguage:React.lazy(()=>import("../../pages/ProfileSettings/ChangeLanguage/Index")),
  ProfileVerified:React.lazy(()=>import("../../pages/mitidprofile/Index"))
};
