export type ExerciseSettings = {
  id: string;
  description?: string;
}

export type CameraSettings = {
  initialPosition?: [number, number, number];
}

export type ViewSettings = {
  camera?: CameraSettings;
}