import axios from 'axios';

async function testLogin() {
  try {
    console.log('🧪 开始测试登录接口...');
    
    const response = await axios.post('http://localhost:4000/api/auth/login', {
      email: 'admin@jx.com',
      password: '123456'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ 登录请求成功!');
    console.log('📋 响应数据:', response.data);
  } catch (error: any) {
    console.log('❌ 登录请求失败!');
    if (error.response) {
      console.log('📋 响应状态:', error.response.status);
      console.log('📋 响应数据:', error.response.data);
    } else if (error.request) {
      console.log('📋 请求错误:', error.request);
    } else {
      console.log('📋 其他错误:', error.message);
    }
  }
}

testLogin();