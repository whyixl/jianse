<template>
  <el-card shadow="never" :body-style="{ padding: '20px 20px 20px 20px' }">
    <div style="border: 1px solid #002140; border-radius: 5px;">
      <el-row style="margin-top: 20px;">
        <el-col :span="12" :offset="1" style="border-radius: 5px;">
          <el-row style="font-size: 20px;color: #409EFF">
            <span>标题：{{topic.title ? topic.title : "未选择课题"}}</span>
          </el-row>
          <el-row style="margin-top: 5px">
            <p>描述：{{topic.description ? topic.description:"暂无描述"}}</p>
          </el-row>
          <el-row style="margin-top: 5px">
            <p>附件：{{topic.missionBook ? topic.missionBook:"暂无描述"}}&nbsp;
              <el-link style="margin-left: 20px" type="text" underline @click="download(topic.id)">立即下载</el-link>
            </p>
          </el-row>
        </el-col>
        <el-col :span="10" style="margin-top: 20px">
          <el-upload name="multipartFile" :headers="{'Authorization': $store.state.token}"
                     :data="{topicId: topic.id}"
                     :show-file-list="false"
                     :before-upload="beforeAvatarUpload"
                     action="/api/topic/upload"
                     accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document">
            <el-button type="primary">上传任务书</el-button>
          </el-upload>
          <el-button style="margin-top: 30px" type="danger" v-show="topic.id" @click="unSelect">退选本课题</el-button>
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
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http.put("/api/topic/unSelect/" + this.topic.id).then(() => {
                            this.queryMyTopic()
                        }
                    )
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            download(id) {
                // 判断是否有文件
                this.$http.get("/api/topic/hasMission/" + id).then(res => {
                    // 如果有的话，访问下载链接
                    if (res.data.code === 200) {
                        window.location.href = "/api/topic/downloadMission/" + id
                    }
                })
            },
            beforeAvatarUpload(file) {
                console.log(file.type);
                const isWORD = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                if (!isWORD) {
                    this.$message.error('只支持Word13以上的版本');
                }
                return isWORD;
            },
        },
    }
</script>