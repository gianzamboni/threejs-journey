export function pascalCaseToText(text: string) {
  return text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function printable(propertyName: string): string {
  
  let printableName = propertyName.replace(/([A-Z])/g, ' $1').trim();
  printableName = printableName.replace(/\./g, ' ');
  return printableName.charAt(0).toUpperCase() + printableName.slice(1);
}

export function getPathArray(path: string): string[] {
  return path.split('.');
}