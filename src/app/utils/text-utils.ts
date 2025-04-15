export function pascalCaseToText(text: string) {
  return text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function textToKebabCase(text: string) {
  return text.split(' ').map(word => word.toLowerCase()).join('-');
}

export function printable(propertyName: string): string {
  let printableName = propertyName.replace(/([A-Z])/g, ' $1').trim();
  printableName = printableName.replace(/\./g, ' ');
  return printableName.charAt(0).toUpperCase() + printableName.slice(1);
}

export function isRegex(x: string): boolean {
  return x.includes('/');
}

export function getPathArray(path: string): string[] {
  const regex = /\/.*?\//g;
  const matches = Array.from(path.matchAll(regex));
  
  if(matches.length === 0) {
    return path.split('.');
  }

  const result: string[] = [];
  
  let lastIndex = 0;
  for(const match of matches) {
    const matchStart = match.index!;
    const matchEnd = matchStart + match[0].length;
    
    const beforeRegex = path.substring(lastIndex, matchStart);
    if (beforeRegex) {
      result.push(...beforeRegex.split('.').filter(Boolean));
    }
    
    result.push(match[0]);

    lastIndex = matchEnd;
  }

   const afterLastRegex = path.substring(lastIndex);
   if (afterLastRegex) {
     result.push(...afterLastRegex.split('.').filter(Boolean));
   }

   return result.filter(Boolean);
}


export function mergePropertiesPath(key: string, path: string | undefined) {
  return path === undefined? key : `${key}.${path}`;
}
