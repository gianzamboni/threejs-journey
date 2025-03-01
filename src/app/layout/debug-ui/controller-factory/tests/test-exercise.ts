import BaseExercise from "#/app/journey/exercises/base-exercise";

export class TestExercise extends BaseExercise {

  private cube: {
    position: {
      y: number;
    },
    visible: boolean;
  };

  constructor() {
    super();
    this.cube = {
      position: {
        y: 0,
      },
      visible: true,
    };
  }

  getCube() {
    return this.cube;
  }

}