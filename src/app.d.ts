// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  type DataType = {
    name: string;
    status: string;
    address: string;
    phonenum: string;
    selfreq: string;
    note: string;
    distreq: string;
    payment: "Belum Lunas" | "Bayar Separuh" | "Lunas" | "";
    remark: string;
    tag: string;
    category: string;
    groupId: string | number;
  };

  type AllData = DataType[];
  type GroupedData = { [category: string]: { [id: string]: DataType[] } };

  type ApiData = { all: AllData; grouped: GroupedData };
}

export {};
