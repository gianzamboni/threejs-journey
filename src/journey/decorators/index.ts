type ExerciseSettings = {
  id: string;
  description?: string;
}
export function Exercise(settings: ExerciseSettings) {
  if(!settings.id) {
    throw new Error('Exercise id is required');
  }
  return function(target: any) {
    target.id = settings.id;
    target.info = [];
    if(settings.description) {
      target.info.push(settings.description);
    }
  }
}