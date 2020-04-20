<template>
  <el-card shadow="never" :body-style="{ padding: '20px 20px 20px 20px' }">
    <div style="border: 1px solid #002140; border-radius: 5px;height: 150px">
      <el-row style="margin-top: 20px;height: 110px">
        <el-col :span="12" :offset="1" style="border-radius: 5px;height: 110px">
          <el-row style="font-size: 20px;color: #409EFF">
            <span>标题：{{topic.title ? topic.title : "未选择课题"}}</span>
          </el-row>
          <el-row style="margin-top: 15px">
            <span>评价：{{topic.content ? topic.content:"暂无评价"}}</span>
          </el-row>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-row style="font-size: 18px; color: green;">SCORE</el-row>
          <el-row style="font-size: 18px; color: red; margin-top: 15px">{{topic.score ? topic.score:"暂无打分"}}</el-row>
        </el-col>
        <el-col v-show="topic.id" :span="4">
          <el-upload class="avatar-uploader"
                     name="multipartFile" :headers="{'Authorization': $store.state.token}"
                     action="/api/topic/upload"
                     :show-file-list="false">
            <i class="el-icon-plus avatar-uploader-icon">点击上传</i>
          </el-upload>
        </el-col>
        <el-col :span="2" style="margin-top: 75px">
          <el-button type="danger" v-show="topic.id" @click="unSelect">退选</el-button>
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
        },
        mounted() {
            this.queryMyTopic()
        },
        methods: {
            queryMyTopic() {
                this.$http.get("/api/topic").then(
                    res => {
                        this.topic = res.data.data;
                    }
                )
            },
            unSelect() {
                this.$http.put("/api/topic/unSelect").then(
                    res => {
                        if (res.status === 200) {
                            this.topic = {
                                title: null,
                                content: null,
                                score: null
                            }
                        }
                    }
                )
            }
        },
    }
</script>