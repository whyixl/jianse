<template>
  <el-container>
    <el-aside class="sidebar" v-bind:class="{'sidebar-collapse':isCollapse}">
      <el-header class="logo">
        <img src="@/assets/logo_.png" alt="logo">
        <h1>见色 课题管理</h1>
      </el-header>
      <el-menu :router="true" :default-active="$route.path" :collapse="isCollapse">
        <el-menu-item v-for="menu in this.$store.state.menuTree" :key="menu.menuId" :index="menu.link"
                      v-if="menu.children.length===0">
          <i :class="menu.icon"></i>
          <span slot="title">{{menu.menuName}}</span>
        </el-menu-item>
        <el-submenu :index="menu.link" v-else>
          <template slot="title">
            <i :class="menu.icon"></i>
            <span slot="title">{{menu.menuName}}</span>
          </template>
          <el-menu-item :index="child.link" v-for="child in menu.children" :key="child.menuId">
            <i :class="menu.icon"></i>
            <span slot="title">{{child.menuName}}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header" style="padding-top: 15px">
        <i @click="isCollapse=!isCollapse" class="el-icon-menu sidebarToggle"></i>
        <div class="float-right">

          <el-badge :value="notice.length" class="item" style="margin-top: 0">
            <el-dropdown :hide-on-click="false" trigger="click" v-infinite-scroll="queryNotice"
                         class="header-action" style="overflow:auto">
              <el-link underline type="text">通知</el-link>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item, index) in notice">
                  <i class="el-icon-close float-right" @click="popNotice" v-if="index === 0"></i>
                  <span
                      style="font-size: 17px;font-weight: 400;text-align: center;line-height: 17px">{{item.title}}：</span>
                  <span style="width: 400px">{{item.content}}</span>
                  <hr v-if="index !== notice.length - 1">
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-badge>

          <el-dropdown trigger="click" @command="handleCommand" class="header-action">
            <el-link underline type="text">
              <span>{{ this.$store.state.userName }}<i class="el-icon-arrow-down el-icon--right"></i></span>
            </el-link>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="Profile"><i class="el-icon-setting"></i> 个人设定</el-dropdown-item>
              <el-dropdown-item command="SignOut"><i class="el-icon-refresh"></i> 安全退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
          <el-breadcrumb-item v-for="menuName in _.map($route.matched,'meta.menuName')" :key="menuName">
            {{ menuName }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
    export default {
        name: "App",
        data() {
            return {
                isCollapse: false,
                notice: [],
            };
        },
        mounted() {
            this.queryNotice();
            if (!this.$store.state.userName) {
                this.$store.commit("setUserName", localStorage.getItem("userName"))
            }
        },
        methods: {
            load() {
                this.count += 2
            },
            handleCommand(command) {
                switch (command) {
                    case "Profile":
                        this.$router.push({path: "/system/profile"});
                        break;
                    case "SignOut":
                        this.signOut();
                        break;
                }
            },
            signOut() {
                this.$store.dispatch("signOut").then(() => {
                    this.$router.push({path: "/"});
                });
            },
            queryNotice() {
                this.$http.get("/api/notice").then(res => {
                    this.notice = res.data.data;
                })
            },
            popNotice() {
                this.notice = this.notice.slice(1, this.notice.length);
                this.$http.put("/api/notice");
            }
        }
    };
</script>
