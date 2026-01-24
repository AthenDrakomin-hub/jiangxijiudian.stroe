// 这是一个样式映射器
export const getThemeClass = (config: any, element: 'Container' | 'Card' | 'Button' | 'Text') => {
  const themes: any = {
    glass: {
      Container: "bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-2xl rounded-3xl overflow-hidden",
      Card: "p-6 sm:p-8 flex flex-col h-full space-y-3 sm:space-y-4 relative z-10",
      Button: "px-4 py-2 sm:px-5 sm:py-2.5 bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/50 text-slate-800 dark:text-white rounded-2xl font-semibold transition-all text-sm sm:text-base",
      Text: "text-slate-800 dark:text-slate-200 font-medium text-sm sm:text-base"
    },
    clay: {
      Container: "bg-sky-100 dark:bg-sky-900/40 rounded-[3rem] shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff] dark:shadow-none",
      Card: "p-8 flex flex-col h-full space-y-4 shadow-[inset_10px_10px_20px_rgba(255,255,255,0.8),inset_-10px_-10px_20px_rgba(0,0,0,0.05)] rounded-[3rem]",
      Button: "px-6 py-3 bg-sky-200 dark:bg-sky-800 text-sky-800 dark:text-sky-100 rounded-[2rem] shadow-[8px_8px_16px_rgba(0,0,0,0.1)] font-bold transition-all",
      Text: "text-sky-700 dark:text-sky-200 font-bold opacity-80"
    },
    bento: {
      Container: "bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 min-h-screen p-2 md:p-4 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4",
      Card: "bg-white dark:bg-slate-800 rounded-xl shadow-md border border-indigo-100 dark:border-indigo-800 p-4 col-span-1 row-span-1",
      Button: "bg-indigo-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-indigo-700 transition-all duration-200 shadow-sm",
      Text: "text-indigo-900 dark:text-indigo-100"
    },
    brutal: {
      Container: "bg-yellow-400 dark:bg-yellow-500 min-h-screen p-4 md:p-8 border-8 border-black dark:border-gray-900",
      Card: "bg-white dark:bg-gray-100 border-4 border-black dark:border-gray-900 p-6 font-bold text-black dark:text-black transform hover:translate-x-2 hover:translate-y-2 transition-transform",
      Button: "bg-black dark:bg-gray-900 text-white border-4 border-black dark:border-gray-900 px-6 py-3 font-black hover:bg-gray-800 dark:hover:bg-gray-800 transition-all transform hover:translate-x-1 hover:translate-y-1",
      Text: "text-black dark:text-black font-bold"
    }
  };

  const currentTheme = config?.activeTheme || 'glass';
  return themes[currentTheme][element];
};