<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="所属商家" prop="merchant">
        <el-select
          v-model="queryParams.merchant"
          filterable
          remote
          reserve-keyword
          placeholder="请输入商家名称"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="有效期">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['map:measureAappliance:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['map:measureAappliance:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['map:measureAappliance:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['map:measureAappliance:export']"
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="measureAapplianceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="所属商家"
        align="center"
        prop="merchantName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="名称"
        align="center"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="型号" align="center" prop="model" />
      <!--   <el-table-column
        label="生产厂家"
        align="center"
        prop="factoryName"
        :show-overflow-tooltip="true"
      /> -->
      <el-table-column label="出厂编号" align="center" prop="leaveNo" />
      <!-- <el-table-column
        label="用途"
        align="center"
        prop="purpose"
        :show-overflow-tooltip="true"
      /> -->
      <!-- <el-table-column label="检定情况" align="center" prop="checkCase" /> -->
      <el-table-column label="有效期" align="center" prop="validDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.validDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['map:measureAappliance:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['map:measureAappliance:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改计量器具对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属商家" prop="merchant">
          <el-select
            v-model="form.merchant"
            filterable
            remote
            reserve-keyword
            style="width: 100%"
            placeholder="请输入商家名称"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input v-model="form.model" placeholder="请输入型号" />
        </el-form-item>
        <!-- <el-form-item label="生产厂家" prop="factoryName">
          <el-input v-model="form.factoryName" placeholder="请输入生产厂家" />
        </el-form-item> -->
        <el-form-item label="出厂编号" prop="leaveNo">
          <el-input v-model="form.leaveNo" placeholder="请输入出厂编号" />
        </el-form-item>
        <!--  <el-form-item label="用途" prop="purpose">
          <el-input v-model="form.purpose" placeholder="请输入用途" />
        </el-form-item>
        <el-form-item label="检定情况" prop="checkCase">
          <el-input v-model="form.checkCase" placeholder="请输入检定情况" />
        </el-form-item> -->
        <el-form-item label="有效期" prop="validDate">
          <el-date-picker
            v-model="form.validDate"
            clearable
            size="small"
            style="width: 200px"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择有效期"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div slot="tip" class="el-upload__tip">
          <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据 -->
          <el-link type="info" style="font-size:12px;color: #1890ff;" @click="importTemplate">下载模板</el-link>
        </div>
        <div slot="tip" class="el-upload__tip" style="color:red">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listMeasureAappliance, getMeasureAappliance, delMeasureAappliance, addMeasureAappliance, updateMeasureAappliance, exportMeasureAappliance, importTemplate } from '@/api/map/measureAappliance'
import { listMerchant } from '@/api/map/merchant'
import { getToken } from '@/utils/auth'
export default {
  name: 'MeasureAappliance',
  data() {
    return {
      // 遮罩层
      loading: true,
      options: [],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 计量器具表格数据
      measureAapplianceList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 导入参数
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/map/measureAappliance/importData'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        merchant: undefined,
        name: undefined,
        model: undefined,
        factoryName: undefined,
        leaveNo: undefined,
        purpose: undefined,
        checkCase: undefined,
        validDate: undefined,
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
    this.remoteMethod()
  },
  methods: {
    remoteMethod(val) {
      console.log(val)
      listMerchant(
        { name: val || '' }
      ).then(response => {
        console.log(val)
        this.options = response.rows
      })
    },
    /** 查询计量器具列表 */
    getList() {
      this.loading = true
      listMeasureAappliance(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.measureAapplianceList = response.rows
        this.total = response.total
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
        merchant: undefined,
        name: undefined,
        model: undefined,
        factoryName: undefined,
        leaveNo: undefined,
        purpose: undefined,
        checkCase: undefined,
        validDate: undefined,
        remark: undefined,
        status: '0',
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
      this.dateRange = []
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
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加计量器具'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getMeasureAappliance(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改计量器具'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateMeasureAappliance(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addMeasureAappliance(this.form).then(response => {
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
      this.$confirm('是否确认删除计量器具编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMeasureAappliance(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有计量器具数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportMeasureAappliance(queryParams)
      }).then(response => {
        this.download(response.msg)
      }).catch(function() {})
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg)
      })
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    }
  }
}
</script>
