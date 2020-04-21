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
      </div>
      <el-table :data="pager.records" style="width: 100%" stripe highlight-current-row v-loading="$store.state.loading">
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
          <template slot-scope="{row}">
            <el-tag v-if="row.status" :type="'success'">已启用</el-tag>
            <el-tag v-if="!row.status" :type="'danger'">已禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="200px" :align="'center'">
          <template slot-scope="{row}">
            <el-tag v-if="row.roles && role.type === 'student'" v-for="role in row.roles" type="success">{{role.type}}
            </el-tag>
            <el-tag style="margin-left: 5px" v-if="row.roles && role.type === 'teacher'" v-for="role in row.roles"
                    type="warning">{{role.type}}
            </el-tag>
            <el-tag style="margin-left: 5px" v-if="row.roles && role.type === 'admin'" v-for="role in row.roles"
                    type="danger">{{role.type}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" :align="'center'">
          <template slot-scope="{row}">
            <el-button v-if="row.roles.some(item=>{if (item.id===3) return true})" type="text" size="small"
                       @click="unAdmin(row.id)">取消管理员
            </el-button>
            <el-button v-else type="text" size="small"
                       @click="admin(row.id)">提升管理员
            </el-button>
            <el-button v-if="row.status === 1" type="text" size="small" @click="disable(row.id)">禁用</el-button>
            <el-button v-else type="text" size="small" @click="enable(row.id)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="pager.current" :page-size="pager.size" :total="pager.total"
                     class="pagination text-right" :page-sizes="$store.state.paginationPageSizes"
                     @size-change="sizeChange" @current-change="pageChange"
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
            disable(id) {
                this.$http.put("/api/user/disable/" + id).then(() => {
                    this.query();
                })
            },
            enable(id) {
                this.$http.put("/api/user/enable/" + id).then(() => {
                    this.query();
                })
            },
            admin(id) {
                this.$http.put("/api/user/admin/" + id).then(() => {
                    this.query();
                })
            },
            unAdmin(id) {
                this.$http.put("/api/user/unAdmin/" + id).then(() => {
                    this.query();
                })
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
    };
</script>
