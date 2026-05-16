import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Queue to hold requests while refreshing token
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add access token to header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Advanced Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if it's an auth error (401) and not already a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we are already refreshing, push this request to the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        // We use the same 'api' instance but without interceptors for the refresh call
        // or just use axios directly if baseURL is handled. 
        // Best is to call the specific endpoint.
        axios.post('/api/auth/refresh-token', {}, { withCredentials: true })
          .then(({ data }) => {
            const { accessToken } = data;
            localStorage.setItem('accessToken', accessToken);
            
            // Update default header for future requests
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            // Resolve the queue
            processQueue(null, accessToken);
            
            // Retry the original request
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            // Refresh failed -> clear session and redirect
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user'); // Also clear user info
            window.location.href = '/login';
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
