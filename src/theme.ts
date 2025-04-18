export const CSS_CLASSES = {
    background: `bg-neutral-50 dark:bg-neutral-800`,
    border: `border-neutral-50 dark:border-neutral-800`,
    text: `text-black dark:text-white`,
    hover: `hover:bg-neutral-300 dark:hover:bg-neutral-700 focus:outline-none focus:bg-neutral-300 dark:focus:bg-neutral-700`,
    scrollBar: `[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500`,
    selector_background: `bg-neutral-200 dark:bg-neutral-700`,
    exercise_index: `z-[1]`,
    main_layout_index: `z-[2]`,
    sidebar_index: `z-[4]`,
    overlay_index: `z-[3]`,

};

export const SELECTABLE_CLASSES = {
  container: `flex items-center ${CSS_CLASSES.background} px-3 py-2 rounded-md gap-2 w-full`,
  label: CSS_CLASSES.text,
  select: `${CSS_CLASSES.border} cursor-pointer rounded-md ${CSS_CLASSES.selector_background} ${CSS_CLASSES.text} px-2 py-1 ${CSS_CLASSES.hover} flex-grow`,
  option: CSS_CLASSES.text,
}

export const COLORS = {
  black: {
    50: `rgba(0, 0, 0, 0.5)`,
    60: `rgba(0, 0, 0, 0.6)`,
    90: `rgba(0, 0, 0, 0.9)`,
    100: `rgba(0, 0, 0, 1)`,
  },
  debugLabel: `#DC2626`,
};
