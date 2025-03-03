import { CSS_CLASSES } from '#/theme';

export enum Quality {
  Low = 'low',
  High = 'high'
}

export function qualityFromString(quality: string | null) {
  switch (quality) {
    case 'high':
      return Quality.High;
    case 'low':
    default:
      return Quality.Low;
  }
} 
export class QualitySelector extends EventTarget {

  private qualitySelector: HTMLDivElement;
  private selectedQuality: Quality = Quality.High;

  constructor(parent: HTMLElement, defaultQuality: Quality) {
    super();
    this.selectedQuality = defaultQuality;
    this.qualitySelector = document.createElement('div');
    this.qualitySelector.className = `flex justify-center items-center ${CSS_CLASSES.background} px-3 py-2 rounded-md gap-2`;

    const label = document.createElement('label');
    label.textContent = 'Quality:';
    label.className = CSS_CLASSES.text;
    this.qualitySelector.appendChild(label);

    const select = document.createElement('select');
    select.className = `${CSS_CLASSES.border} cursor-pointer rounded-md ${CSS_CLASSES.selector_background} ${CSS_CLASSES.text} px-2 py-1 ${CSS_CLASSES.hover}`;
    select.addEventListener('change', this.onQualityChange.bind(this));
    this.qualitySelector.appendChild(select);

    const options =[ Quality.High, Quality.Low ];
    for(const option of options) {
      const optionElement = document.createElement('option');
      optionElement.value = option.toString();
      optionElement.textContent = option.toString();
      optionElement.className = CSS_CLASSES.text;
      if (option === this.selectedQuality) {
        optionElement.selected = true;
      }
      select.appendChild(optionElement);
    }

    parent.appendChild(this.qualitySelector);
  }

  onQualityChange(event: Event) {
    this.dispatchEvent(new CustomEvent('quality-changed', { detail: (event.target as HTMLSelectElement).value }));
  }

}