<template>
    <div class="container">
      <div class="logo-container">
        <img src="../img/logo.jpg" alt="Logo" class="logo">
        <span class="logo-text">|&nbsp;&nbsp;&nbsp;&nbsp;登录到 Astral Player Network</span>
      </div>
      <fluent-card class="login-card" v-if="!registering">
        <h2>登录</h2>
        <fluent-text-field placeholder="用户名" class="input-field" id="log_username"></fluent-text-field>
        <fluent-text-field type="password" placeholder="密码" class="input-field" id="log_password"></fluent-text-field>
        <fluent-button appearance="accent" class="login-btn" @click="login">登录</fluent-button>
        <br/>
        <fluent-button appearance="neutral" @click="showRegisterForm">没有账号？注册 ></fluent-button>
      </fluent-card>
  
      <fluent-card class="register-card" v-if="registering">
        <h2>注册</h2>
        <fluent-text-field id="reg_username" placeholder="用户名" class="input-field"></fluent-text-field>
        <fluent-text-field id="reg_email" placeholder="邮箱" class="input-field"></fluent-text-field>
        <div class="hcaptcha-container">
            <vue-hcaptcha sitekey="f6c67106-c278-4504-bbff-3983f372928e" @verify="hcaptchaFinished"></vue-hcaptcha>
        </div>
        <div class="code-container">
          <fluent-text-field id="reg_email_verify" placeholder="邮箱验证码" class="code-input"></fluent-text-field>
          <fluent-button appearance="neutral" class="send-code-btn" @click="registerSendCode">{{ SendCodeText }}</fluent-button>
        </div>
        <fluent-text-field id="reg_password" type="password" placeholder="密码" class="input-field"></fluent-text-field>
        <fluent-button appearance="accent" @click="register">注册</fluent-button>
        <a href="#" class="back-to-login" @click="backToLogin">返回登录</a>
      </fluent-card>
    </div>
  </template>
  
  <script>
    import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
    import * as LoginJS from './login'
    export default {
        name: 'Login',
        data() {
            return {
              registering: false,
              hcaptcha_token: "not_verify",
              SendCodeText: "发送验证码",
              sent_code: false
            };
        },  
        components: {
            VueHcaptcha,
        },
        methods: {
            login() {
              var username = document.getElementById("log_username")
              var password = document.getElementById("log_password")
              LoginJS.Login(username.getAttribute("current-value"), password.getAttribute("current-value"))
            },
            showRegisterForm() {
            this.registering = true;
            },
            register() {
                var username = document.getElementById("reg_username")
                var email = document.getElementById("reg_email")
                var email_verify = document.getElementById("reg_email_verify")
                var password = document.getElementById("reg_password")
                LoginJS.Register(username.getAttribute("current-value"), email.getAttribute("current-value"), email_verify.getAttribute("current-value"), password.getAttribute("current-value"))
            },
            backToLogin() {
              this.registering = false;
            },
            hcaptchaFinished(token, ekey){
              console.log(token)
              this.hcaptcha_token = token
            },
            async registerSendCode() {
              if(!this.sent_code){
                var username = document.getElementById("reg_username")
                var email = document.getElementById("reg_email")
                if(this.hcaptcha_token == "not_verify"){
                  LoginJS.notyf.error("请先完成人机验证")
                }
                else{
                  this.sent_code = true
                  this.SendCodeText = "发送中..."
                  if(await LoginJS.RegisterSendCode(username.getAttribute("current-value"), email.getAttribute("current-value"), this.hcaptcha_token)){
                    this.SendCodeText = "验证码已发送"
                  }
                  else{
                    this.SendCodeText = "发送验证码"
                    this.sent_code = false
                  }
                }
              }
              else{
                LoginJS.notyf.error("请勿重复发送验证码")
              }
            }
        }
    }
    </script>
  
  <style>
  @import "../css/global.css";
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: white;
    font-family: 'MiSans';
  }
  
  .login-card,
  .register-card {
    padding: 20px;
    width: 350px;
    text-align: center;
    background-color: white;
    color: black;
  }
  
  .input-field {
    margin-bottom: 10px;
    width: 100%;
  }
  
  .login-btn {
    margin-bottom: 10px;
  }
  
  .code-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .code-input {
    flex-grow: 1;
    margin-right: 10px;
  }
  
  .send-code-btn {
    flex-shrink: 0;
  }
  
  .hcaptcha-container {
    margin-bottom: 10px;
    /* 根据需要调整 Hcaptcha 验证码的样式 */
  }
  
  .back-to-login {
    display: block;
    margin-top: 10px;
    color: #0078d4;
    text-decoration: none;
  }
  
  .back-to-login:hover {
    text-decoration: underline;
  }

  .logo-container {
    position: absolute; /* 使用绝对定位 */
    top: 0; /* 距离顶部 0 */
    left: 0; /* 距离左侧 0 */
    display: flex; /* 使用 Flexbox 布局 */
    align-items: center; /* 垂直居中对齐 */
    margin-left: 2%;
    margin-top: 2%;
    font-family: 'MiSans';
    font-weight: 600;
    font-size: 18px;
  }

  .logo {
    width: 50px; /* Logo 的宽度 */
    height: auto; /* 自动调整高度以保持比例 */
  }

  .logo-text {
    margin-left: 20px; /* 在 Logo 和文字之间添加一些间距 */
  }
  </style>
  