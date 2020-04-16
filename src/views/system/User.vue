<template>
  <div>
    <el-card shadow="never" :body-style="{ padding: '0px' }">
      <div slot="header">
        <el-row :gutter="10">
          <el-col :span="3">
            <el-input placeholder="用户名" v-model="name"></el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="手机号码" v-model="phone"></el-input>
          </el-col>
          <el-col :span="3">
            <el-select v-model="state" placeholder="用户状态" clearable>
              <el-option :label="'启用'" :value="1"></el-option>
              <el-option :label="'禁用'" :value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-search">查询</el-button>
          </el-col>
        </el-row>
        <br>
        <el-button size="medium" icon="el-icon-delete" :disabled="selectedRows.length===0">禁用</el-button>
      </div>
      <el-table :data="pager.records" style="width: 100%" stripe highlight-current-row v-loading="$store.state.loading"
                @selection-change="onSelectionChange">
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column prop="name" label="用户名" :align="'center'"></el-table-column>
        <el-table-column prop="phone" label="手机号码" :align="'center'"></el-table-column>
        <el-table-column prop="email" label="电子邮件" :align="'center'"></el-table-column>

        <el-table-column label="创建日期" :align="'center'" width="150px">
          <template slot-scope="scope">
            {{ scope.row.createTime | moment('YYYY-MM-DD hh:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="最后登陆" :align="'center'" width="150px">
          <template slot-scope="scope">
            {{ scope.row.lastLogin | moment('YYYY-MM-DD hh:mm') }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100px" :align="'center'">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status" :type="'success'">已启用</el-tag>
            <el-tag v-if="!scope.row.status" :type="'danger'">已禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" :align="'center'">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit()">编辑</el-button>
            <el-button type="text" size="small" @click="remove()">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="pager.current" :page-size="pager.size" :total="pager.total"
                     class="pagination text-right" :page-sizes="$store.state.paginationPageSizes"
                     :layout="$store.state.paginationLayout"></el-pagination>
    </el-card>

  </div>
</template>
<script>
    export default {
        name: "user",
        data() {
            return {
                dialogVisible: false,
                state: null,
                phone: null,
                name: null,
                selectedRows: [],
                bucketName: "public",
                pager: {current: 1, size: 10, total: 0, records: []}
            };
        },
        mounted() {
            this.query();
        },
        methods: {
            query() {
                this.$http.post("/api/user/all", {
                    current: this.pager.current,
                    size: this.pager.size,
                    param: {
                        name: this.name,
                        phone: this.phone,
                        state: this.state
                    }
                }).then(res => {
                    this.pager = res.data.data;
                });
            },
            edit() {
                this.dialogVisible = true;
            },
            onSelectionChange(rows) {
                this.selectedRows = rows.map(item => item.userId);
            },
            remove() {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                });
            },
            onRemoveFile(file) {
                this.$http.delete(`/oss/remove/${this.bucketName}/${file.response}`);
            }
        }
    };
</script>
