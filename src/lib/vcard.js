const esc = (s) => String(s).replace(/([\\;,])/g, "\\$1").replace(/\n/g, "\\n");

export function buildVCard({ person, channels }) {
  const get = (id) => channels.find((c) => c.id === id);
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(person.last)};${esc(person.first)};;;`,
    `FN:${esc(`${person.first} ${person.last}`)}`,
    `TITLE:${esc(person.role)}`,
    `EMAIL;TYPE=INTERNET:${get("email").copyText}`,
    `TEL;TYPE=CELL:${get("phone").copyText}`,
    `URL:${get("github").href}`,
    `URL:${get("telegram").href}`,
    "END:VCARD",
  ];
  return lines.join("\r\n");
}

export function downloadVCard(data, filename) {
  const blob = new Blob([buildVCard(data)], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
