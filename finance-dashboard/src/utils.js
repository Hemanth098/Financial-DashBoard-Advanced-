export function fmt(n) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const CAT_COLORS = {
  food: { bg: 'rgba(249,168,50,0.15)', color: '#f9a832' },
  transport: { bg: 'rgba(79,142,247,0.15)', color: '#4f8ef7' },
  shopping: { bg: 'rgba(124,92,252,0.15)', color: '#7c5cfc' },
  health: { bg: 'rgba(52,212,138,0.15)', color: '#34d48a' },
  entertainment: { bg: 'rgba(242,90,90,0.15)', color: '#f25a5a' },
  salary: { bg: 'rgba(52,212,138,0.18)', color: '#34d48a' },
  utilities: { bg: 'rgba(139,145,165,0.18)', color: '#8b91a5' },
  freelance: { bg: 'rgba(79,142,247,0.15)', color: '#4f8ef7' },
};

export const EMOJIS = {
  food: '🍽️', transport: '🚗', shopping: '🛍️',
  health: '💊', entertainment: '🎬', utilities: '⚡',
  salary: '💼', freelance: '💻',
};

export const AVATAR_PALETTE = [
  { bg: 'rgba(79,142,247,0.2)', color: '#4f8ef7' },
  { bg: 'rgba(52,212,138,0.2)', color: '#34d48a' },
  { bg: 'rgba(124,92,252,0.2)', color: '#7c5cfc' },
  { bg: 'rgba(249,168,50,0.2)', color: '#f9a832' },
  { bg: 'rgba(242,90,90,0.2)', color: '#f25a5a' },
];

export function getAvatarColor(id) {
  return AVATAR_PALETTE[id % AVATAR_PALETTE.length];
}

export const cardStyle = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '14px',
};
