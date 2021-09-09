<template>
  <div class="login">
    <div class="login-container">
      <div class="title-container">
        <h3 class="title">请登录</h3>
      </div>
      <el-form
        :model="loginForm"
        status-icon
        :rules="loginRules"
        ref="loginForm"
      >
        <el-form-item prop="username">
          <span class="svg-container">
            <i class="el-icon-s-custom"></i>
          </span>
          <el-input
            type="text"
            v-model="loginForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <i class="el-icon-lock"></i>
          </span>
          <el-input
            type="passwordword"
            v-model="loginForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-button
          :loading="loading"
          style="
            width: 100%;
            margin-bottom: 30px;
            background-color: #ffd639;
            color: #fff;
          "
          @click.native.prevent="handleLogin"
          >Login
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginApi } from '@/services/api/login'
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if ((value && value.length < 6) || !value) {
        callback(new Error('密码不能小于六位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入用户名' },
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword },
        ],
      },
      loading: false,
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', {
              username: {
                name: [1, 23],
                age: 12,
              },
              password: 1234,
            })
            .then(() => {
              // this.$router.push('/')
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
          loginApi
            .testGet({ name: 'muhuck', age: 18 })
            .then((res) => {
              console.log('resget', res)
            })
            .catch((err) => {
              console.log('err', err)
            })
        }
      })
    },
  },
}
</script>
<style lang="scss">
/* 修复input 背景不协调 和光标变色 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

// @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
//   .login-container .el-input input {
//     color: $cursor;
//   }
// }

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>
<style lang="scss" scoped>
$dark_gray: #889aa4;
$light_gray: #eee;
.login {
  display: flex;
  height: 100%;
  background-color: #313b2f;
  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .login-container {
    margin: auto;
    width: 450px;
    height: 300px;
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      font {
        size: 30px;
      }
    }
  }
}
</style>
