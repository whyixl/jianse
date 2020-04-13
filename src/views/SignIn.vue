<template>
  <div class="login">
    <el-row style="margin-top: 120px;z-index: 1;">
      <el-col :model="user" :offset="9" :span="6">
        <el-card class="login-box" v-loading="$store.state.loading" element-loading-background="rgba(0, 0, 0, 0.8)">
          <el-form>
            <img :src="logo" class="hy_center" style="width: 200px">
            <el-form-item>
              <el-input type="text" v-model="user.name" auto-complete="off" placeholder="请输入用户名..."
                        suffix-icon="el-icon-bell"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input type="password" v-model="user.passwd" auto-complete="off" placeholder="请输入密码..."
                        suffix-icon="el-icon-edit"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="login" :loading="$store.state.loading" class="pull-right"
                         style="width:45%;float: left">注册
              </el-button>
              <el-button type="primary" @click="login" :loading="$store.state.loading" class="pull-right"
                         style="width:45%;float: right">登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style>
  .login {
    background: url(../assets/bg.png) no-repeat scroll center center / cover;
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    position: fixed;
  }

  .login-box {
    background: #ffffff;
    border: none;
  }

</style>
<script>
    export default {
        name: "Login",
        data() {
            return {
                logo: require("../assets/logo.png"),
                user: {
                    name: "",
                    passwd: ""
                }
            };
        },
        methods: {
            login() {
                this.$http.post("/api/user/login", this.user).then(res => {
                    if (res.data.data) {
                        this.$store.commit("setToken", res.data.data);
                        this.$router.push({path: "/topic"});
                    }
                });
            }
        }
    };
</script>
