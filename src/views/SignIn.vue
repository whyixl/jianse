<template>
  <div class="login">
    <el-row style="margin-top: 120px;z-index: 1;">
      <el-col :offset="9" :span="6">
        <el-card class="login-box" v-loading="$store.state.loading" element-loading-background="rgba(0, 0, 0, 0.8)">
          <el-form :model="loginForm" :rules="loginRule" ref="login">
            <img :src="logo" class="hy_center" style="width: 200px">
            <el-form-item prop="name">
              <el-input type="text" v-model="loginForm.name" auto-complete="off" placeholder="请输入用户名..."
                        prefix-icon="el-icon-bell"></el-input>
            </el-form-item>
            <el-form-item prop="passwd">
              <el-input type="password" v-model="loginForm.passwd" auto-complete="off" placeholder="请输入密码..."
                        prefix-icon="el-icon-edit"></el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input style="position: absolute" v-model="loginForm.code" placeholder="验证码..."
                        prefix-icon="el-icon-mouse"
                        @keydown.enter.native="login"></el-input>
              <el-link :underline="false" style="float: right; margin-right: 8px" @click="createCode">
                <span style="border: dashed">&nbsp;{{checkCode}}&nbsp;</span>
              </el-link>
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
                <el-input v-model="userForm.phone" placeholder="请输入手机验证码" class="input-with-select"></el-input>
              </el-form-item>
              <el-form-item label="身份类型" prop="role">
                <el-radio v-model="userForm.role" :label="1">学生</el-radio>
                <el-radio v-model="userForm.role" :label="2">老师</el-radio>
              </el-form-item>
              <el-form-item label="验证码" prop="verifyCode" required>
                <el-input style="width: 50%" v-model="userForm.verifyCode" placeholder="请输入验证码"
                          class="input-with-select"></el-input>
                <el-button type="warning" style="float: right" @click="getVerify">获取验证码</el-button>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="resetForm('userForm')">取 消</el-button>
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
        data: function () {
            let validateCode = (rule, value, callback) => {
                if (!value) {
                    console.log(rule, value)
                    callback(new Error('请输入验证码'));
                } else if (value.toUpperCase() !== this.checkCode.toUpperCase()) {
                    callback(new Error('验证码错误!'));
                } else {
                    callback();
                }
            };
            let validatePass2 = (rule, value, callback) => {
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
                const phoneReg = /^1[3-9][0-9]{9}$/;
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
                checkCode: "",
                loginForm: {
                    name: null,
                    passwd: null,
                    code: null
                },
                dialogVisible: false,
                userForm: {
                    name: null,
                    passwd: null,
                    checkPass: null,
                    phone: null,
                    email: null,
                    role: null,
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
                    role: [
                        {required: true, message: '请输入密码', trigger: 'change'},
                    ],
                    passwd: [
                        {required: true, message: '请输入密码', trigger: 'change'},
                    ],
                    checkPass: [
                        {validator: validatePass2, trigger: 'blur'}
                    ]
                },
                loginRule: {
                    name: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                    passwd: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ],
                    code: [{validator: validateCode, trigger: 'change'}]
                },

            };
        },
        mounted() {
            this.createCode();
        },
        methods: {
            login() {
                this.$refs['login'].validate((valid) => {
                    if (valid) {

                        this.$http.post("/api/user/login", this.loginForm).then(res => {
                            if (res.data.data) {
                                this.$store.commit("setUserName", this.loginForm.name)
                                this.$store.commit("setToken", res.data.data.token);
                                this.$store.commit("setId", res.data.data.id);
                                this.$store.dispatch("reloadUserAuthority").then(() => {
                                    for (let menu of this.$store.state.menus) {
                                        if (menu.depth === 2) {
                                            setTimeout(() => {
                                                this.$router.push({path: menu.link});
                                                console.log(menu);
                                            },500)
                                            break;
                                        }
                                    }
                                })
                            }
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            submitForm() {
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        this.promise
                        this.$http.post("/api/user/register", this.userForm)
                            .then(res => {
                                if (res.data.msg === "注册成功") {
                                    this.resetForm('userForm');
                                }
                            })
                    } else {
                        return false;
                    }

                });
            },
            resetForm(name) {
                this.$refs[name].resetFields();
                this.dialogVisible = false;
            },
            getVerify() {
                this.$http.get("/api/sms/" + this.userForm.phone)
            },
            createCode() {
                let code = "";
                const codeLength = 4; //验证码的长度
                const random = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
                    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']; //随机数
                for (let i = 0; i < codeLength; i++) { //循环操作
                    let index = Math.floor(Math.random() * 36); //取得随机数的索引（0~35）
                    code += random[index]; //根据索引取得随机数加到code上
                }
                this.checkCode = code; //把code值赋给验证码
            }
        }
    };
</script>
