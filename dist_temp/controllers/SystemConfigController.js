"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SystemConfig_1 = __importDefault(require("../models/SystemConfig"));
class SystemConfigController {
    constructor() {
        this.getConfig = async (req, res) => {
            try {
                // 查找系统配置，如果不存在则创建默认配置
                let config = await SystemConfig_1.default.findOne();
                if (!config) {
                    // 如果没有配置，则创建默认配置
                    config = new SystemConfig_1.default({
                        activeTheme: 'glass',
                        themeSettings: {
                            container: 'bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen p-4 md:p-8',
                            card: 'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6',
                            button: 'bg-slate-900 text-white rounded-xl px-6 py-3 font-bold hover:bg-slate-800 transition-all duration-300 shadow-md hover:shadow-lg',
                            text: 'text-slate-800'
                        }
                    });
                    await config.save();
                }
                res.json(config);
            }
            catch (error) {
                console.error('Error fetching system config:', error);
                res.status(500).json({ error: 'Failed to fetch system config' });
            }
        };
        this.updateConfig = async (req, res) => {
            try {
                const { activeTheme, themeSettings } = req.body;
                // 验证必填字段
                if (!activeTheme) {
                    res.status(400).json({ error: 'Active theme is required' });
                    return;
                }
                // 验证主题名称是否有效
                const validThemes = ['glass', 'clay', 'bento', 'brutal'];
                if (!validThemes.includes(activeTheme)) {
                    res.status(400).json({ error: 'Invalid theme name' });
                    return;
                }
                // 查找现有配置或创建新的
                let config = await SystemConfig_1.default.findOne();
                if (config) {
                    // 更新现有配置
                    config.activeTheme = activeTheme;
                    if (themeSettings) {
                        config.themeSettings = { ...config.themeSettings, ...themeSettings };
                    }
                    config = await config.save();
                }
                else {
                    // 创建新的配置
                    config = new SystemConfig_1.default({
                        activeTheme,
                        themeSettings: themeSettings || {
                            container: '',
                            card: '',
                            button: '',
                            text: ''
                        }
                    });
                    config = await config.save();
                }
                res.json(config);
            }
            catch (error) {
                console.error('Error updating system config:', error);
                res.status(500).json({ error: 'Failed to update system config' });
            }
        };
    }
}
exports.default = new SystemConfigController();
