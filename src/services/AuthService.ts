import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

class AuthService {
  /**
   * 执行用户登录验证
   * @param credentials 登录凭据
   * @returns 登录结果
   */
  public async login(credentials: LoginCredentials): Promise<LoginResult> {
    try {
      const { email, password } = credentials;

      // 1. 入参非空校验
      if (!email || !password) {
        return {
          success: false,
          error: '邮箱和密码不能为空'
        };
      }

      // 2. 根据邮箱查询用户（统一转小写，与模型匹配）
      const lowerEmail = email.toLowerCase().trim();
      const user: IUser | null = await User.findOne({ email: lowerEmail });

      // 用户不存在校验
      if (!user) {
        return {
          success: false,
          error: '邮箱或密码错误'
        };
      }

      // 3. 用户状态校验（是否启用）
      if (!user.isActive) {
        return {
          success: false,
          error: '账户已被停用，请联系管理员'
        };
      }

      // 4. bcrypt密码校验（明文 → 数据库密文）
      const isPasswordValid: boolean = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return {
          success: false,
          error: '邮箱或密码错误'
        };
      }

      // 5. 生成JWT令牌
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'fallback_secret_key',
        { expiresIn: '24h' }
      );

      // 6. 返回成功结果
      return {
        success: true,
        message: '登录成功',
        data: {
          token,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name
          }
        }
      };

    } catch (error: any) {
      console.error('AuthService.login error:', error);
      return {
        success: false,
        error: '服务器内部错误'
      };
    }
  }
}

export default new AuthService();