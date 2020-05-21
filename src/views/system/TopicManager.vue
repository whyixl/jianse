<template>
  <div>
    <el-card shadow="never" :body-style="{ padding: '0px' }">
      <div slot="header">
        <el-row :gutter="10">
          <el-col :span="3">
            <el-button type="info" :disabled="selectedRows.length===0" @click="deleteBatch">删除</el-button>
          </el-col>
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
          <el-col :span="4">
            <el-button type="primary" @click="query" icon="el-icon-search">查询</el-button>
          </el-col>
          <el-col :span="4">
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
        <el-table-column prop="teacher.name" label="任务书" :align="'center'" width="80px">
          <template slot-scope="{row, column}">
            <el-link style="float: right" type="text" underline @click="download(row[column])">查看</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="总数" :align="'center'" width="50px"></el-table-column>
        <el-table-column prop="remain" label="余量" :align="'center'" width="50px"></el-table-column>

        <el-table-column label="发布日期" :align="'center'" width="150px">
          <template slot-scope="scope">
            {{ scope.row.createTime | moment('YYYY-MM-DD hh:mm') }}
          </template>
        </el-table-column>

        <el-table-column label="操作" :align="'center'" width="145px">
          <template slot-scope="{row}">
            <el-button
                :disabled="!((row.teacherId == uid) || $store.state.menus.find((item)=>{return (item.menuCode==='setting')}))"
                type="primary" size="mini" @click="edit(row)">编辑
            </el-button>
            <el-button
                :disabled="!((row.teacherId == uid) || $store.state.menus.find((item)=>{return (item.menuCode==='setting')}))"
                type="success" size="mini" @click="remove(row.id)">删除
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
               @closed="cancel">
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
        <el-form-item label="任务书" prop="type">

          <el-upload name="multipartFile" :headers="{'Authorization': $store.state.token}"
                     ref="upload"
                     :limit="1"
                     :file-list="fileList"
                     :data="{topicId: topicId}"
                     :auto-upload="false"
                     :before-upload="beforeAvatarUpload"
                     action="/api/topic/teacherUpload"
                     :http-request="uploadMission"
                     accept="application/msword,
                     application/vnd.openxmlformats-officedocument.wordprocessingml.document">
            <a>
              选取文件
            </a>
          </el-upload>
        </el-form-item>
        <el-form-item label="可选数" prop="total">
          <el-input-number v-model="topicForm.total"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
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
                topicId: "",
                uid: localStorage.getItem("id"),
                dialogVisible: false,
                title: null,
                description: null,
                type: null,
                teacherId: null,
                teacher: [],
                fileList: [],
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
        created() {
            this.$router.push({path: "/system/Topicmanager"});
        },
        mounted() {
            this.query();
            this.queryTeacher();
            this.$router.push({path: "/system/Topicmanager"});
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
            edit(row) {
                this.dialogVisible = true;
                this.topicForm = row;
            },
            onSelectionChange(rows) {
                this.selectedRows = rows.map(item => item.id);
            },
            deleteBatch() {
                this.$http.post("/api/topic/deleteBatch", this.selectedRows).then(() => {
                    this.query();
                })
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
            uploadMission(param) {
                let thiz = this
                let formData = new FormData()
                formData.append('topicId', thiz.topicId) // 额外参数
                formData.append('multipartFile', param.file)
                thiz.$http.post('/api/topic/teacherUpload', formData);
            },
            submitForm() {
                this.$refs['topicForm'].validate((valid) => {
                    if (valid) {
                        if (this.topicForm.id) {
                            this.$http.put("/api/topic", this.topicForm)
                                .then(() => {
                                    this.topicId = this.topicForm.id
                                    this.$refs.upload.submit();
                                    this.dialogVisible = false;
                                    this.query();
                                })
                        } else {
                            this.$http.post("/api/topic", this.topicForm)
                                .then(res => {
                                    this.topicId = res.data.data
                                    this.$refs.upload.submit();
                                    this.dialogVisible = false;
                                    this.query();
                                })
                        }
                    } else {
                        return false;
                    }

                });
            },
            beforeAvatarUpload(file) {
                console.log(file.type);
                const isWORD = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    || file.type === 'application/msword';
                if (!isWORD) {
                    this.$message.error('只能上传Word2013以上的版本文件');
                }
                return isWORD;
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
            cancel() {
                this.dialogVisible = false;
                this.topicForm = {
                    title: null,
                    description: null,
                    total: null,
                    type: null,
                };
                this.fileList = [];
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