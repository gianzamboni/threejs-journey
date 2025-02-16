export function pascalCaseToText(text: string) {
  return text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function printable(propertyName: string): string {
  const printableName = propertyName.replace(/([A-Z])/g, ' $1').trim();
  return printableName.charAt(0).toUpperCase() + printableName.slice(1);
}