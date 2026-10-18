type StaleBannerProps = {
  /** Why the refresh failed. */
  message: string
  onRetry: () => void
}

/** A slim notice shown when the page is displaying a saved copy because the latest refresh from the server failed. */
export default function StaleBanner({ message, onRetry }: StaleBannerProps) {
  return (
    <div
      role="status"
      className="box-border flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-[18px] bg-amber-pastel px-4 py-2.5 text-[13px] font-semibold text-amber-dark"
    >
      <span>Showing your last saved copy. {message}</span>
      <button
        type="button"
        onClick={onRetry}
        className="h-8 cursor-pointer rounded-full border-0 bg-white px-4 font-sans text-xs font-bold text-navy"
      >
        Try again
      </button>
    </div>
  )
}
