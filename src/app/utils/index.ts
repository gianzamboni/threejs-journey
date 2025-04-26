export function isInDevMode() {
  console.log(import.meta.env.MODE);
  return import.meta.env.MODE === "development";
}