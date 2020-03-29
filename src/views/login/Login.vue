<template>
  <div class="login-container">
    <!--登录盒子-->
    <div class="login-box">
      <!--用户头像-->
      <div class="user-box">
        <img src="../../assets/logo.png" alt />
      </div>
      <!--表单区域-->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
      >
        <!--用户名-->
        <el-form-item prop="name">
          <el-input
            v-model="loginForm.name"
            prefix-icon="iconfont icon-touxiang"
          ></el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="pass">
          <el-input
            v-model="loginForm.pass"
            prefix-icon="iconfont icon-mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!--按钮区域-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login()">登录</el-button>
          <el-button type="info" @click="resetLoginForm()" refs="resetBtn"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getLoginData } from '../../network/login.js'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        name: '',
        pass: ''
      },
      loginFormRules: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: '强输入用户密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在3-15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      //console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      //console.log(this);
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await getLoginData(
          this.loginForm.name,
          this.loginForm.pass
        )
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        //将登录成功的token保存到客户端的 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        //登录成功储存token之后 跳转到后台主页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.login-container {
  background: #2b4b6b;
  height: 100%;
}

.login-box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.user-box {
  width: 120px;
  height: 120px;
  padding: 10px;
  border: 3px;
  border-radius: 50%;
  box-shadow: 0 0 10px #fff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
