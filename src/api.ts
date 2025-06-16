import axios from 'axios';
axios.defaults.withCredentials = true;
export const login = async (username: string, password: string): Promise<void> => {
  try {
    await axios.post('https://backend-frgnd8hpb3cma4b0.japanwest-01.azurewebsites.net/auth/login', {
      username,
      password,
    }, {
  withCredentials: true,
});
    console.log('ログイン成功（Cookieがセットされました）');
  } catch (error) {
    console.error('ログイン失敗', error);
    throw error;
  }
};

export const fetchPuzzles = async () => {
  try {
    const res = await axios.get('https://backend-frgnd8hpb3cma4b0.japanwest-01.azurewebsites.net/', {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('パズル取得失敗', error);
    throw error;
  }
};
