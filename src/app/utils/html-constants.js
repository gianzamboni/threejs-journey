export const CLASS_TOKENS = {
  bg: "bg-neutral-50 dark:bg-neutral-800 border-neutral-50 dark:border-neutral-800",
  hover: "hover:bg-neutral-300 dark:hover:bg-neutral-700 focus:outline-none focus:bg-neutral-300 dark:focus:bg-neutral-700",
  text: "dark:text-white"
}

export const MENU_BUTTON_CLASSES = `flex py-2 px-3 m-5 items-center gap-x-2 border  font-medium  rounded-md shadow-sm dark:text-white ${CLASS_TOKENS.bg} ${CLASS_TOKENS.hover}`;

export const CHAPTER_BUTTON_CLASSES = `hs-accordion-toggle w-full text-start flex items-center gap-x-3 py-2 px-2.5 font-medium rounded-lg ${CLASS_TOKENS.hover}`

export const SIDE_BAR_CLASSES = `hs-overlay w-64 hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform h-full hidden fixed top-0 start-0 bottom-0 z-[60] border-e ${CLASS_TOKENS.bg} ${CLASS_TOKENS.text}`;

export const SCROLLBAR_CLASSES = `[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500`;

export const HAMBURGER_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/></svg>`;

export const CLOSE_ICON = `<svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

export const YELLOW_STAR_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill text-yellow-500" viewBox="0 0 16 16"><path d="M8 12.5l-3.5 2.5 1-4.1-3.4-2.9 4.2-.4L8 3.4l1.7 4.2 4.2.4-3.4 2.9 1 4.1L8 12.5z"/></svg>`;

export const UP_ARROW_ICON = `<svg class="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`;

export const DOWN_ARROW_ICON = `<svg class="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;