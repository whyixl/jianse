<template>
  <el-card shadow="never" :body-style="{ padding: '20px 20px 20px 20px' }">
    <el-form ref="userForm" :model="noticeForm" label-width="80px">
      <el-form-item prop="title" label="标题" class="label">
        <el-input style="width: 250px" v-model="noticeForm.title" placeholder="请输入标题。。。"></el-input>
      </el-form-item>
      <el-form-item prop="content" label="内容" class="label">
        <el-input style="width: 250px" v-model="noticeForm.content" placeholder="请输入内容。。。"></el-input>
      </el-form-item>
      <el-form-item prop="roles" label="接收人" class="label">
        <el-select style="width: 250px" multiple v-model="roles">
          <el-option label="学生" :value="1"></el-option>
          <el-option label="老师" :value="2"></el-option>
          <el-option label="管理员" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="publish">发布</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
    export default {
        name: "Notice",

        data() {
            return {
                noticeForm: {
                    title: null,
                    content: null,
                },
                roles: [],
            }
        },
        methods: {
            publish() {
                this.$http.post("/api/notice", {
                    roles: this.roles,
                    notice: this.noticeForm,
                })
            }
        }

    }
</script>

<style scoped>

</style>