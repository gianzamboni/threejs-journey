import { DebugInfo, ExtraProperties, Settings } from "../types";

export namespace DecoratorsUtils {
  export function getSettings(constructor: any): Settings {
    if (constructor._decoratorSettings === undefined) {
      constructor._decoratorSettings = {};
    };
    return constructor._decoratorSettings;
  }

  export function getDebugInfo(constructor: any): DebugInfo {
    const settings = getSettings(constructor);
    if (!settings.debugInfo) {
      settings.debugInfo = {};
    }
    return settings.debugInfo;
  }

  export function getExtraProperties(exerciseInstance: any): ExtraProperties {
    if (exerciseInstance._extraProperties === undefined) {
      exerciseInstance._extraProperties = {};
    }
    return exerciseInstance._extraProperties;
  }
}




