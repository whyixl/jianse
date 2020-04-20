<template>
  <el-card shadow="never" :body-style="{ padding: '20px 20px 20px 20px' }">
    <el-tabs>
      <el-tab-pane label="基本设置">
        <el-form ref="userForm" :model="userForm" :rules="rules" label-width="80px">
          <el-form-item prop="name" label="用户名" class="label">
            <el-input v-model="userForm.name"></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="手机号码" class="label">
            <el-input v-model="userForm.phone" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="电子邮件" class="label">
            <el-input v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateBasic">更新</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改密码">
        <el-form ref="passForm" :model="passForm" :rules="passRules" label-width="80px">
          <el-form-item prop="oldPass" label="原密码" class="label">
            <el-input v-model="passForm.oldPass" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="passwd" label="新密码" class="label">
            <el-input v-model="passForm.passwd" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="checkPass" label="确认密码" class="label">
            <el-input v-model="passForm.checkPass" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updatePass">更新</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
    export default {
        name: "Profile",
        data() {
            let validatePass2 = (rule, value, callback) => {
                if (value !== this.passForm.passwd) {
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
                test: true,
                userForm: {
                    name: null,
                    phone: null,
                    email: null,
                },
                passForm: {
                    oldPass: null,
                    passwd: null,
                    checkPass: null,
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
                    ]
                },
                passRules: {
                    oldPass: [
                        {required: true, message: '请输入密码', trigger: 'change'},
                    ],
                    passwd: [
                        {required: true, message: '请输入密码', trigger: 'change'},
                    ],
                    checkPass: [
                        {required: true, validator: validatePass2, trigger: 'blur'}
                    ]
                }
            };
        },
        mounted() {
            this.getUserInfo();
        },
        methods: {
            updateBasic() {
                this.$http.put("/api/user/update", {
                    id: this.userForm.id,
                    name: this.userForm.name,
                    email: this.userForm.email,
                    phone: this.userForm.phone,
                })
            },
            updatePass() {
                this.$http.put("/api/user/updatePass", this.passForm)
            },
            getUserInfo() {
                this.$http.get("/api/user").then(res => {
                    this.userForm = res.data.data;
                })
            }
        },
    };
</script>
