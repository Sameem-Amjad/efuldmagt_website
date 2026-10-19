// TRANSLATION: Imported the useTranslation hook from react-i18next.
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const PageNotFound = () => {
    // TRANSLATION: Initialized the t function by calling useTranslation().
    const { t } = useTranslation();

    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center gap-5">
            <h1 className="text-destructive text-8xl font-bold">404</h1>
            <p className="font-bold text-2xl">{t("page_not_found_oops")}</p>
            <Link to="/">
                <button>{t("back_to_home")}</button>
            </Link>
        </div>
    );
};

export default PageNotFound;