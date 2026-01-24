import mongoose from 'mongoose';

export interface IThemeSettings {
  container: string;
  card: string;
  button: string;
  text: string;
}

export interface ISystemConfig extends mongoose.Document {
  activeTheme: string;
  themeSettings: IThemeSettings;
  createdAt: Date;
  updatedAt: Date;
}

const SystemConfigSchema = new mongoose.Schema<ISystemConfig>(
  {
    activeTheme: {
      type: String,
      required: true,
      default: 'glass',
      enum: ['glass', 'clay', 'bento', 'brutal']
    },
    themeSettings: {
      container: {
        type: String,
        required: true,
        default: ''
      },
      card: {
        type: String,
        required: true,
        default: ''
      },
      button: {
        type: String,
        required: true,
        default: ''
      },
      text: {
        type: String,
        required: true,
        default: ''
      }
    }
  },
  {
    timestamps: true,
  }
);

const SystemConfig = mongoose.model<ISystemConfig>('SystemConfig', SystemConfigSchema);

export default SystemConfig;