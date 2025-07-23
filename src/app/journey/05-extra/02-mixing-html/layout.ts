import { CSS_CLASSES } from "#/theme";

class Point {
  private label: string;
  private text: string;

  public element: HTMLElement;

  constructor(label: string, text: string) {
    this.label = label;
    this.text = text;
    this.element = this.createElement();
  }

  private createElement() {
    const element = document.createElement('div');
    element.className = `absolute top-[50%] left-[50%] ${CSS_CLASSES.exercise_index}`;
    element.id = `point-${this.label}`;
    element.innerHTML = `
      <span
        id="point-${this.label}-label"
        class="absolute top-[-20px] left-[-20px] w-[40px] h-[40px] rounded-full bg-black/50 border-1 border-white/50 text-white flex items-center justify-center leading-[40px] font-thin"
      >${this.label}</span>
      <span id="point-${this.label}-text"
        class="absolute top-[30px] left-[-100px] w-[200px] p-[20px] border-1 rounded-[4px] bg-black/50 border-white/50 text-white leading-[1.3em] opacity-0 transition-all"
      >${this.text}</span>
    `;

    
    return element;
  }
}
export class MixingHtmlLayout {

  private points: Point[] = [];

  constructor() {
    this.points.push(new Point('1', 'Lorem ipsum, dolor sit amet consectetur adipisicing elit'));

    this.points.forEach(point => {
      document.body.appendChild(point.element);
    });
  }
}