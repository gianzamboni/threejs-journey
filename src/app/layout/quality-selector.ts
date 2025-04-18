import { DropDownMenu } from '../components/drop-down-menu';

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

  private qualityMenu: DropDownMenu;
  
  constructor(defaultQuality: Quality) {
    super();
    this.qualityMenu = new DropDownMenu('quality-selector', {
      label: 'Quality:',
      options: {
        'High': Quality.High,
        'Low': Quality.Low
      }
    });

    this.qualityMenu.setValue(defaultQuality.toString());
    
    this.qualityMenu.addEventListener('change', this.onQualityChange.bind(this) as EventListener);
  }

  addTo(parent: HTMLElement) {
    this.qualityMenu.addTo(parent);
  }

  onQualityChange(event: CustomEvent) {
    const quality = qualityFromString(event.detail.value);
    this.dispatchEvent(new CustomEvent('quality-changed', { detail: quality }));
  }
}