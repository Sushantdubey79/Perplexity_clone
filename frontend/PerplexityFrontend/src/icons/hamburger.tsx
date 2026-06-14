

export default function Hamburger({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <div className= "cursor-pointer"  onClick={onClick}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20 7L4 7" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 12L4 12" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 17L4 17" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}