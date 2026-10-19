export default function TopNavbarButton({
  Icon,
  iconType,
  children,
  onClick,
  active = false,
  className,
  imgClassName,
}) {
  return (
    <button
      className={
        "flex flex-col h-[56px] text-white items-center justify-center " +
        className
      }
      onClick={onClick}
    >
      {iconType == "svg" ? (
        <Icon
          fill="currentColor"
          className={active ? "text-secondary" : "text-primary"}
        />
      ) : (
        <img
          className={
            `w-[26px] h-[26px] object-cover outline-primary  ${
              active ? "outline outline-2 outline-offset-2" : ""
            } ` + imgClassName
          }
          src={Icon}
        />
      )}

      <p
        className={`text-base font-semibold mt-1 ${
          active ? "text-secondary" : "text-primary"
        }`}
      >
        {children}
      </p>
    </button>
  );
}
