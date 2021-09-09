import { post, get, formData } from '../http'

export const loginApi = {
  login: (parmas) => post('/api/login', parmas),
  testGet: (params) => get('/api/queryDir', params),
}
