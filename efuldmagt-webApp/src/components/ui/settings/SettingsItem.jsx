import { Link } from "react-router-dom";

export default function SettingsItem({ SvgItem, text, navigateTo, className }) {
  return (
    <Link
      to={navigateTo}
      target={
        text === "Term of Service" || text === "Privacy Policy" ? "_blank" : ""
      }
      className={
        "flex justify-between hover:bg-primary hover:bg-opacity-5 items-center h-[64px]  w-full border border-solid rounded-md shadow px-4 " +
        className
      }
    >
      <div className="flex items-center space-x-3">
        <div className="flex justify-center items-center h-[40px] w-[40px] bg-primary bg-opacity-35 rounded-full">
          <SvgItem className="h-[18px] w-[18px] text-secondary stroke-current" />
        </div>
        <p className="text-md ">{text}</p>
      </div>

      <div className="mr-4">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}
