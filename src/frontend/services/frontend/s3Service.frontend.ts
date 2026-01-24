import { S3File } from '../../types';

// 使用 Supabase S3 兼容配置
const S3_ENDPOINT = import.meta.env.VITE_REACT_APP_S3_ENDPOINT || import.meta.env.VITE_S3_ENDPOINT || '';
const S3_REGION = import.meta.env.VITE_REACT_APP_S3_REGION || import.meta.env.VITE_S3_REGION || 'ap-south-1';
const S3_ACCESS_KEY = import.meta.env.VITE_REACT_APP_S3_ACCESS_KEY || import.meta.env.VITE_S3_ACCESS_KEY || '';
const S3_SECRET_KEY = import.meta.env.VITE_REACT_APP_S3_SECRET_KEY || import.meta.env.VITE_S3_SECRET_KEY || '';
const S3_BUCKET = import.meta.env.VITE_REACT_APP_S3_BUCKET || import.meta.env.VITE_S3_BUCKET || 'jx-cloud-dishes';

// 检查 Supabase S3 配置是否有效
const isSupabaseS3Configured = () => {
  return !!(S3_ENDPOINT && S3_ACCESS_KEY && S3_SECRET_KEY && S3_BUCKET);
};

export const s3Service = {
  /**
   * 列出存储桶中的所有文件
   */
  list: async (): Promise<S3File[]> => {
    if (!isSupabaseS3Configured()) {
      console.warn('Supabase S3 未配置，返回空文件列表');
      return [];
    }

    try {
      // 构造请求URL - 这里需要根据Supabase S3的具体API调整
      const url = `${S3_ENDPOINT.replace('/s3', '')}/object/list/${S3_BUCKET}`;
      
      const response = await fetch(url, {
        method: 'POST', // Supabase可能需要POST请求
        headers: {
          'Authorization': `Bearer ${S3_ACCESS_KEY}`, // 或者使用其他认证方式
          'apikey': S3_ACCESS_KEY, // Supabase通常使用apikey头部
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prefix: '',
          limit: 100,
          offset: 0
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !Array.isArray(data)) {
        return [];
      }

      return data.map((obj: any, index: number) => ({
        id: obj.name || obj.key || `${index}`,
        key: obj.name || obj.key || `${index}`,
        name: obj.name?.split('/').pop() || obj.key?.split('/').pop() || `file-${index}`,
        size: obj.size || 0,
        url: `${S3_ENDPOINT.replace('/s3', '')}/object/public/${S3_BUCKET}/${obj.name || obj.key}`,
        type: obj.contentType || obj.mimetype || 'application/octet-stream',
        lastModified: obj.lastModified ? new Date(obj.lastModified) : new Date(),
        uploadedAt: obj.createdAt ? new Date(obj.createdAt) : new Date(),
        thumbnailUrl: undefined,
        metadata: obj.metadata || {}
      }));
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  },

  /**
   * 上传文件到 Supabase Storage (通过 S3 兼容接口)
   */
  upload: async (file: File): Promise<S3File> => {
    if (!isSupabaseS3Configured()) {
      console.warn('Supabase S3 未配置，使用本地文件对象');
      return {
        id: `local-${Date.now()}`,
        key: `local-${Date.now()}`,
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
        type: file.type,
        uploadedAt: new Date(),
        lastModified: new Date(),
        thumbnailUrl: undefined,
        metadata: { mimetype: file.type, size: file.size }
      };
    }

    try {
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`;
      const url = `${S3_ENDPOINT.replace('/s3', '')}/object/${S3_BUCKET}/${fileName}`;

      // 创建FormData对象来发送文件
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${S3_ACCESS_KEY}`,
          'apikey': S3_ACCESS_KEY,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      return {
        id: fileName,
        key: fileName,
        name: file.name,
        size: file.size,
        url: `${S3_ENDPOINT.replace('/s3', '')}/object/public/${S3_BUCKET}/${fileName}`,
        type: file.type,
        uploadedAt: new Date(),
        lastModified: new Date(),
        thumbnailUrl: undefined,
        metadata: { mimetype: file.type, size: file.size }
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        id: `temp-${Date.now()}`,
        key: `temp-${Date.now()}`,
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
        type: file.type,
        uploadedAt: new Date(),
        lastModified: new Date(),
        thumbnailUrl: undefined,
        metadata: { mimetype: file.type, size: file.size }
      };
    }
  },

  /**
   * 从 Supabase Storage 删除文件 (通过 S3 兼容接口)
   */
  delete: async (key: string): Promise<boolean> => {
    if (!isSupabaseS3Configured()) {
      console.warn('Supabase S3 未配置，无法删除远程文件');
      return false;
    }

    try {
      const url = `${S3_ENDPOINT.replace('/s3', '')}/object/${S3_BUCKET}/${key}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${S3_ACCESS_KEY}`,
          'apikey': S3_ACCESS_KEY,
          'Content-Type': 'application/json',
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  },

  /**
   * 获取文件的公开 URL
   */
  getUrl: async (key: string): Promise<string> => {
    if (!isSupabaseS3Configured()) {
      console.warn('Supabase S3 未配置，无法获取远程文件URL');
      return '';
    }

    try {
      return `${S3_ENDPOINT.replace('/s3', '')}/object/public/${S3_BUCKET}/${key}`;
    } catch (error) {
      console.error('Get URL error:', error);
      return '';
    }
  }
};

export type { S3File };