<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/users">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <!--搜索区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
          <!--弹出框-->
          <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>

      <!--用户列表区域-->
      <el-table :data="usersList" stripe border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="手机" prop="mobile"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="权限" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            {{ scope.row }}
            <el-switch
              v-model="scope.row.mg_state"
              @change="newChange(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!--修改按钮-->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!--删除按钮-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!--分配角色按钮-->
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!--修改对话框-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVilad">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsersData,
  getStatusChange,
  addUsers,
  editUserId,
  editByUserId,
  removeUerById
} from '../../../network/users.js'

export default {
  name: 'Users',
  data() {
    //验证邮箱的规则
    var checekEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    //验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      //验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //当前页面显示条数
        pagesize: 2
      },
      usersList: [],
      total: 0,
      dialogVisible: false,
      //控制修改用户对话框的显示隐藏
      editDialogVisible: false,
      //修改操作中查询到用户的数据
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checekEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '3到10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '3到15个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checekEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUsersList() {
      const { data: res } = await getUsersData(this.queryInfo)
      console.log(res)

      if (res.meta.status != 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.usersList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    handleCurrentChange(newCurrent) {
      console.log(newCurrent)
      this.queryInfo.pagenum = newCurrent
      this.getUsersList()
    },
    async newChange(usersList) {
      const { data: res } = await getStatusChange(
        //反引号 模板字符串 es6语法
        `users/${usersList.id}/state/${usersList.mg_state}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        usersList.mg_state = !usersList.mg_state
        return this.$message.error('修改用户状态失败')
      }
      this.$message.success('修改用户状态成功')
    },
    //表单关闭后重置
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        //可以发起真正的请求
        const { data: res } = await addUsers(this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加新用户失败')
        }
        this.dialogVisible = false
        this.$message.success('添加新用户成功')
      })
    },
    //根据用户id修改状态
    async showEditDialog(id) {
      this.editDialogVisible = true
      console.log(id)
      const { data: res } = await editUserId('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户失败')
      }
      this.editForm = res.data
    },
    //重置点开之后的弹出框状态
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //验证修改弹出框
    editDialogVilad() {
      this.$refs.editFormRef.validate(async vilad => {
        console.log(vilad)
        if (!vilad) {
          this.$message.error('请输入正确的格式')
        }
        const { data: res } = await editByUserId(
          'users/' + this.editForm.id,
          this.editForm.email,
          this.editForm.mobile
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('修改状态失败')
        }

        //关闭状态狂
        this.editDialogVisible = false
        //更新状态
        this.getUsersList()

        this.$message.success('修改状态成功')
      })
    },
    async removeUserById(id) {
      console.log(id)
      //弹框
      const removeResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => {
        return err
      })
      console.log(removeResult)
      //点击确认 打印一个confirm
      //点击取消 返回打印 cancel
      if (removeResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }

      const { data: res } = await removeUerById('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败了')
      }
      //重新获取用户
      this.getUsersList()
      this.$message.success('删除用户成功')
    }
  },
  created() {
    this.getUsersList()
  }
}
</script>

<style lang="stylus" scope>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
</style>
