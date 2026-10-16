type PagePlaceholderProps = {
  title: string
  subtitle: string
}

/** Temporary page body: title and subtitle in the shared type scale. Replaced as each page is built. */
export default function PagePlaceholder({ title, subtitle }: PagePlaceholderProps) {
  return (
    <div className="px-1.5">
      <h1 className="m-0 text-[30px] font-extrabold tracking-[-0.015em]">{title}</h1>
      <p className="mb-0 mt-[7px] text-sm leading-[1.55] text-muted">{subtitle}</p>
    </div>
  )
}
