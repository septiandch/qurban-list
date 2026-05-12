import { PUBLIC_PHONENUM } from "$env/static/public";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function filterByName(data: GroupedData, keyword: string): GroupedData {
  const result: GroupedData = {};

  const lowerKeyword = keyword.toLowerCase();

  for (const category in data) {
    for (const id in data[category]) {
      const filteredItems = data[category][id].filter((item) =>
        item.name.toLowerCase().includes(lowerKeyword),
      );

      if (filteredItems.length > 0) {
        if (!result[category]) {
          result[category] = {};
        }

        result[category][id] = filteredItems;
      }
    }
  }

  return result;
}

export function getDate() {
  const now = new Date();

  return now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getSummary(data: ApiData) {
  return {
    peserta: data.all.length,
    sapi: Object.keys(data.grouped["Sapi"] || []).filter((key) => key !== "-")?.length,
    kambing: Object.keys(data.grouped["Kambing"] || [])?.length,
  };
}

function createRegistMsg(data: DataType) {
  return `
  Halo ${data.name},

  Status: ${data.status}
  Alamat: ${data.address}
  No HP: ${data.phonenum}

  Catatan: ${data.note}
  `.trim();
}

function createAnnounceMsg(data: DataType) {
  return `
   Bismillah,
Alhamdulillah saat ini telah mencapai total 53 pendaftar (9 Sapi, 1 Kambing)

List peserta dan form pendaftaran dapat diakses di:
📋 https://qurban-list.vercel.app/

------------------------
Data otomatis terupdate melalui link diatas
------------------------


---
Daftar disini: https://forms.gle/7re1fWNqy3FsKVj39
Atau hubungi:
- Bapak Wahyudi (0852-1751-2594)	
- Bapak Edi Suwito (0811-112-873)	
- Chandra (0822-5752-7757)
	
💵 Nomor Rekening Pembayaran	
BCA: 6881-1283-03 a/n Mohamad Wahyudi	
Konfirmasi pembayaran: Bapak Wahyudi (0852-1751-2594)

Batas akhir pendaftaran: 22 Mei 2026	
Batas akhir pelunasan: 25 Mei 2026 (dapat dicicil 2 kali)
    `.trim();
}

export function openWhatsapp(data: DataType) {
  const phone = PUBLIC_PHONENUM.replace(/^0/, "62");
  const message = createRegistMsg(data);

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

export function announceOnWhatsapp(data: ApiData) {
  const summary = getSummary(data);
}
