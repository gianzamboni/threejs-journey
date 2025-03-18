export function isInDevMode() {
  return import.meta.env.MODE === "development";
}