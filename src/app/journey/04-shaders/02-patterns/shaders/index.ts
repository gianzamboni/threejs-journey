import solidColorFragmentShader from "./fragments/00-solid-color.frag";
import coolUvFragmentShader from "./fragments/01-cool-uv.frag";
import warmUvFragmentShader from "./fragments/02-warm-uv.frag";
import gradientFragmentShader from "./fragments/03-gradient.frag";
import gradientUpFragmentShader from "./fragments/04-gradient-up.frag";
import gradientDownFragmentShader from "./fragments/05-gradient-down.frag";
import gradientUpFastFragmentShader from "./fragments/06-gradient-up-fast.frag";
import gradientUpRepeatFragmentShader from "./fragments/07-gradient-up-repeat.frag";
import barsFragmentShader from "./fragments/08-bars.frag";
import barsThinFragmentShader from "./fragments/09-bars-thin.frag";
import barsThinVerticalFragmentShader from "./fragments/10-bars-thin-vertical.frag";
import gridFragmentShader from "./fragments/11-grid.frag";
import gridDotFragmentShader from "./fragments/12-grid-dot.frag";
import gridBarFragmentShader from "./fragments/13-grid-bar.frag";
import gridWedgeFragmentShader from "./fragments/14-grid-wedge.frag";
import gridCrossFragmentShader from "./fragments/15-grid-cross.frag";
import gradientCenteredFragmentShader from "./fragments/16-gradient-centered.frag";
import gradientCrossFragmentShader from "./fragments/17-gradient-cross.frag";
import gradientDotFragmentShader from "./fragments/18-gradient-dot.frag";
import frameFragmentShader from "./fragments/19-frame.frag";
import frameSmallFragmentShader from "./fragments/20-frame-small.frag";
import gradientDiscreteFragmentShader from "./fragments/21-gradient-discrete.frag";
import gradientGridFragmentShader from "./fragments/22-gradient-grid.frag";
import noiseFragmentShader from "./fragments/23-noise.frag";
import noiseBigFragmentShader from "./fragments/24-noise-big.frag";
import lengthFragmentShader from "./fragments/26-length.frag";
import distanceFragmentShader from "./fragments/27-distance.frag";
import distanceInvertedFragmentShader from "./fragments/28-distance-inverted.frag";
import glareFragmentShader from "./fragments/29-glare.frag";
import glareStretchedFragmentShader from "./fragments/30-glare-stretched.frag";
import glareStarFragmentShader from "./fragments/31-glare-star.frag";
import glareRotationFragmentShader from "./fragments/32-glare-rotation.frag";
import circleFragmentShader from "./fragments/33-circle.frag";
import ringFragmentShader from "./fragments/34-ring.frag";
import ringDiscreteFragmentShader from "./fragments/35-ring-discrete.frag";
import ringDiscreteInvertedFragmentShader from "./fragments/36-ring-discrete-inverted.frag";
import ringInvertedWaveFragmentShader from "./fragments/37-ring-inverted-wave.frag";
import spotFragmentShader from "./fragments/38-spot.frag";
import spotFracFragmentShader from "./fragments/39-spot-frac.frag";
import angleFragmentShader from "./fragments/40-angle.frag";
import angleDisplacedFragmentShader from "./fragments/41-angle-displaced.frag";
import angleNormalizedFragmentShader from "./fragments/42-angle-normalized.frag";
import raysFragmentShader from "./fragments/43-rays.frag";
import raysSinFragmentShader from "./fragments/44-rays-sin.frag";
import ringWavyFragmentShader from "./fragments/45-ring-wavy.frag";
import perlinNoiseFragmentShader from "./fragments/46-perlin-noise.frag";
import perlinNoiseDiscreteFragmentShader from "./fragments/47-perlin-noise-discrete.frag";
import perlinNoiseBordersFragmentShader from "./fragments/48-perlin-noise-borders.frag";
import perlinNoiseLevelsFragmentShader from "./fragments/49-perlin-noise-levels.frag";
import perlinNoiseLevelDiscreteFragmentShader from "./fragments/50-perlin-noise-level-discrete.frag";

export const SHADER_DICTIONARY = {
  "Solid Color": solidColorFragmentShader,
  "Cool UV": coolUvFragmentShader,
  "Warm UV": warmUvFragmentShader,
  "Gradient": gradientFragmentShader,
  "Gradient Up": gradientUpFragmentShader,
  "Gradient Down": gradientDownFragmentShader,
  "Gradient Up Fast": gradientUpFastFragmentShader,
  "Gradient Up Repeat": gradientUpRepeatFragmentShader,
  "Bars": barsFragmentShader,
  "Bars Thin": barsThinFragmentShader,
  "Bars Thin Vertical": barsThinVerticalFragmentShader,
  "Grid": gridFragmentShader,
  "Grid Dot": gridDotFragmentShader,
  "Grid Bar": gridBarFragmentShader,
  "Grid Wedge": gridWedgeFragmentShader,
  "Grid Cross": gridCrossFragmentShader,
  "Gradient Centered": gradientCenteredFragmentShader,
  "Gradient Cross": gradientCrossFragmentShader,
  "Gradient Dot": gradientDotFragmentShader,
  "Frame": frameFragmentShader,
  "Frame Small": frameSmallFragmentShader,
  "Gradient Discrete": gradientDiscreteFragmentShader,
  "Gradient Grid": gradientGridFragmentShader,
  "Noise": noiseFragmentShader,
  "Noise Big": noiseBigFragmentShader,
  "Length": lengthFragmentShader,
  "Distance": distanceFragmentShader,
  "Distance Inverted": distanceInvertedFragmentShader,
  "Glare": glareFragmentShader,
  "Glare Stretched": glareStretchedFragmentShader,
  "Glare Star": glareStarFragmentShader,
  "Glare Rotation": glareRotationFragmentShader,
  "Circle": circleFragmentShader,
  "Ring": ringFragmentShader,
  "Ring Discrete": ringDiscreteFragmentShader,
  "Ring Discrete Inverted": ringDiscreteInvertedFragmentShader,
  "Ring Inverted Wave": ringInvertedWaveFragmentShader,
  "Spot": spotFragmentShader,
  "Spot Frac": spotFracFragmentShader,
  "Angle": angleFragmentShader,
  "Angle Displaced": angleDisplacedFragmentShader,
  "Angle Normalized": angleNormalizedFragmentShader,
  "Rays": raysFragmentShader,
  "Rays Sin": raysSinFragmentShader,
  "Ring Wavy": ringWavyFragmentShader,
  "Perlin Noise": perlinNoiseFragmentShader,
  "Perlin Noise Discrete": perlinNoiseDiscreteFragmentShader,
  "Perlin Noise Borders": perlinNoiseBordersFragmentShader,
  "Perlin Noise Levels": perlinNoiseLevelsFragmentShader,
  "Perlin Noise Level Discrete": perlinNoiseLevelDiscreteFragmentShader,
}

export const SHADER_LIST = Object.keys(SHADER_DICTIONARY).reduce((acc: Record<string, string>, key: string) => {
  acc[key] = key;
  return acc;
}, {});