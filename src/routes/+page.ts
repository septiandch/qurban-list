import { PUBLIC_API_URL } from "$env/static/public";

type DataType = { name: string; status: string };

export async function load() {
  const res = await fetch(PUBLIC_API_URL);
  const data = (await res.json()) as { [id: string]: DataType[] };

  return { data };
}
