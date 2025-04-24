import { Exercise } from "../types/exercise";
import { getId } from "../utils/exercise-metadata";

export class LocalStorage {

  public static getState<T>(exercise: Exercise | string): T | null {
    const id = typeof exercise === 'string' ? exercise : getId(exercise);
    const key = `three-js-journey-${id}`;
    const state = localStorage.getItem(key);
    return state ? JSON.parse(state) : null;
  }

  public static saveState<T>(exercise: Exercise, state: T) {
    const id = getId(exercise);
    const key = `three-js-journey-${id}`;
    localStorage.setItem(key, JSON.stringify(state));
  }
}