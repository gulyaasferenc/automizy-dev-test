import axios from 'axios'
import { message } from 'antd'

const setupAxiosInterceptors = () => {
  const TIMEOUT = 1 * 60 * 1000;
  axios.defaults.timeout = TIMEOUT;
  axios.defaults.baseURL = 'http://localhost:3000/';
  axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    message.error({
      content: error.response.data.error,
      style: {
        marginTop: '5rem'
      }
    })
    return Promise.reject(error);
  })
  return axios
}

export default setupAxiosInterceptors
