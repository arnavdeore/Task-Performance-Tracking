/** A navy confirmation message at the bottom of the screen. The page decides when to show and hide it. */
export default function Toast({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="fixed bottom-[104px] left-1/2 md:bottom-7 z-[60] box-border max-w-[calc(100vw-48px)] -translate-x-1/2 rounded-2xl bg-navy px-[26px] py-4 text-[14.5px] font-bold text-white shadow-[0_16px_28px_-10px_rgba(35,43,94,0.7)]"
    >
      {message}
    </div>
  )
}
