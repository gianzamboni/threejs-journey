export function pascalCaseToText(text: string) {
  return text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}