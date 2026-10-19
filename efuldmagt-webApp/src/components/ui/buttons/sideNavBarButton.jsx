/* eslint-disable react/prop-types */
export default function SideNavbarButton({
  icon,
  children,
  onClick,
  className = "",
  imgClassName = "",
}) {
  return (
    <button
      className={"flex w-full items-center" + className}
      onClick={onClick}
    >
      <img className={"w-[26px] outline-primary " + imgClassName} src={icon} />
      <p className={"text-base text-left font-semibold ml-4 w-full"}>
        {children}
      </p>
    </button>
  );
}
