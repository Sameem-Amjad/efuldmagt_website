import contactusImage from "/images/contact-us.png";
import BackNavigation from "../../../components/global/common/BackNavigation";
import { useTranslation } from "react-i18next";
export default function ContactUs() {
  const { t } = useTranslation();
  return (
    <div>
      <BackNavigation title={"Contact Us"} />
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center w-3/5 md:w-[365px]">
          <img src={contactusImage}></img>
          <p className="text-center">
            e-fuldmagt ApS<br></br>
            Address 123<br></br>
            5000 Odense C
          </p>
          <button className="rounded-full p-2 border-primary border-solid border bg-primary bg-opacity-20">
            <a href="mailto:Support@e-fuldmagt.dk">Support@e-fuldmagt.dk</a>
          </button>
          <div className="text-base text-center">
              {t("We will be happy to help you out. Please send us an email and we will get back to you quickly.")}
          </div>
          <hr className="border border-solid border-gray-500 w-full my-3"></hr>
          <p className="text-sm">{t("Our office hours are from")}</p>
          <p className="text-sm font-bold">{t("9:00 - 16:00")}</p>
        </div>
      </div>
    </div>
  );
}
