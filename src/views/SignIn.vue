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
              <el-button type="info" @click="dialogVisible = true"
                         style="width:45%;float: left">注册
              </el-button>
              <el-button type="primary" @click="login" :loading="$store.state.loading" class="pull-right"
                         style="width:45%;float: right">登录
              </el-button>
            </el-form-item>
          </el-form>

          <el-dialog title="注册" :visible.sync="dialogVisible" width="35%" style="z-index: 9999">
            <el-form :label-position="'right'" status-icon label-width="80px" ref="userForm" :rules="rules"
                     :model="userForm">
              <el-form-item label="用户名" prop="name">
                <el-input v-model="userForm.name" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="passwd">
                <el-input v-model="userForm.passwd" type="password" placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input v-model="userForm.checkPass" type="password" placeholder="再次确认密码"></el-input>
              </el-form-item>
              <el-form-item label="电子邮件" prop="email">
                <el-input v-model="userForm.email" placeholder="请输入电子邮件"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="userForm.phone" placeholder="请输入手机号码" class="input-with-select"></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="verifyCode" required>
                <el-input style="width: 50%" v-model="userForm.verifyCode" placeholder="请输入验证码"
                          class="input-with-select"></el-input>
                <el-button type="warning" style="float: right" @click="getVerify">获取验证码</el-button>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="resetForm">取 消</el-button>
              <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
          </el-dialog>

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
            let validatePass2 = (rule, value, callback) => {
                console.log(rule, value);
                if (!value) {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.userForm.passwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            // 手机号验证
            let checkPhone = (rule, value, callback) => {
                const phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/;
                if (!value) {
                    return callback(new Error('电话号码不能为空'))
                }
                setTimeout(() => {
                    if (!Number.isInteger(+value)) {
                        callback(new Error('请输入数字值'))
                    } else {
                        if (phoneReg.test(value)) {
                            callback()
                        } else {
                            callback(new Error('电话号码格式不正确'))
                        }
                    }
                }, 100)
            };
            return {
                logo: require("../assets/logo.png"),
                user: {
                    name: null,
                    passwd: null
                },
                dialogVisible: false,
                userForm: {
                    name: null,
                    passwd: null,
                    checkPass: null,
                    phone: null,
                    email: null,
                    verifyCode: null,
                },
                rules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, validator: checkPhone, trigger: 'change'}
                    ],
                    email: [
                        {type: 'email', required: true, message: '邮箱格式不正确', trigger: 'change'}
                    ],
                    passwd: [
                        {required: true, message: '请输入密码', trigger: 'change'},
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ]
                },

            };
        },
        methods: {
            login() {
                this.$http.post("/api/user/login", this.user).then(res => {
                    if (res.data.data) {
                        this.$store.commit("setToken", res.data.data.token);
                        this.$router.push({path: "/dashboard"});
                    }
                });
            },
            submitForm() {
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        this.$http.post("/api/user/register", this.userForm);
                        this.resetForm();
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm() {
                this.$refs['userForm'].resetFields();
                this.dialogVisible = false;
            },
            getVerify() {
                this.$http.get("/api/sms/"+this.userForm.phone)
            }
        }
    };
</script>
