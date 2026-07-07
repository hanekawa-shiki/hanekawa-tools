import axios from 'axios';
import { toast } from 'sonner';

const request = axios.create({
  // baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

request.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const message = err.response?.data?.message ?? err.message ?? '请求失败';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default request;
