<template>
  <el-card shadow="never" :body-style="{ padding: '20px 20px 20px 20px' }">
    <el-switch
        v-model="register"
        active-text="允许学生注册"
        inactive-text="禁止学生注册"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-value="1"
        inactive-value="0"
        @change="open">
    </el-switch>
  </el-card>
</template>

<script>
    export default {
        name: "Manager"
    }
</script>

<style scoped>

</style>