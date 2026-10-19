/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUserByToken } from "../../services/user.services";
import { setUser } from "../../redux/features/user/userSlice";
import { toast } from "react-toastify";
import { setCompany } from "../../redux/features/company/companySlice";
import Loader from "../global/Loaders/Loader";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // This state now purely tracks if the initial API call is done.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndVerifyUser = async () => {
      if (token) {
        try {
          // --- THE FIX IS HERE ---
          // We no longer check if a user exists in Redux. If there's a token,
          // we ALWAYS fetch the latest data to ensure it's not stale.
          const res = await getUserByToken(token);
          const validUser = res?.data?.data?.user;
          const validCompany = res?.data?.data?.company;

          if (validUser?.deleted || validUser?.locked) {
            toast.error("Your account is inactive. Please contact support.");
            localStorage.removeItem("token");
            navigate("/signin");
            return;
          }

          // Dispatch both actions sequentially with the fresh data.
          dispatch(setUser(validUser));
          if (validCompany?.companyName && !validCompany?.deleted) {
            dispatch(setCompany(validCompany));
          } else {
            dispatch(setCompany(null));
          }

        } catch (error) {
          toast.error(error?.response?.data?.message || "Authentication failed. Please sign in again.");
          localStorage.removeItem("token");
          navigate("/signin");
        } finally {
          // Once the API call is complete (success or fail), stop loading.
          setIsLoading(false);
        }
      } else {
        // If there's no token, redirect to signin.
        navigate("/signin");
      }
    };

    fetchAndVerifyUser();
  }, [token, dispatch, navigate]); // This effect should only run when the token changes.

  // The component will only render its children after the fetch is complete.
  if (isLoading) {
    return <Loader />;
  }

  return children;
};

export default PrivateRoute;