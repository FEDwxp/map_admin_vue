<template>
  <div class="app-container">
    <!--    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="行业名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入行业名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['map:businessCategory:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['map:businessCategory:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['map:businessCategory:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['map:businessCategory:export']"
        >导出</el-button>
      </el-col> -->
    </el-row>

    <el-table v-loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="id" :data="businessCategoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="行业名称" align="left" prop="name" />
      <el-table-column label="行业代码" align="left" prop="code" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.level !== 3"
            v-hasPermi="['map:businessCategory:add']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleAdd(scope.row)"
          >新增</el-button>
          <el-button
            v-hasPermi="['map:businessCategory:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['map:businessCategory:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        /> -->

    <!-- 添加或修改行业分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item v-if="addPrename" label="上级行业" prop="parentId">
          <el-input v-model="addPrename" disabled placeholder="" />
        </el-form-item>
        <el-form-item label="行业名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入行业名称" />
        </el-form-item>
        <el-form-item label="行业代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入行业代码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listBusinessCategory, getpreBusinessCategory, getBusinessCategory, delBusinessCategory, addBusinessCategory, updateBusinessCategory, exportBusinessCategory } from '@/api/map/businessCategory'

export default {
  name: 'BusinessCategory',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 行业分类表格数据
      businessCategoryList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      addPrename: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        parentId: undefined,
        name: undefined,
        code: undefined,
        level: undefined,
        status: undefined,
        deleted: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询行业分类列表 */
    getList() {
      this.loading = true
      listBusinessCategory(this.queryParams).then(response => {
        this.businessCategoryList = response.data.root
        // this.total = response.total;
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: undefined,
        name: undefined,
        code: undefined,
        level: undefined,
        status: undefined,
        createTime: undefined,
        updateTime: undefined,
        updateBy: undefined,
        createBy: undefined,
        deleted: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd(val) {
      this.reset()
      this.addPrename = undefined
      console.log('asda', val)

      // 一级新增
      if (val && !val.level) {
        this.form.level = 1
        this.form.subCode = -1
      } else if (val && val.level === 1) {
        // 二级新增
        this.form.subCode = val.code
        this.form.level = 2
        this.addPrename = undefined
      } else if (val && val.level === 2) {
        // 三级新增
        this.form.subCode = val.code
        this.form.level = 3
      }
      if (val && val.code) {
        getpreBusinessCategory(val.code).then(response => {
          if (response.code === 200) {
            if (val.level === 2) {
              getpreBusinessCategory(response.data.subCode).then(response => {
                if (response.code === 200) {
                  this.addPrename = response.data.name
                } else {
                  this.msgError(response.msg)
                }
              })
            }
          } else {
            this.addPrename = ''
            this.msgError(response.msg)
          }
        })
      }
      this.open = true
      this.title = '添加行业分类'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      console.log(row)
      if (row.level === 1) {
        this.addPrename = ''
      }
      if (row.level === 2 || row.level === 3) {
        getpreBusinessCategory(row.subCode).then(response => {
          if (response.code === 200) {
            this.addPrename = response.data.name
          } else {
            this.msgError(response.msg)
          }
        })
      }
      getBusinessCategory(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改行业分类'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateBusinessCategory(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addBusinessCategory(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除行业分类编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delBusinessCategory(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有行业分类数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportBusinessCategory(queryParams)
      }).then(response => {
        this.download(response.msg)
      }).catch(function() {})
    }
  }
}
</script>
