<template>
  <el-card shadow="never" :body-style="{ padding: '0px' , marginLeft: '5%', width: '90%'}">
    <div slot="header">
      <span style="font-size: 24px;font-weight: 500">任务书</span>
    </div>
    <div style="height: 150px" v-if="topics.length === 0">
      <span style="text-align: center;line-height: 150px;width: 100%">
        暂未有学生选择您的课题。。。
      </span>
    </div>
    <div v-for="item in topics" style="padding-top: 20px">
      {{item.title}} —— {{item.student}}
      <el-link style="float: right" type="text" underline @click="download(item.studentId)">查看</el-link>
      <el-divider></el-divider>
    </div>

  </el-card>
</template>

<script>
    export default {
        name: "Topic",
        data() {
            return {
                uid: localStorage.getItem("id"),
                activeName: "",
                latestSubmit: [],
                topics: [],
                scoreForm: {
                    score: "",
                    content: "",
                },
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        methods: {
            queryAll() {
                this.$http.get("/api/topic/teacher/" + this.uid).then(res => {
                    this.topics = res.data.data;
                })

            },
            onSubmit(score) {
                this.$http.put("/api/topic/score", score)
            },
            download(id) {
                // 判断是否有文件
                this.$http.get("/api/topic/hasDoc/" + id).then(res => {
                    // 如果有的话，访问下载链接
                    if (res.data.code === 200) {
                        window.location.href = "/api/topic/download/" + id
                    }
                })
            }
        },
        mounted() {
            this.queryAll();
        }
    };
</script>
