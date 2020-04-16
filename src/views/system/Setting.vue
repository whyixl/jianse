<template>
  <el-card shadow="never" :body-style="{ padding: '20px 20px 20px 20px' }">
    <el-switch
        v-model="register"
        active-text="允许学生注册"
        inactive-text="禁止学生注册"
        active-color="#13ce66"
        inactive-color="#ff4949"
        :active-value="1"
        :inactive-value="0"
        @change="open">
    </el-switch>
  </el-card>
</template>
<script>
    export default {
        name: "role",
        data() {
            return {
                register: "1"
            };
        },
        mounted() {
          this.isRegister();
        },
        methods: {
            isRegister() {
                this.$http.get("/api/system").then(res => {
                    this.register = res.data.data.register
                })
            },
            open() {
                this.$confirm('是否确认修改学生可注册状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.put("/api/system",{
                        id: 1,
                        register: this.register
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            }
        }
    };
</script>
