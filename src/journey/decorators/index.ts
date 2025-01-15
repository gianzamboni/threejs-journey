type ExerciseSettings = {
  id: string;
  description?: string;
}
export function Exercise(settings: ExerciseSettings) {
  return function(target: any) {
    target.id = settings.id;
    target.description = [settings.description];
  }
}