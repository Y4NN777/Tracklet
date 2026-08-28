interface BrandMarkProps {
  className?: string;
}

export function BrandMark({ className = "h-10 w-10" }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="10" fill="#465024" />
      <path d="M16 16.5V25" fill="none" stroke="#D6A752" strokeLinecap="round" strokeWidth="4.5" />
      <path
        d="M8 6.5v4.25A6.25 6.25 0 0 0 14.25 17H16"
        fill="none"
        stroke="#E8DCC7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4.5"
      />
      <path
        d="M24 6.5v4.25A6.25 6.25 0 0 1 17.75 17H16"
        fill="none"
        stroke="#D98E69"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4.5"
      />
    </svg>
  );
}
