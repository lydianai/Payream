// Bu dosya, eksik provider logoları için placeholder SVG oluşturur.
export function getPlaceholderSVG(name: string) {
  return `<svg width='64' height='64' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='#e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='24' fill='#6b7280'>${name.charAt(0).toUpperCase()}</text></svg>`;
}
