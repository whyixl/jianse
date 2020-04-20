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
        <br>
      </div>
      <el-table :data="pager.records" style="width: 100%" stripe highlight-current-row v-loading="$store.state.loading"
                @selection-change="onSelectionChange">
        <el-table-column type="selection" width="55" :align="'center'">
        </el-table-column>
        <el-table-column prop="title" label="标题" :align="'center'"></el-table-column>
        <el-table-column prop="description" label="描述" :align="'center'"></el-table-column>
        <el-table-column prop="type" label="类型" :align="'center'"></el-table-column>
        <el-table-column prop="teacher.name" label="导师" :align="'center'" width="100px"></el-table-column>
        <el-table-column prop="total" label="总数" :align="'center'" width="50px"></el-table-column>
        <el-table-column prop="remain" label="余量" :align="'center'" width="50px"></el-table-column>

        <el-table-column label="发布日期" :align="'center'" width="150px">
          <template slot-scope="scope">
            {{ scope.row.createTime | moment('YYYY-MM-DD hh:mm') }}
          </template>
        </el-table-column>

        <el-table-column label="操作" :align="'center'" width="145px">
          <template slot-scope="{row}">
            <el-button :disabled="!(row.teacherId == uid)" type="primary" size="mini" @click="edit">编辑</el-button>
            <el-button :disabled="!(row.teacherId == uid)" type="success" size="mini" @click="remove(row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="pager.current" :page-size="pager.size" :total="pager.total"
                     class="pagination text-right" :page-sizes="$store.state.paginationPageSizes"
                     @size-change="sizeChange" @current-change="pageChange"
                     :layout="$store.state.paginationLayout"></el-pagination>
    </el-card>

    <el-dialog title="添加课题" :visible.sync="dialogVisible" width="35%"
               @closed="resetForm('topicForm')">
      <el-form :label-position="'right'" status-icon label-width="80px" ref="topicForm"
               :model="topicForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="topicForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="topicForm.type" placeholder="请输入类型"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input :autosize="{ minRows: 4}" type="textarea" v-model="topicForm.description"
                    placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="可选数" prop="total">
          <el-input-number v-model="topicForm.total"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('topicForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "TopicManager",
        data() {
            return {
                uid: localStorage.getItem("id"),
                dialogVisible: false,
                title: null,
                description: null,
                type: null,
                teacherId: null,
                teacher: [],
                selectedRows: [],
                topicForm: {
                    title: null,
                    description: null,
                    total: null,
                    type: null,
                },
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        mounted() {
            this.query();
            this.queryTeacher();
        },
        methods: {
            queryTeacher() {
                this.$http.get("/api/user/teacher").then(
                    res => {
                        this.teacher = res.data.data;
                    }
                )
            },
            query() {
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
                });
            },
            edit() {
                this.dialogVisible = true;
            },
            onSelectionChange(rows) {
                this.selectedRows = rows.map(item => item.id);
            },
            remove(id) {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http.delete("/api/topic/" + id).then(() => {
                        this.query();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            submitForm() {
                this.$refs['topicForm'].validate((valid) => {
                    if (valid) {
                        this.promise
                        this.$http.post("/api/topic", this.topicForm)
                            .then(res => {
                                if (res.data.msg === "添加成功") {
                                    this.resetForm('topicForm');
                                    this.query();
                                }
                            })
                    } else {
                        return false;
                    }

                });
            },
            resetForm(name) {
                this.$refs[name].resetFields();
                this.dialogVisible = false;
            },
            pageChange(val) {
                this.pager.current = val;
                this.query()
            },
            sizeChange(val) {
                this.pager.size = val;
                this.query()
            },
        }
    }
</script>

<style scoped>

</style>