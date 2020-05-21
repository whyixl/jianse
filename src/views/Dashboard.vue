<template>
  <div>
    <el-card shadow="never" :body-style="{ padding: '0px' }">
      <div slot="header">
        <el-row :gutter="10">
          <el-col :span="3">
            <el-select v-model="teacherId" placeholder="老师" clearable filterable>
              <el-option
                  v-for="item in teacher"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="标题" clearable v-model="title"></el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="描述" clearable v-model="description"></el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="类型" clearable v-model="type"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="query" icon="el-icon-search">查询</el-button>
          </el-col>
          <el-col :span="6">
            <el-button class="float-right" type="warning" icon="el-icon-plus" @click="dialogVisible = true">新增
            </el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="pager.records" style="width: 100%" stripe highlight-current-row>
        <el-table-column prop="title" label="名称" :align="'center'"></el-table-column>
        <el-table-column prop="description" label="描述" :align="'center'"></el-table-column>
        <el-table-column prop="type" label="类型" :align="'center'"></el-table-column>
        <el-table-column prop="teacher.name" label="导师" :align="'center'"></el-table-column>
        <el-table-column prop="remain" label="余量" :align="'center'"></el-table-column>
        <el-table-column prop="createTime" label="创建日期" :align="'center'" width="150px">
          <template slot-scope="{row, column}">
            {{ row[column.property] | moment('YYYY-MM-DD hh:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" :align="'center'">
          <template slot-scope="{row, column}">
            <el-button type="info" size="small" @click="selected(row.id)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="pager.current" :page-size="pager.size" :total="pager.total"
                     class="pagination text-right" :page-sizes="$store.state.paginationPageSizes"
                     :layout="$store.state.paginationLayout"
                     @size-change="sizeChange" @current-change="pageChange"></el-pagination>
    </el-card>

  </div>
</template>

<script>
    export default {
        name: "Dashboard",
        data() {
            return {
                teacher: [],
                title: null,
                description: null,
                type: null,
                teacherId: null,
                pager: {current: 1, size: 10, total: 0, records: []}
            }
        },
        mounted() {
            this.queryTeacher();
            this.allTopic();
        },
        methods: {
            queryTeacher() {
                this.$http.get("/api/user/teacher").then(
                    res => {
                        this.teacher = res.data.data;
                    }
                )
            },
            selected(topicId) {
                this.$http.put("/api/topic/select/" + topicId).then(() => {
                    this.allTopic();
                });
            },
            allTopic() {
                this.$http.post("/api/topic/all", {
                    current: this.pager.current,
                    size: this.pager.size,
                    param: {
                        teacherId: this.teacherId,
                        title: this.title,
                        description: this.description,
                        type: this.type
                    }
                }).then(res => {
                    this.pager = res.data.data;
                })
            },
            pageChange(val) {
                this.pager.current = val;
                this.allTopic()
            },
            sizeChange(val) {
                this.pager.size = val;
                this.allTopic()
            },
        }
    }
</script>

<style scoped>

</style>