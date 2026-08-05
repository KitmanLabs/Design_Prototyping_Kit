// Generic shield-with-medical-cross crest used as the "NFL Medical" mark across
// the app (sidebar, login right panel). Deliberately a neutral placeholder — not
// a reproduction of any real trademarked league logo. Uses currentColor so the
// parent controls the color.
export default function Crest({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M24 3 L42 9 V22 C42 34 34 42 24 45 C14 42 6 34 6 22 V9 Z"
        fill="currentColor"
        opacity="0.14"
      />
      <path
        d="M24 3 L42 9 V22 C42 34 34 42 24 45 C14 42 6 34 6 22 V9 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M24 14 V32 M15 23 H33"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
