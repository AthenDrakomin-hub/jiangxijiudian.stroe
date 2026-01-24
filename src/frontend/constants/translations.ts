export type Language = 'zh' | 'en';

export const LANGUAGES = {
  ZH: 'zh' as const,
  EN: 'en' as const,
};

export enum LanguageEnum {
  ZH = 'zh',
  EN = 'en'
}

// Define the translation dictionary
const translationsDict: Record<string, Record<Language, string>> = {
  // 示例翻译对象，实际项目中可以根据需要扩展
  category: {
    zh: '分类',
    en: 'Category'
  },
  name: {
    zh: '名称',
    en: 'Name'
  },
  description: {
    zh: '描述',
    en: 'Description'
  },
  save: {
    zh: '保存',
    en: 'Save'
  },
  cancel: {
    zh: '取消',
    en: 'Cancel'
  },
  delete: {
    zh: '删除',
    en: 'Delete'
  },
  edit: {
    zh: '编辑',
    en: 'Edit'
  },
  add: {
    zh: '添加',
    en: 'Add'
  },
  yes: {
    zh: '是',
    en: 'Yes'
  },
  no: {
    zh: '否',
    en: 'No'
  },
  confirm: {
    zh: '确认',
    en: 'Confirm'
  },
  warning: {
    zh: '警告',
    en: 'Warning'
  },
  error: {
    zh: '错误',
    en: 'Error'
  },
  success: {
    zh: '成功',
    en: 'Success'
  },
  loading: {
    zh: '加载中',
    en: 'Loading'
  },
  no_data: {
    zh: '暂无数据',
    en: 'No Data'
  },
  search: {
    zh: '搜索',
    en: 'Search'
  },
  filter: {
    zh: '筛选',
    en: 'Filter'
  },
  reset: {
    zh: '重置',
    en: 'Reset'
  },
  actions: {
    zh: '操作',
    en: 'Actions'
  },
  status: {
    zh: '状态',
    en: 'Status'
  },
  created_at: {
    zh: '创建时间',
    en: 'Created At'
  },
  updated_at: {
    zh: '更新时间',
    en: 'Updated At'
  },
  kds: {
    zh: '厨房显示',
    en: 'Kitchen Display'
  }
};

export function getTranslation(lang: Language | string | undefined, key: string, params?: any): string {
  const safeLang: Language = (lang === 'zh' || lang === 'en') ? lang : 'zh';
  const langTranslations = translationsDict[key];
  return langTranslations?.[safeLang] || key;
}

// Also export the translations object if needed elsewhere
export { translationsDict as translations };