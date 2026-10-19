import { createBrowserRouter, Outlet } from "react-router-dom";
import PageLoader from "../components/global/Loaders/PageLoader.jsx";
import PublicRoute from "@/components/PublicRoute";
import PrivateRoute from "../components/PrivateRoute/index.jsx";
import { Suspense } from "react";
import { Components } from "../utils/functions/componentImport.js";
import AuthLayout from "../layouts/AuthLayout/index.jsx";
import DashboardLayout from "../layouts/DashboardLayout/index.jsx";

export const router = createBrowserRouter([
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Components.PageNotFound />
      </Suspense>
    ),
  },
  {
    path: "/signin",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicRoute>
          <AuthLayout />
        </PublicRoute>
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: (
  
          <Suspense fallback={<PageLoader />}>
            <Components.Login />
          </Suspense>
  
        ),
      },
      {
        path: "enter-passcode",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.EnterPassCode />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicRoute>
          <AuthLayout />
        </PublicRoute>
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.SignUp />
          </Suspense>
        ),
      },
      {
        path: "email-otp-verification",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.OtpVerification />
          </Suspense>
        ),
      },
      {
        path: "phone",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.Phone />
          </Suspense>
        ),
      },
      {
        path: "phone-otp-verification",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.PhoneOtpVerfication />
          </Suspense>
        ),
      },
      {
        path: "profile-setup",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.ProfileSetup />
          </Suspense>
        ),
      },
      {
        path: "create-passcode",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.CreatePasscode />
          </Suspense>
        ),
      },
      {
        path: "renter-passcode",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.RenterPasscode />
          </Suspense>
        ),
      },
    ],
  },

  {
    path: "/forgot-passcode",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicRoute>
          <AuthLayout />
        </PublicRoute>
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.ForgotPasscodeEmail />
          </Suspense>
        ),
      },
      {
        path: "phone",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.ForgotPasscodePhone />
          </Suspense>
        ),
      },
      {
        path: "otp-verification",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.ForgotPasscodeOtpVerification />
          </Suspense>
        ),
      },
      {
        path: "new-passcode",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.ForgotNewPasscode />
          </Suspense>
        ),
      },
      {
        path: "re-enter-passcode",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.ForgotRePasscode />
          </Suspense>
        ),
      },
    ],
  },

  {
    path: "/payment-success",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PrivateRoute>
          <Components.PaymentSuccess />
        </PrivateRoute>
      </Suspense>
    ),
  },

  {
    path: "/payment-failed",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PrivateRoute>
          <Components.PaymentFailed />
        </PrivateRoute>
      </Suspense>
    ),
  },

  {
    path: "",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PrivateRoute>
          <DashboardLayout>
            <Outlet />
          </DashboardLayout>
        </PrivateRoute>
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.Home />
          </Suspense>
        ),
      },
      {
        path: "allFuldmagts",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.AllFuldmagts />
          </Suspense>
        ),
      },
      {
        path: "e-fuldmagts/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.Efludmagt />
          </Suspense>
        ),
      },
      {
        path: "e-fuldmagt-requests/:id",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.FuldmagtRequest />
          </Suspense>
        ),
      },

      // Notifications
      {
        path: "notifications",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.AllNotifications />
          </Suspense>
        ),
      },
      {
        path: "notifications/settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.NotificationSettings />
          </Suspense>
        ),
      },

      // Profile Settings
      {
        path: "profile-settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.ProfileSettings />
          </Suspense>
        ),
      },
      {
        path: "profile-settings/user",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.User />
          </Suspense>
        ),
      },
      {
        path: "profile-settings/company-settings",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.CompanySettings />
          </Suspense>
        ),
      },
      {
        path: "profile-settings/add-company",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.AddCompany />
          </Suspense>
        ),
      },
      {
        path: "profile-settings/signatures",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.Signatures />
          </Suspense>
        ),
      },
      {
        path: "profile-settings/login-and-safety",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.LoginAndSafety />
          </Suspense>
        ),
      },
      {
        path: "profile-settings/workflow",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.EfludmagtsWorks />
          </Suspense>
        ),
      },
      {
        path: "profile-settings/contact-us",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.ContactUs />
          </Suspense>
        ),
      },
      {
        path: "profile-settings/user/address",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.AddressSettings />
          </Suspense>
        ),
      },
      {
        path: "profile-settings/changelanguage",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.ChangeLanguage />
          </Suspense>
        ),
      },

      // Fuldmagt Creation
      {
        path: "/e-fuldmagts/request",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.CreateEfuldmagt />
          </Suspense>
        ),
      },
            {
        path: "/profileverified",
        element: (
          <Suspense fallback={<PageLoader />}>
            <Components.ProfileVerified />
          </Suspense>
        ),
      },
    ],
  },
]);
