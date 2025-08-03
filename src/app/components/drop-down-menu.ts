import { SELECTABLE_CLASSES } from "#/theme";

type DropDownMenuConfig = {
    label: string;
    options: Record<string, string>;
    classes?: string;
}

export class DropDownMenu extends EventTarget {
    private menu: HTMLDivElement;
    private selectElement: HTMLSelectElement;
    constructor(id: string, config: DropDownMenuConfig) {
        super();
        const { label, options, classes } = config;
        this.menu = document.createElement('div');
        this.menu.id = id;
        this.menu.className = `${SELECTABLE_CLASSES.container} ${classes}`;

        const labelElement = document.createElement('label');
        labelElement.textContent = label;
        labelElement.className = SELECTABLE_CLASSES.label;
        this.menu.appendChild(labelElement);

        this.selectElement = document.createElement('select');
        this.selectElement.id = `${id}-select`;
        this.selectElement.className = SELECTABLE_CLASSES.select;
        this.menu.appendChild(this.selectElement);

        Object.entries(options).forEach(([key, value]) => {
            const optionElement = document.createElement('option');
            optionElement.value = value;
            optionElement.textContent = key;
            optionElement.className = SELECTABLE_CLASSES.option;
            this.selectElement.appendChild(optionElement);
        });

        this.selectElement.addEventListener('change', this.onChange.bind(this));
    }

    onChange(event: Event) {
        this.dispatchEvent(new CustomEvent('change', { detail: { value: (event.target as HTMLSelectElement).value } }));
    }

    addTo(parent: HTMLElement) {
        parent.appendChild(this.menu);
    }

    remove() {
        this.selectElement.removeEventListener('change', this.onChange.bind(this));
        this.menu.remove(); 
    }

    setValue(value: string) {
        this.selectElement.value = value;
    }

    getValue() {
        const selectElement = this.menu.querySelector(`#${this.menu.id}-select`) as HTMLSelectElement;
        return selectElement.value;
    }

    hide() {
        this.menu.style.display = 'none';
    }

    show() {
        this.menu.style.display = 'flex';
    }
    
}
