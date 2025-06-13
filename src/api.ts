import axios from 'axios';

// 認証・トークン管理関数
export const loginAndSetToken = async (username: string, password: string): Promise<void> => {
  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      username,
      password,
    });
    const token = response.data.access_token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('ログイン成功');
  } catch (error) {
    console.error('ログイン失敗', error);
    throw error;
  }
};

// API呼び出し関数（例）
export const fetchPuzzles = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:3000/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('パズル取得失敗', error);
    throw error;
  }
};
