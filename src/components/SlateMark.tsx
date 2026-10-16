/** The Slate logo square (stacked layers with a green status dot). Used by the top bar and the Login page. */
export default function SlateMark({ size = 38 }: { size?: number }) {
  return (
    <span
      className="relative flex flex-none items-center justify-center bg-[linear-gradient(160deg,#4C86F0_0%,#2457C5_55%,#1A3F94_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_14px_-8px_rgba(36,87,197,0.7)]"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.34) }}
    >
      <svg
        aria-hidden="true"
        width={Math.round(size * 0.58)}
        height={Math.round(size * 0.58)}
        viewBox="0 0 24 24"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3.5l8.5 4.2L12 12 3.5 7.7z" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.2" />
        <path d="M3.5 12l8.5 4.2 8.5-4.2" stroke="#CFE0FB" strokeWidth="2" />
        <path d="M3.5 16.2l8.5 4.3 8.5-4.3" stroke="#93B4F0" strokeWidth="2" />
      </svg>
      <span className="absolute -bottom-[3px] -right-1 box-border h-3 w-3 rounded-full border-[2.5px] border-white bg-green" />
    </span>
  )
}
