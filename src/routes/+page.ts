import { PUBLIC_API_URL } from "$env/static/public";

export async function load() {
  const res = await fetch(PUBLIC_API_URL);
  const data = (await res.json()) as ApiData;

  return data;
}
