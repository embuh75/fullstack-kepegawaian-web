// Kumpulan ikon SVG ringan (tanpa dependency tambahan).
// Semua ikon menerima props standar svg (className, size, dst).

function Base({ children, size = 20, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconHome = (p) => (
  <Base {...p}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 9.5V20h13V9.5" />
    <path d="M9.5 20v-6h5v6" />
  </Base>
);

export const IconBriefcase = (p) => (
  <Base {...p}>
    <rect x="3" y="7.5" width="18" height="12" rx="2" />
    <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" />
    <path d="M3 12.5h18" />
  </Base>
);

export const IconBook = (p) => (
  <Base {...p}>
    <path d="M4 5.2C4 4.1 4.9 4 6 4h5v16H6c-1.1 0-2-.5-2-1.4Z" />
    <path d="M20 5.2c0-1.1-.9-1.2-2-1.2h-5v16h5c1.1 0 2-.5 2-1.4Z" />
  </Base>
);

export const IconUsers = (p) => (
  <Base {...p}>
    <circle cx="9" cy="8.5" r="3" />
    <path d="M3.5 19.5c.7-3 2.8-4.7 5.5-4.7s4.8 1.7 5.5 4.7" />
    <circle cx="17" cy="9" r="2.4" />
    <path d="M15.7 14.9c2.1.4 3.6 1.9 4.1 4.1" />
  </Base>
);

export const IconLogout = (p) => (
  <Base {...p}>
    <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
    <path d="M15 16l4-4-4-4" />
    <path d="M19 12H9" />
  </Base>
);

export const IconSearch = (p) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.3-4.3" />
  </Base>
);

export const IconPlus = (p) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
);

export const IconEdit = (p) => (
  <Base {...p}>
    <path d="M4 20h4.2L19 9.2a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0L4 15.8Z" />
    <path d="M13.5 6.5l3 3" />
  </Base>
);

export const IconTrash = (p) => (
  <Base {...p}>
    <path d="M4.5 6.5h15" />
    <path d="M9 6.5V4.8c0-.6.5-1.1 1.1-1.1h3.8c.6 0 1.1.5 1.1 1.1v1.7" />
    <path d="M6.5 6.5 7.3 19a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4l.8-12.5" />
    <path d="M10.2 10.5v6M13.8 10.5v6" />
  </Base>
);

export const IconX = (p) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);

export const IconChevronLeft = (p) => (
  <Base {...p}>
    <path d="M14.5 5.5 8 12l6.5 6.5" />
  </Base>
);

export const IconChevronRight = (p) => (
  <Base {...p}>
    <path d="M9.5 5.5 16 12l-6.5 6.5" />
  </Base>
);

export const IconUser = (p) => (
  <Base {...p}>
    <circle cx="12" cy="8.2" r="3.4" />
    <path d="M4.8 19.5c1-3.6 3.4-5.5 7.2-5.5s6.2 1.9 7.2 5.5" />
  </Base>
);

export const IconPhone = (p) => (
  <Base {...p}>
    <path d="M6 3.5h2.4l1.4 4-2 1.4a11 11 0 0 0 5.3 5.3l1.4-2 4 1.4V16c0 1.4-1.1 2.5-2.5 2.4C9.8 18 6 14.2 5.6 8.5 5.5 7.1 4.6 3.5 6 3.5Z" />
  </Base>
);

export const IconMail = (p) => (
  <Base {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
    <path d="M4.5 7l7.5 6 7.5-6" />
  </Base>
);

export const IconEye = (p) => (
  <Base {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.6" />
  </Base>
);

export const IconMenu = (p) => (
  <Base {...p}>
    <path d="M4 6.5h16M4 12h16M4 17.5h16" />
  </Base>
);

export const IconAlertTriangle = (p) => (
  <Base {...p}>
    <path d="M12 4.5 21.5 20h-19Z" />
    <path d="M12 10v4.2" />
    <path d="M12 17.3h.01" />
  </Base>
);

export const IconCheckCircle = (p) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.3 12.3l2.4 2.4 5-5.4" />
  </Base>
);

export const IconXCircle = (p) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.3 9.3l5.4 5.4M14.7 9.3l-5.4 5.4" />
  </Base>
);

export const IconUpload = (p) => (
  <Base {...p}>
    <path d="M12 15.5V4.5" />
    <path d="M8 8.3 12 4l4 4.3" />
    <path d="M4.5 15.5V18a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2.5" />
  </Base>
);

export const IconIdCard = (p) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="8.5" cy="11" r="2" />
    <path d="M5.5 16c.5-1.6 1.6-2.4 3-2.4s2.5.8 3 2.4" />
    <path d="M14.5 9.5h4M14.5 12.5h4M14.5 15.5h2.5" />
  </Base>
);

export const IconCalendar = (p) => (
  <Base {...p}>
    <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17" />
    <path d="M8 3.5v3.5M16 3.5v3.5" />
  </Base>
);

export const IconGraduationCap = (p) => (
  <Base {...p}>
    <path d="M2.5 9.5 12 5l9.5 4.5-9.5 4.5-9.5-4.5Z" />
    <path d="M6.5 11.6v4c0 1.4 2.5 2.9 5.5 2.9s5.5-1.5 5.5-2.9v-4" />
  </Base>
);

export const IconLoader = ({ className = "", ...p }) => (
  <Base className={`animate-spin ${className}`} {...p}>
    <path d="M12 3.5v3.2" />
    <path d="M12 17.3v3.2" opacity="0.3" />
    <path d="M6.3 6.3l2.3 2.3" opacity="0.9" />
    <path d="M15.4 15.4l2.3 2.3" opacity="0.4" />
    <path d="M3.5 12h3.2" opacity="0.5" />
    <path d="M17.3 12h3.2" opacity="0.7" />
    <path d="M6.3 17.7l2.3-2.3" opacity="0.6" />
    <path d="M15.4 8.6l2.3-2.3" opacity="0.8" />
  </Base>
);

export const IconShield = (p) => (
  <Base {...p}>
    <path d="M12 3.5 19 6.3v5.4c0 4.6-3 7.8-7 9.2-4-1.4-7-4.6-7-9.2V6.3Z" />
    <path d="M9 12l2 2 4-4.3" />
  </Base>
);

export const IconHeartPulse = (p) => (
  <Base {...p}>
    <path d="M12 20s-7.5-4.6-9.3-9.4C1.6 7.3 3.4 4.5 6.4 4.5c1.8 0 3.2 1 4 2.3.8-1.3 2.2-2.3 4-2.3 3 0 4.8 2.8 3.7 6.1C19.5 15.4 12 20 12 20Z" />
    <path d="M6 12h2.3l1.4-2.4 1.6 4 1.3-2.6H15" />
  </Base>
);

export const IconBuilding = (p) => (
  <Base {...p}>
    <rect x="4" y="3.5" width="10" height="17" rx="1" />
    <rect x="14" y="9.5" width="6" height="11" rx="1" />
    <path d="M7 7h1M10 7h1M7 10.5h1M10 10.5h1M7 14h1M10 14h1" />
  </Base>
);
