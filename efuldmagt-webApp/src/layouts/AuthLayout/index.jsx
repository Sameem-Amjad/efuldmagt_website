import { HeadProvider, Meta, Title } from "react-head";
import { Outlet } from "react-router-dom";
import sideImage from "@/assets/registration/sidephoto.jpeg";

const AuthLayout = () => {
  return (
    <>
      <HeadProvider>
        <Title>Fuldmaget</Title>
        <Meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </HeadProvider>
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="h-screen justify-center flex w-full bg-white shadow-lg overflow-hidden">
          <img
            className="hidden md:block w-1/2 bg-cover object-cover"
            src={sideImage}
          ></img>

          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
