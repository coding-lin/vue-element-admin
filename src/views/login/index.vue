<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1" />
      <div class="circle circle-2" />
      <div class="circle circle-3" />
    </div>

    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <div class="logo-wrapper">
          <svg-icon icon-class="user" class-name="logo-icon" />
        </div>
        <h3 class="title">后台管理系统</h3>
        <p class="subtitle">欢迎回来，请登录您的账号</p>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="账号"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="大写锁定已开启" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" class="login-btn" type="primary" @click.native.prevent="handleLogin">
        <span v-if="!loading">登 录</span>
        <span v-else>登录中...</span>
      </el-button>

      <div class="footer-tips">
        <div class="tips">
          <span>账号：admin</span>
          <span>密码：任意</span>
        </div>
        <div class="tips">
          <span style="margin-right:18px;">账号：editor</span>
          <span>密码：任意</span>
        </div>
      </div>
    </el-form>

    <el-dialog title="第三方登录" :visible.sync="showDialog">
      本地无法模拟，请结合实际业务自行实现！！！
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
$bg: transparent;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
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
        box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.08) inset !important;
        -webkit-text-fill-color: $cursor !important;
      }

      &::placeholder {
        color: rgba(255, 255, 255, 0.45);
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.07);
    border-radius: 10px;
    color: #454545;
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.1);
    }

    &.is-error {
      border-color: #f56c6c;
    }
  }
}
</style>

<style lang="scss" scoped>
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  // 背景装饰圆
  .bg-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    .circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.1;
    }

    .circle-1 {
      width: 500px;
      height: 500px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      top: -150px;
      right: -100px;
      animation: float 8s ease-in-out infinite;
    }

    .circle-2 {
      width: 350px;
      height: 350px;
      background: linear-gradient(135deg, #f093fb, #f5576c);
      bottom: -100px;
      left: -80px;
      animation: float 10s ease-in-out infinite reverse;
    }

    .circle-3 {
      width: 250px;
      height: 250px;
      background: linear-gradient(135deg, #4facfe, #00f2fe);
      top: 50%;
      left: 60%;
      animation: float 12s ease-in-out infinite 2s;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-30px) rotate(5deg);
    }
  }

  .login-form {
    position: relative;
    width: 440px;
    max-width: 90%;
    padding: 50px 40px 40px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    z-index: 1;
    animation: slideUp 0.6s ease-out;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .footer-tips {
    position: relative;
    margin-top: 20px;
  }

  .tips {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.55);
    margin-bottom: 8px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: rgba(255, 255, 255, 0.5);
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    text-align: center;
    margin-bottom: 35px;

    .logo-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      margin-bottom: 18px;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);

      .logo-icon {
        font-size: 30px;
        color: #fff;
      }
    }

    .title {
      font-size: 24px;
      color: #fff;
      margin: 0 auto 8px;
      font-weight: 600;
      letter-spacing: 2px;
    }

    .subtitle {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.45);
      margin: 0;
    }
  }

  .login-btn {
    width: 100%;
    height: 48px;
    margin-bottom: 10px;
    margin-top: 8px;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 6px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    transition: all 0.3s ease;

    &:hover,
    &:focus {
      background: linear-gradient(135deg, #764ba2, #667eea);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    user-select: none;
    transition: color 0.2s;

    &:hover {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  @media only screen and (max-width: 470px) {
    .login-form {
      padding: 40px 25px 30px;
    }
  }
}
</style>
