<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18">
        <el-card>
          <div slot="header">
            <span>全部课题</span>
          </div>
          <el-row v-infinite-scroll="topicRoll" style="height: 300px; overflow:auto">
            <el-row v-for="topic in allTopic" :key="topic.n" >
              <el-col> <span class="text-info">{{topic.title}}</span></el-col>
              <el-col class="text-primary">{{topic.description}}</el-col>
            </el-row>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-row>
          <el-col>
            <el-card>
              <div slot="header">
                <span>动态</span>
              </div>

              <hr>

            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss">
  .el-row {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
<script>
    export default {
        name: "Topic",
        data() {
            return {
                allTopic: [],
                latestSubmit: [],
                current: 1,
                size: 2,
            };
        },
        methods: {
            queryAll() {
                this.$http.post("/api/topic", {
                    current: this.current,
                    size: this.size
                }).then(res => {
                    this.allTopic = res.data.data.records;
                })

            },
            queryLatest() {
                this.$http.get("/api/topic/latest").then(res => {
                    this.latestSubmit = res.data.data;
                })
            },
            topicRoll() {
                console.log("roll");
                this.size += 4;
                this.queryAll();
            }
        },
        mounted() {
            this.queryAll();
            this.queryLatest();
        }
    };
</script>
