import { AnimationLoop } from "@/utils/animation-loop";
import { DecoratorsUtils } from "./decorator-utils";

export function Animation(targetClass: any, methodName: string) {
  let settings = DecoratorsUtils.getSettings(targetClass.constructor);
  settings.animationMethod = methodName;
}

export function setupAnimation(exerciseInstance: any, methodName: string | undefined) {
  const instanceExtras = DecoratorsUtils.getExtraProperties(exerciseInstance);

  exerciseInstance.isAnimated = methodName !== undefined;
  if(!exerciseInstance.isAnimated) return;

  const method = exerciseInstance[methodName!].bind(exerciseInstance);
  const animationLoop = new AnimationLoop(method);
  instanceExtras.animationLoop =  animationLoop;

  exerciseInstance.startAnimation = animationLoop.init.bind(animationLoop);

  const originalDispose = exerciseInstance.dispose.bind(exerciseInstance);
  exerciseInstance.dispose = async function() {
    instanceExtras.animationLoop!.stop();
    originalDispose();
  }
}