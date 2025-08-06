// import { Mutex } from "async-mutex";
// import axiosClient from "axios";

// const instance = axiosClient.create({
//   withCredentials: true,
// });

// const mutex = new Mutex();
// const NO_RETRY_HEADER = "x-no-retry";

// const handleRefreshToken = async () => {
//   return await mutex.runExclusive(async () => {
//     try {
//       const res = await axiosClient.get(
//         "http://localhost:8080/api/auth/refresh",
//         {
//           withCredentials: true,
//         }
//       );
//       if (res && res.data && res.data.data && res.data.data.access_token) {
//         return res.data.data.access_token;
//       }
//     } catch (error) {
//       localStorage.removeItem("access_token");
//       window.location.href = "/login";
//     }
//     return null;
//   });
// };

// instance.interceptors.request.use(function (config) {
//   const token = localStorage.getItem("access_token");

//   if (token) {
//     config.headers.Authorization = "Bearer " + token;
//   }

//   if (!config.headers.Accept && config.headers["Content-Type"]) {
//     config.headers.Accept = "application/json";
//     config.headers["Content-Type"] = "application/json; charset=utf-8";
//   }

//   return config;
// });

// instance.interceptors.response.use(
//   (res) => res.data,
//   async (error) => {
//     if (
//       error.config &&
//       error.response &&
//       error.response.status === 401 &&
//       error.config.url !== "/api/auth/login" &&
//       !error.config.headers[NO_RETRY_HEADER]
//     ) {
//       const access_token = await handleRefreshToken();
//       error.config.headers[NO_RETRY_HEADER] = "true";

//       if (access_token) {
//         error.config.headers["Authorization"] = `Bearer ${access_token}`;
//         localStorage.setItem("access_token", access_token);
//         return instance.request(error.config);
//       }
//     }
//     return error?.response?.data || Promise.reject(error);
//   }
// );

// export default instance;


import { Mutex } from "async-mutex";
import axiosClient from "axios";

const instance = axiosClient.create({
  withCredentials: true,
});

const mutex = new Mutex();
const NO_RETRY_HEADER = "x-no-retry";

const handleRefreshToken = async () => {
  return await mutex.runExclusive(async () => {
    try {
      const res = await axiosClient.get(
        "http://localhost:8080/api/auth/refresh",
        {
          withCredentials: true,
        }
      );
      if (res && res.data && res.data.data && res.data.data.access_token) {
        return res.data.data.access_token;
      }
    } catch (error) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return null;
  });
};

instance.interceptors.request.use(function (config) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }

  if (!config.headers.Accept && config.headers["Content-Type"]) {
    config.headers.Accept = "application/json";
    config.headers["Content-Type"] = "application/json; charset=utf-8";
  }

  return config;
});

instance.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    if (
      error.config &&
      error.response &&
      error.response.status === 401 &&
      error.config.url !== "/api/auth/login" &&
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      const access_token = await handleRefreshToken();
      error.config.headers[NO_RETRY_HEADER] = "true";

      if (access_token) {
        error.config.headers["Authorization"] = `Bearer ${access_token}`;
        localStorage.setItem("access_token", access_token);
        return instance.request(error.config);
      }
    }
    return error?.response?.data || Promise.reject(error);
  }
);

export default instance;