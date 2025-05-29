import axios from "axios"
import * as SecureStore from "expo-secure-store"

const API_URL = "https://api.themageapp.com/server/"

const axiosInterceptorInstance = axios.create({
  baseURL: API_URL,
})

axiosInterceptorInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await SecureStore.getItemAsync("authToken")

    if (accessToken) {
      if (config.headers) config.headers.Authorization = `Bearer ${accessToken}`
      config.params.token = accessToken
    } else {
      SecureStore.deleteItemAsync("authToken")
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInterceptorInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default axiosInterceptorInstance
