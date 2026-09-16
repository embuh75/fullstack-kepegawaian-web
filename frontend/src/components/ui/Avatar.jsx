const PALETTE = [
  "bg-brand-100 text-brand-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
];

function colorFor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name, src, size = 40, className = "" }) {
  const dim = { width: size, height: size };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={dim}
        className={`shrink-0 rounded-full object-cover ring-2 ring-white ${className}`}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }

  return (
    <div
      style={{ ...dim, fontSize: size * 0.38 }}
      className={`flex shrink-0 items-center justify-center rounded-full font-bold ring-2 ring-white ${colorFor(
        name,
      )} ${className}`}
    >
      {initials(name)}
    </div>
  );
}
