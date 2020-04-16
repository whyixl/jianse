<template>
  <el-card shadow="never" :body-style="{ padding: '20px 20px 20px 20px' }">
    <div style="border: 1px solid #002140; border-radius: 5px;height: 150px">
      <el-row style="margin-top: 20px;height: 110px">
        <el-col :span="15" :offset="1" style="border-radius: 5px;height: 110px">
          <el-col :span="20">
            <el-row style="font-size: 20px;color: #409EFF">
              <span>标题：领阿囧海宁站那矿干涉来查怪站娘口{{topic.title}}</span>
            </el-row>
            <el-row>
              <span>描述：{{topic.description}}</span>
            </el-row>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" style="margin-top: 70px">查看</el-button>
          </el-col>
        </el-col>
        <el-col :span="3" style="border-radius: 5px;height: 110px">
          <el-row style="font-size: 18px; color: green;">SCORE</el-row>
          <el-row style="font-size: 18px; color: red; ">34{{topic.score}}</el-row>
        </el-col>
        <el-col :span="4" style="border-radius: 5px;height: 110px">
          <el-upload class="avatar-uploader"
                     name="multipartFile"
                     action="/api/topic/upload"
                     :show-file-list="false">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
      </el-row>

    </div>
  </el-card>
</template>

<script>
    export default {
        name: "Topic",
        data() {
            return {
                topic: {}
            }
        }
    }
</script>

<style scoped>

</style>