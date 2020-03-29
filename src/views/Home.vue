<template>
  <el-container class="home-container">
    <el-header>
      <el-button type="info" @click="logout()">退出</el-button>
    </el-header>
    <!--页面主题区域-->
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边栏-->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
        >
          <!--一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!--一级菜单区域模板 -->
            <template slot="title">
              <!--图标-->
              <i :class="iconsObj[item.id]"></i>
              <!--文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item
              :index="'/' + subitem.path"
              v-for="subitem in item.children"
              :key="subitem.id"
              @click="saveNavState('/' + subitem.path)"
            >
              <template slot="title">
                <!--图标-->
                <i class="el-icon-location"></i>
                <!--文本-->
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getHomeData } from '../network/home.js'

export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      iconsObj: {
        '125': 'el-icon-user',
        '103': 'el-icon-setting',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-info',
        '145': 'el-icon-s-grid'
      },
      //是否折叠
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('成功退出 经常回来玩哟')
    },
    //获取菜单数据
    async getMenuList() {
      const { data: res } = await getHomeData()
      if (res.meta.status !== 200) return this.$message.error('res.meta.msg')
      this.menuList = res.data
      // console.log(res)
    },
    //点击按钮实现菜单的折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      //这一步还不太明白
      this.activePath = activePath
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="stylus" scope>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #EAEDF1;
}

.toggle-button {
  background: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  position: flex;
}
</style>
