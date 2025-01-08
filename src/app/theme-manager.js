
const UI_THEME_SETTINGS = {
  dark: {
    "debug-control": {
      "background-color": "#00000080",
      "color": "#ffffff",
    },
    "lil-gui": {
      "--background-color": "#ffffff19",
      "--text-color": "#ffffff",
      "--title-background-color": "#ffffff19",
      "--title-text-color": "#ffffff",
      "--widget-color": "#ffffff19",
      "--hover-color": "#ffffff33",
      "--focus-color": "#ffffff33",
      "--number-color": "#ffffff",
      "--string-color": "#ffffff",
    },
  },
  light: {
    "debug-control": {
      "background-color": "#00000006",
      "color": "#000000",
    },
    "lil-gui": {
      "--background-color": "#00000006",
      "--text-color": "#000000",
      "--title-background-color": "#00000006",
      "--title-text-color": "#000000",
      "--widget-color": "#00000006",
      "--hover-color": "#0000000C",
      "--focus-color": "#0000000C",
      "--number-color": "#000000",
      "--string-color": "#000000",
    }
  }
};
export class ThemeManager {
  constructor() {
    this.activeTheme = "dark";
  }

  setTheme(theme = "dark") {
    if(theme !== this.activeTheme) {
      this.activeTheme = theme;
      console.log('Setting theme to', theme);

      this.setButtonTheme();
      this.setHelpBoxTheme();
      this.setDebugUITheme();
    }
  }

  setDebugUITheme() {
    const debugControl = document.getElementById('debug-ui-control-box');
    const lilGuiContainer = document.querySelector('.lil-gui');

    const themeSettings = UI_THEME_SETTINGS[this.activeTheme];
    Object.entries(themeSettings['debug-control']).forEach(([key, value]) => {
      debugControl.style.setProperty(key, value);
    });

    if(lilGuiContainer) {
      Object.entries(themeSettings['lil-gui']).forEach(([key, value]) => {
        lilGuiContainer.style.setProperty(key, value);
      });
    }
  }

  setButtonTheme() {
    const button = document.getElementById('demo-button');
    const addClass = `btn-${this.activeTheme === 'dark' ? 'light' : 'dark'}`;
    const removeClass = `btn-${this.activeTheme === 'dark' ? 'dark' : 'light'}`;
    button.classList.remove(removeClass);
    button.classList.add(addClass);
  }

  setHelpBoxTheme() {
    const items = document.getElementsByClassName('help-box-item');
    Array.from(items).forEach(element => {
      if(this.activeTheme === 'light') {
        element.classList.add('dark-item');
      } else {
        element.classList.remove('dark-item');
      }
    });
  }
}