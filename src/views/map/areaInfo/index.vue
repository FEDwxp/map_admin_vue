<template>
  <div class="app-container">
    <el-tree class="treelist" :data="treeData" node-key="id" :default-expanded-keys="[1]" :props="defaultProps" @node-click="handleNodeClick"  />
    <div class="treeline" />
    <div class="treeGrid">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
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
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['map:areaInfo:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
              v-hasPermi="['map:areaInfo:edit']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['map:areaInfo:remove']"
            >删除</el-button>
          </el-col>
<!--          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['map:areaInfo:export']"
            >导出</el-button>
          </el-col> -->
        </el-row>
        <el-table v-loading="loading" :data="areaInfoList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="名称" align="center" prop="name" />
          <el-table-column
            label="分类"
            align="center"
            prop="type"
            :formatter="typeFormat"
            :show-overflow-tooltip="true"
          />
          <!-- <el-table-column label="介绍" align="center" prop="detal" /> -->
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['map:areaInfo:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['map:areaInfo:remove']"
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
        <!-- 添加或修改区域划分信息对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="分类" prop="type">
              <el-select style="width: 100%" v-model="form.type" placeholder="分类" clearable size="small">
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="介绍" prop="detal">
              <el-input v-model="form.detal" type="textarea" placeholder="请输入内容" />
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
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              <!-- <el-input v-model="form.picture" placeholder="请输入图片" /> -->
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
    </div>
  </div>
</template>

<script>
import { listAreaInfo, getAreaInfo, delAreaInfo, addAreaInfo, updateAreaInfo, exportAreaInfo } from "@/api/map/areaInfo";
import { allDistrict } from '@/api/map/district'
import { getToken } from '@/utils/auth'

export default {
  name: "AreaInfo",
  data() {
    return {
      imageUrl: [],
      fileList: [],
      headers: {
				Authorization: 'Bearer ' + getToken()
      },
      // 树列表
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
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
      // 区域划分信息表格数据
      areaInfoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 区域分类数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        type: undefined,
        geojson信息: undefined,
        detal: undefined,
        picture: undefined,
        status: undefined,
        deleted: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts('map_area_type').then(response => {
      this.typeOptions = response.data
       this.getTree(response.data)
        // this.treeData = response.data.root
        this.treeData = [{
          label: '分类',
          id: 1,
          children: response.data
        }]
    })
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
    },
    // 处理当前街道社区的lable
    getTree(data) {
      for (var i = 0; i < data.length; i++) {
        data[i].label = data[i].dictLabel
        data[i].value = data[i].dictValue
        if (data[i].children) {
          this.getTree(data[i].children)
        }
      }
    },
    // 树节点点击
    handleNodeClick(data) {
      console.log(data.dictValue);
      if (data.dictValue) {
        this.queryParams.type = data.dictValue
      } else {
        this.queryParams.type = ''
      }
      this.getList()
    },
    /** 查询区域划分信息列表 */
    getList() {
      this.loading = true;
      listAreaInfo(this.queryParams).then(response => {
        this.areaInfoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        type: undefined,
        geojson信息: undefined,
        detal: undefined,
        picture: undefined,
        status: "0",
        createTime: undefined,
        updateTime: undefined,
        updateBy: undefined,
        createBy: undefined,
        deleted: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 区域分类字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type)
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加区域划分信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAreaInfo(id).then(response => {
        this.form = response.data;
        if (response.data.picture) {
          this.fileList = [{name: '照片1', url: response.data.picture }]
        } else {
          this.fileList = []
        }
        this.open = true;
        this.title = "修改区域划分信息";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateAreaInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addAreaInfo(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除区域划分信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAreaInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有区域划分信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAreaInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-dialog__body {
    overflow: scroll;
    max-height: 700px;
  }
  .infoBox {
    width: 100%;
  }
  .biaozhun {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /deep/ .el-tabs__content {
    overflow: scroll !important;
  }
  /deep/ .infoBox  input {
      border: 0 !important;
  }
  .info_border_l {
    border-left: 1px solid #eee;
  }
  .info_border_r {
    border-right: 1px solid #eee;
  }
  .info_border_b {
    border-bottom: 1px solid #eee;
  }
  .must {
    color: rgb(219, 35, 35);
  }
  .info_title {
    border: 1px solid #eee;
  }
  .info_flex {
    display: flex;
  }
  .info_th {
    padding: 10px 0;
    text-align: center;
  }
  .ib {
    display: inline-block !important;
  }
  .app-container {
    display: flex;
  }
  .treeGrid {
    width: 90%;
    margin-left: 24px;
  }
  .treelist {
    width: 15%;
    margin-right: 15px;
  }
  .treeline {
    width: 1px;
    background: #eee;
  }
</style>


