/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios'

let isFormData = false
let isDownLoad = false

function initRequest() {
  isFormData = false
  isDownLoad = false
}

function initFormRequest() {
  isFormData = true
  isDownLoad = false
}

function initDownLoad() {
  isFormData = false
  isDownLoad = true
}
const axiosinstance = axios.create({
  withCredentials: true, // 表示跨域请求时是否需要使用凭证
  headers: {
    'Content-Type': 'application/json', // 向后端传递json格式数据
  },
})
axiosinstance.defaults.baseURL = 'http://127.0.0.1:3000'
// 请求超时时间  超过超时时间 请求将会被中断
axiosinstance.defaults.timeout = 100000
// 请求拦截器
axiosinstance.interceptors.request.use(
  (config) => {
    if (isFormData) {
      axiosinstance.defaults.headers.post['Content-Type'] =
        'multipart/form-data'
    }
    // else {
    //   axiosinstance.defaults.headers.post['Content-Type'] =
    //     'application/x-www-form-urlencoded;charset=UTF-8'
    // }

    if (isDownLoad) {
      config.responseType = 'blob' // 下载文件时将响应类型设置为blob类型，可用于下载图片、pdf等浏览器会自动打开的文件
    }

    return config
  },
  (error) => {
    return Promise.error(error)
  }
)

// 响应拦截器
axiosinstance.interceptors.response.use(
  (response) => {
    console.log('response', response)
    if (response.status === 200) {
      if (isDownLoad) {
        return Promise.resolve(response)
      }
      if (response.data.code > 199 && response.data.code < 301) {
        //code是后台返回的 是否为code请自行更改
        return Promise.resolve(response)
      } else if (response.data.code == 401) {
        return Promise.reject(response)
      } else {
        return Promise.reject(response)
      }
    } else if (response.status === 302) {
      return Promise.reject(response)
    }
  },
  // 服务器状态码不是200的情况
  (error) => {
    console.log('error', error)
    if (error.data && error.data.code) {
      switch (error.data.code) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          console.error('未登录')
          break
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          console.error('登录过期，请重新登录')
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          break
        // 404请求不存在
        case 404:
          console.error('网络请求不存在')
          break
        // 其他错误，直接抛出错误提示
        default:
        // console.error(error.data.message);
      }
      return Promise.reject(error.data)
    } else {
      return Promise.reject(error.response)
    }
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  initRequest()
  return new Promise((resolve, reject) => {
    axiosinstance
      .get(url, {
        params: params,
      })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  initRequest()
  return new Promise((resolve, reject) => {
    axiosinstance
      .post(url, params)
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export function formData(url, params) {
  initFormRequest()
  let formData = new FormData()
  for (let key in params) {
    formData.append(key, params[key])
  }
  return new Promise((resolve, reject) => {
    axiosinstance
      .post(url, formData)
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}

export function downLoad(url, params) {
  initDownLoad()
  return new Promise((resolve, reject) => {
    axiosinstance
      .get(url, {
        params: params,
      })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        reject(err.data)
      })
  })
}
