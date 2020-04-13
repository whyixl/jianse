<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="18">
        <el-card>
          <div slot="header">
            <span>全部课题</span>
          </div>
          <el-row v-infinite-scroll="topicRoll">
            <el-row v-for="topic in allTopic" :key="n">
              <el-col :span="20">{{topic.name}} <span class="text-primary">Element Admin</span></el-col>
              <el-col :span="4" class="text-info"> 2018-3-1 13:43</el-col>
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

              <div class="text-primary">2018新款韩版潮流男士夏装丅恤上衣服
                <el-tag type="danger" size="mini" class="float-right">¥ 302</el-tag>
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
