<template>
  <el-card shadow="never" :body-style="{ padding: '0px' , marginLeft: '5%', width: '90%'}">
    <el-collapse accordion v-if="topics.length > 0">
      <el-collapse-item v-for="item in topics">
        <template slot="title">
          <div style="width: 100%;font-size: 18px">
            {{item.title}} —— {{item.student}}
          </div>
        </template>
        <div style="padding: 10px 10px;border: #00152a 1px solid; height: 100px;border-radius: 5px;">
          <el-form :inline="true" :model="item">
            <el-form-item label="下载：" label-width="100px">
              <el-link type="text" underline @click="download(item.studentId)">点击下载论文</el-link>
            </el-form-item>
            <el-form-item label="打分：" label-width="100px">
              <el-input v-model="item.score"></el-input>
            </el-form-item>
            <el-form-item label="评语：" label-width="100px">
              <el-input style="width: 200px" :autosize="{ minRows: 4}" v-model="item.content"
                        type="textarea"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="float-right" type="primary" @click="onSubmit(item)">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-item>

    </el-collapse>
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
                      window.location.href="/api/topic/download/"+id
                  }
                })
            }
        },
        mounted() {
            this.queryAll();
        }
    };
</script>
