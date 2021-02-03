<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="商圈名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入商圈名称" />
      </el-form-item>
     <el-form-item label="区县" prop="countyCode">
       <el-select v-model="queryParams.countyCode" placeholder="区县" clearable size="small">
         <el-option
           v-for="item in countyCodeList"
           :key="item.dictValue"
           :label="item.dictLabel"
           :value="item.dictValue"
         />
       </el-select>
     </el-form-item>
      <!-- <el-form-item label="经度" prop="longitude">
        <el-input
          v-model="queryParams.longitude"
          placeholder="请输入经度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input
          v-model="queryParams.latitude"
          placeholder="请输入纬度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="图片" prop="picture">
        <el-input
          v-model="queryParams.picture"
          placeholder="请输入图片"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="删除标志" prop="deleted">
        <el-input
          v-model="queryParams.deleted"
          placeholder="请输入删除标志"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['map:businessRound:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['map:businessRound:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['map:businessRound:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['map:businessRound:export']"
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="businessRoundList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      
      <el-table-column
        label="商圈ID"
        align="center"
        prop="id"
        :show-overflow-tooltip="true"
      />
      
      <el-table-column
        label="商圈名称"
        align="center"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="区县"
        align="center"
        prop="countyCode"
        :formatter="countyCodeFormat"
        width="100"
      />


      <el-table-column
        label="详细地址"
        align="center"
        prop="address"
        :show-overflow-tooltip="true"
      />
      <!--      <el-table-column label="经度" align="center" prop="longitude" />
      <el-table-column label="纬度" align="center" prop="latitude" /> -->
<!--      <el-table-column
        label="介绍"
        align="center"
        prop="detal"
        :show-overflow-tooltip="true"
      /> -->
      <!-- <el-table-column label="图片" align="center" prop="picture" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['map:businessRound:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['map:businessRound:remove']"
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

    <!-- 添加或修改商圈对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="40%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商圈名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商圈名称" style="width: 300px;"/>
        </el-form-item>

        <el-form-item label="区县" prop="countyCode">
          <el-select
            v-model="form.countyCode"
            placeholder="区县"
            clearable
            class="ib info_border_r"
            size="small"
            style="width: 16.6%"
          >
            <el-option
              v-for="(item, index) in countyCodeList"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item style="position: relative;" label="详细地址" prop="address">
          <el-input v-model="form.address" type="textarea" placeholder="请输入内容" style="width: 300px;"/>
          <i @click="getMap" class="el-icon-location-information info_th info_border_r" style="padding: 10px 5px;cursor: pointer;    position: absolute;
    left: 270px;
    top: 6px;"></i>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="form.longitude" placeholder="请输入经度" style="width: 300px;"/>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="form.latitude" placeholder="请输入纬度" style="width: 300px;"/>
        </el-form-item>
        <el-form-item label="图片" prop="picture">
          <el-upload
            class="upload-demo"
            action="/dev-api/common/upload"
            :headers="headers"
            :on-success="handleAvatarSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :limit="1"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件<!-- ，且不超过500kb --></div>
          </el-upload>
          <!-- <el-input v-model="form.picture" placeholder="请输入图片" /> -->
        </el-form-item>
        <el-form-item label="介绍" prop="detal">
          <Editor v-model="form.detal" />
          <!-- <el-input v-model="form.detal" type="textarea" placeholder="请输入内容" /> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: 20px;">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'定位'" :visible.sync="showMap" width="80%" append-to-body>
        <iframe
          src="/html/map.html"
          frameborder="0"
          @load="loaded"
          ref="myframe"
          style="width: 100%;
          height: 500px;
          z-index: 25;
          margin-top: 0px;
          margin-right: 10px;
          margin-left: 10px;
          margin-bottom: 10px;"
          />
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitMap">确 定</el-button>
          <el-button @click="cancelmap">取 消</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { listBusinessRound, getBusinessRound, delBusinessRound, addBusinessRound, updateBusinessRound, exportBusinessRound } from '@/api/map/businessRound'
import Editor from '@/components/Editor';
import { getToken } from '@/utils/auth'

export default {
  name: 'BusinessRound',
    components: {
      Editor
    },
  data() {
    return {
      fileList: [],
      headers: {
				Authorization: 'Bearer ' + getToken()
      },
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
      // 商圈表格数据
      businessRoundList: [],
      // 弹出层标题
      title: '',
      showMap: false,
      // 是否显示弹出层
      open: false,
      mapCenter: '',
      imageUrl: [],
      //区县字典
      countyCodeList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        address: undefined,
        longitude: undefined,
        latitude: undefined,
        status: undefined,
        detal: undefined,
        picture: undefined,
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
   // 字典 区县
    this.getDicts('map_county_code').then(response => {
      this.countyCodeList = response.data
    })
    this.getList()
  },
  mounted() {
    window.addEventListener('message', this.hendMessage)
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file, fileList) {
      this.imageUrl = fileList
      if (this.imageUrl && this.imageUrl.length > 0) {
        this.form.picture = this.imageUrl[0].response.url
      }
      if (!this.imageUrl || this.imageUrl.length === 0) {
        this.form.picture = ''
      }
    },
    handleRemove(file, fileList) {
      this.imageUrl = fileList
      if (this.imageUrl.length === 0) {
        this.form.picture = ''
      }
      console.log(fileList, this.form)
    },

    /** 查询商圈列表 */
    getList() {
      this.loading = true
      listBusinessRound(this.queryParams).then(response => {
        this.businessRoundList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    loaded() {
      // 只有在 iframe 加载时传递数据给子组件，$refs 才是非空的
      this.$refs.myframe.contentWindow.postMessage({
        type: 'myData',
        data: this.form,
      }, '*');
    },
    cancelmap () {
      this.mapCenter = ''
      this.showMap = false
    },
    hendMessage(event) {
      const data = event.data
      this.mapCenter = data
    },
    submitMap () {
      if (!this.mapCenter) {
        return
      }
      this.form.longitude = this.mapCenter.result.split(',')[0]
      this.form.latitude = this.mapCenter.result.split(',')[1]
      this.showMap = false
    },
      // 区县
    countyCodeFormat(row, column) {
      return this.selectDictLabel(this.countyCodeList, row.countyCode)
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        address: undefined,
        longitude: undefined,
        latitude: undefined,
        status: '0',
        detal: undefined,
        picture: undefined,
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
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加商圈'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBusinessRound(id).then(response => {
        this.form = response.data
        if (response.data.picture) {
          this.fileList = [{name: '照片1', url: response.data.picture }]
        } else {
          this.fileList = []
        }
        this.open = true
        this.title = '修改商圈'
      })
    },
    getMap () {
      this.showMap = true
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateBusinessRound(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addBusinessRound(this.form).then(response => {
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
      this.$confirm('是否确认删除商圈编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delBusinessRound(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有商圈数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportBusinessRound(queryParams)
      }).then(response => {
        this.download(response.msg)
      }).catch(function() {})
    }
  }
}
</script>
