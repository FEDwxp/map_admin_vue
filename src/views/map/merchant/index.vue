<template>
  <div class="app-container">
    <div class="treelistbox">
      <el-tree v-show="treeFlag" class="treelist" node-key="id" :default-expanded-keys="[1]" :data="treeData" accordion :props="defaultProps" @node-click="handleNodeClick" />
      <i v-show="!treeFlag" class="el-icon-s-unfold iconshow" style="cursor: pointer;margin: 0 3px" @click="checkTree" />
      <i v-show="treeFlag" class="el-icon-s-fold iconshow" style="cursor: pointer;margin: 0 3px" @click="checkTree" />
    </div>
    <div v-show="treeFlag" class="treeline" />
    <div :class="{'treeGrid':treeFlag, 'treeGridclose':!treeFlag }">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="企业名称" prop="name">
          <el-input
          style="width: 240px"
            v-model="queryParams.name"
            placeholder="请输入企业名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="社会信用代码" prop="creditCode">
          <el-input
            v-model="queryParams.creditCode"
            placeholder="请输入统一社会信用代码"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item v-show="showqueryMore" label="法人代表" prop="legalPerson">
          <el-input
            v-model="queryParams.legalPerson"
            placeholder="请输入法人代表"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item v-show="showqueryMore" label="商圈" prop="businessRoundId">
          <el-cascader
            v-model="businessRoundId"
            :props="{ label: 'name', value: 'id', children: 'businessRounds'}"
            :options="businessRoundIdoptions"
            @change="businessRoundIdhandleChange"
          />
           </el-form-item>


        <el-form-item v-show="showqueryMore" label="成立日期">
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
        <el-form-item v-show="showqueryMore" label="经营状态" prop="operationStatus">
          <el-select v-model="queryParams.operationStatus"   placeholder="请选择经营状态" clearable size="small">
            <el-option
              v-for="item in operationList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="showqueryMore" label="特殊状态" prop="specialStatus">
          <el-select v-model="queryParams.specialStatus" placeholder="请选择特殊状态" clearable size="small">
            <el-option
              v-for="item2 in specialList"
              :key="item2.dictValue"
              :label="item2.dictLabel"
              :value="item2.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="showqueryMore" label="行业分类">
          <el-cascader
            ref="cascader"
            v-model="businessCategoryContent"
            placeholder="行业分类"
            :props="{ checkStrictly: true }"
            clearable
            :options="optionsBusinessCategory"
            @change="businessCategoryChange"
          />

        </el-form-item>

        <el-form-item v-show="showqueryMore" prop="showStatus">
          <el-checkbox    v-model="showStatusFlag" @change="showStatusChange">无经纬度数据</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          <span v-show="!showqueryMore" style="color: #4190F7;margin-left: 8px;cursor: pointer;" @click="()=> { this.showqueryMore = !this.showqueryMore }">展开<i class="el-icon-arrow-down" /></span>
          <span v-show="showqueryMore" style="color: #4190F7;margin-left: 8px;cursor: pointer;" @click="()=> { this.showqueryMore = !this.showqueryMore }">收起<i class="el-icon-arrow-up" /></span>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['map:merchant:add']"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['map:merchant:edit']"
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['map:merchant:remove']"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
          >删除</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button
            v-if="!ShowMore"
            type="success"
            icon="el-icon-circle-plus-outline"
            size="mini"
            @click="handleShowMore"
          >展示证书明细</el-button>
          <el-button
            v-if="ShowMore"
            type="success"
            icon="el-icon-remove-outline"
            size="mini"
            @click="handleShowMore"
          >收起证书明细</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-dropdown>
            <el-button type="info" size="mini">
              导入<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item >
                <span v-hasPermi="['system:user:import']" @click="handleImport">数据导入</span>
              </el-dropdown-item>
              <el-dropdown-item >
                <span v-hasPermi="['system:user:import']" @click="handleImportLongitude">经纬度导入</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            v-hasPermi="['system:user:import']"
            type="info"
            icon="el-icon-upload2"
            size="mini"
            @click="handleImportLongitude"
          >经纬度导入</el-button>
        </el-col> -->
        <el-col :span="1.5">
          <el-dropdown>
            <el-button type="info" size="mini">
              导出<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item >
                <span v-hasPermi="['system:user:import']" @click="handleExport(1)">导出当前页</span>
              </el-dropdown-item>
              <el-dropdown-item >
                <span v-hasPermi="['system:user:import']" @click="handleExport(2)">导出按条件</span>
              </el-dropdown-item>
               <el-dropdown-item >
                <span  @click="handleExport(3)">导出所有</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button
            v-hasPermi="['map:merchant:export']"
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport(1)"
          >导出当前页</el-button> -->
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            v-hasPermi="['map:merchant:export']"
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport(2)"
          >导出按条件</el-button>
        </el-col> -->
        <!-- <el-col :span="1.5">
          <el-button
            v-hasPermi="['map:merchant:export']"
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport(3)"
          >导出所有</el-button>
        </el-col> -->

      </el-row>
      <el-table v-loading="loading" :data="merchantList" @row-click="rowClick" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="所属商圈" align="center" prop="businessRoundName" /> -->
        <el-table-column
          label="序号"
          align="center"
          prop="excelNo"
          width="100px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="企业名称"
          align="center"
          prop="name"
          width="300px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="法人代表"
          align="center"
          prop="legalPerson"
          width="100px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="联系电话(对外)"
          align="center"
          prop="outPhone"
          width="150px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="详细地址"
          align="center"
          prop="address"
          width="300px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="经度"
          align="center"
          prop="longitude"
          width="150px"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="纬度"
          align="center"
          prop="latitude"
          width="150px"
          :show-overflow-tooltip="true"
        />
        <!-- <el-table-column label="成立日期" align="center" prop="merchantDate" width="140">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.merchantDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="区县" align="center" prop="countyName" />
        <el-table-column label="街道" align="center" prop="streetName" />
        <el-table-column label="社区" align="center" prop="communityName" />
        <el-table-column
          label="行业分类一级"
          align="center"
          prop="firstBusinessCategoryName"
          width="200px"
          :show-overflow-tooltip="true"/>
        <el-table-column
           label="行业分类二级"
           align="center"
           prop="secondBusinessCategoryName"
           width="150px"
           :show-overflow-tooltip="true"/>
        <el-table-column
          label="行业分类三级"
          align="center"
          prop="threeBusinessCategoryName"
          width="150px"
          :show-overflow-tooltip="true"/> -->
        <el-table-column
          label="经营状态"
          align="center"
          prop="operationStatus"
          :formatter="operationFormat"
          width="100"
        />
        <el-table-column
          label="特殊状态"
          align="center"
          prop="specialStatus"
          :formatter="specialFormat"
          width="100"
        />
        <!--  <el-table-column
          label="是否公开"
          align="center"
          prop="publicStatus"
          :formatter="publicFormat"
          width="100"
        /> -->
        <el-table-column label="操作" align="center" width="150" fixed="right" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['map:merchant:edit']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              v-hasPermi="['map:merchant:remove']"
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
      <el-tabs v-show="ShowMore" v-model="activeName" style="margin-top: 24px" @tab-click="handleClick">
        <el-tab-pane label="证书管理" name="first">
          <certificateList ref="certificateList" />
        </el-tab-pane>
        <el-tab-pane label="量具表" name="second">
          <measure ref="measure" />
        </el-tab-pane>
        <el-tab-pane label="商标" name="three">
          <brand ref="brand" />
        </el-tab-pane>
      </el-tabs>
      <!-- 添加或修改商家信息对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
        <div class="infoBox">
          <div class="info_title info_th">市场主体信息表</div>
          <div class="info_flex info_border_b info_border_l info_border_r">
            <div style="width: 16.6%" class="info_th ib info_border_r"><span class="must">*</span> 企业名称</div>
            <el-input v-model="form.name" style="width: 33.3%" class="ib info_border_r" placeholder="请输入内容" />
            <div style="width: 16.6%" class="info_th ib info_border_r">商圈</div>
            <el-cascader
              v-model="form.businessRoundId"
              :props="{ label: 'name', value: 'id', children: 'businessRounds'}"
              :options="businessRoundIdoptions"
              style="width: 32.6%"
              @change="businessRoundIdhandleChangeForm"
            />
            <!-- <el-select
              v-model="form.businessRoundId"
              placeholder="商圈"
              clearable
              size="small"
              style="width: 32.6%"
            >
              <el-option
                v-for="dict in businessRoundlist"
                :key="dict.key"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select> -->
          </div>
          <div class="info_flex info_border_b info_border_l info_border_r">
            <div style="width: 16.6%" class="info_th ib info_border_r"><span class="must">*</span>统一社会信用代码</div>
            <el-input v-model="form.creditCode" style="width: 33.3%" class="ib info_border_r" placeholder="请输入内容" />
            <div style="width: 16.6%" class="info_th ib info_border_r"><span class="must">*</span>法定代表人</div>
            <el-input v-model="form.legalPerson" style="width: 16.6%" class="ib" placeholder="请输入内容" />
          </div>
          <div class="info_flex info_border_b info_border_l info_border_r">
            <div style="width: 16.6%" class="info_th ib info_border_r">联系电话(对外)</div>
            <el-input v-model="form.outPhone" style="width: 16.7%" class="ib info_border_r" placeholder="请输入内容" />
            <div style="width: 16.6%" class="info_th ib info_border_r">联系电话(对内)</div>
            <el-input v-model="form.inPhone" style="width: 16.6%" class="ib info_border_r" placeholder="请输入内容" />
            <div style="width: 16.6%" class="info_th ib info_border_r">成立日期</div>
            <el-date-picker
              v-model="form.merchantDate"
              clearable
              size="small"
              style="width: 200px"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择成立日期"
            />
          </div>
          <div class="info_flex info_border_b info_border_l info_border_r">
            <div style="width: 16.6%" class="info_th ib info_border_r"><span class="must">*</span>选择区县、街道、社区</div>
            <el-cascader
              ref="cascader"
              v-model="countyCode"
              style="width: 83.4%"
              placeholder="选择区县、街道、社区"
              :props="{ checkStrictly: true }"
              clearable
              :options="treeData"
              @change="selCounty"
            />
          </div>
          <div class="info_flex info_border_b info_border_l info_border_r">
            <div style="width: 17%" class="info_th ib info_border_r"><span class="must">*</span>详细地址</div>
            <el-input v-model="form.address" style="width: 31%" class="ib" placeholder="请输入内容" />
            <i class="el-icon-location-information info_th info_border_r" style="padding: 10px 5px;cursor: pointer;" @click="getMap" />
            <div style="width: 12.5%" class="info_th ib info_border_r">经度</div>
            <el-input v-model="form.longitude" style="width: 12.5%" class="info_border_r" placeholder="请输入内容" />
            <div style="width: 12.5%" class="info_th ib info_border_r">纬度</div>
            <el-input v-model="form.latitude" style="width: 12.5%" placeholder="请输入内容" />
          </div>
          <div class="info_flex info_border_b info_border_l info_border_r">
            <div style="width: 16.6%" class="info_th ib info_border_r">行业分类</div>
            <el-cascader
              v-model="businessCategoryContent2"
              style="width: 83.4%"
              placeholder="行业分类"
              clearable
              :options="optionsBusinessCategory"
              @change="businessCategoryChange2"
            />
          </div>
          <div class="info_flex info_border_b info_border_l info_border_r">
            <div style="width: 16.6%" class="info_th ib info_border_r"><span class="must">*</span>经营状态</div>
            <el-select
              v-model="form.operationStatus"
              placeholder="经营状态"
              clearable
              class="ib info_border_r"
              size="small"
              style="width: 16.6%"
            >
              <el-option
                v-for="(item, index) in operationList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
            <div style="width: 16.6%" class="info_th ib info_border_r"><span class="must">*</span>特殊状态</div>
            <el-select v-model="form.specialStatus" style="width: 16.6%" class="ib info_border_r" placeholder="请选择特殊状态" clearable size="small">
              <el-option
                v-for="item2 in specialList"
                :key="item2.dictValue"
                :label="item2.dictLabel"
                :value="item2.dictValue"
              />
            </el-select>
            <div style="width: 16.6%" class="info_th ib info_border_r">用工人数</div>
            <el-input v-model="form.workerNum" style="width: 16.6%" class="ib" placeholder="请输入内容" />
          </div>
          <div class="info_flex info_border_b info_border_l info_border_r">
            <div style="width: 16.6%" class="info_th ib info_border_r">经营范围</div>
            <el-input v-model="form.operationRange" style="width: 33.2%;" class="ib info_border_r" placeholder="请输入内容" />
            <div style="width: 16.6%" class="info_th ib info_border_r">是否在平台公开</div>
            <el-select v-model="form.publicStatus" style="width: 33.4%" placeholder="请选择是否在平台公开" clearable size="small">
              <el-option
                v-for="item3 in publicList"
                :key="item3.dictValue"
                :label="item3.dictLabel"
                :value="item3.dictValue"
              />
            </el-select>
          </div>
          <div class="info_flex info_border_b info_border_l info_border_r">
            <div style="width: 16.6%" class="info_border_r biaozhun">标准化相关服务</div>
            <div class="ib" style="width: 83.4%">
              <div style="width: 100%">
                <div style="width: 20%" class="info_th ib info_border_r info_border_b">企业成产产品名称</div>
                <el-input v-model="form.productName" style="width: 79%" class="ib info_border_b" placeholder="请输入内容" />
              </div>
              <div style="width: 100%">
                <div style="width: 20%" class="info_th ib info_border_r">执行标准编号</div>
                <el-input v-model="form.standardNo" style="width: 79%" class="ib" placeholder="请输入内容" />
              </div>
            </div>
          </div>
          <div class="info_flex info_border_b info_border_l info_border_r">
            <div style="width: 16.6%" class="info_th ib info_border_r">图片</div>
            <div style="width: 83.4%" class="info_th ib">
              <el-upload
                action="/dev-api/common/upload"
                :headers="headers"
                :before-upload="beforeAvatarUpload"
                list-type="picture-card"
                :file-list="filelist"
                :on-success="handleAvatarSuccess"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </div>
          </div>
          <div class="info_flex info_border_b info_border_l info_border_r">
            <div style="width: 16.6%" class="info_th ib">企业简介</div>
          </div>
          <div>
            <Editor v-model="form.detail" />
          </div>
        </div>
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

      <!-- 经纬度导入对话框 -->
      <el-dialog :title="longitudeUpload.title" :visible.sync="longitudeUpload.open" width="400px" append-to-body>
        <el-upload
          ref="longitudeUpload"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="longitudeUpload.headers"
          :action="longitudeUpload.url + '?updateSupport=' + longitudeUpload.updateSupport"
          :disabled="longitudeUpload.isUploading"
          :on-progress="handleFileLongitudeUploadProgress"
          :on-success="handleFileLongitudeSuccess"
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
            <el-link type="info" style="font-size:12px;color: #1890ff;" @click="importTemplateLongitude">下载模板</el-link>
          </div>
          <div slot="tip" class="el-upload__tip" style="color:red">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitLongitudeFileForm">确 定</el-button>
          <el-button @click="longitudeUpload.open = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="'定位'" :visible.sync="showMap" width="80%" append-to-body>
        <iframe
          ref="myframe"
          src="/html/map.html"
          frameborder="0"
          style="width: 100%;
          height: 500px;
          z-index: 25;
          margin-top: 0px;
          margin-right: 10px;
          margin-left: 10px;
          margin-bottom: 10px;"
          @load="loaded"
        />
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitMap">确 定</el-button>
          <el-button @click="cancelmap">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { listMerchant, getMerchant, delMerchant, disCode, addMerchant, updateMerchant, exportMerchant, merchantimportTemplate, merchantimportLongitudeTemplate } from '@/api/map/merchant'
import { allDistrict } from '@/api/map/district'
import { listBusinessRoundtree, listBusinessRound } from '@/api/map/businessRound'
import { listBusinessCategory } from '@/api/map/businessCategory'
import { getToken } from '@/utils/auth'
import Editor from '@/components/Editor'
import certificateList from './table_modules/certificateList'
import measure from './table_modules/measure'
import brand from './table_modules/brand'

listBusinessCategory
export default {
  name: 'Merchant',
  components: {
    Editor,
    certificateList,
    measure,
    brand
  },
  data() {
    return {
      treeFlag: false,
      ShowMore: false,
      showqueryMore: false,
      businessRoundId: undefined,
      businessRoundIdoptions: [], // 商圈树参数
      activeName: 'first',
      countyCode: [''], // 街道假
      businessCategoryContent: [], // 分类假
      businessCategoryContent2: [], // 分类2假
      // 日期范围
      dateRange: [],
      // 数据导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/map/merchant/importData'
      },
      // 经纬度导入参数
      longitudeUpload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/map/merchant/importLongitudeData'
      },
      treeData: [],
      treeDatas: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      imageUrl: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      optionsBusinessCategory: [],
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 商家信息表格数据
      merchantList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示地图弹出层
      showMap: false,
      // 是否选中无经纬度数据
      showStatusFlag: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        businessRoundId: undefined,
        name: undefined,
        creditCode: undefined,
        legalPerson: undefined,
        inPhone: undefined,
        outPhone: undefined,
        merchantDate: undefined,
        countyCode: undefined,
        streetCode: undefined,
        communityCode: undefined,
        address: undefined,
        longitude: undefined,
        latitude: undefined,
        firstBusinessCategory: undefined,
        secondBusinessCategory: undefined,
        threeBusinessCategory: undefined,
        operationStatus: undefined,
        specialStatus: undefined,
        workerNum: undefined,
        operationRange: undefined,
        publicStatus: undefined,
        productName: undefined,
        standardNo: undefined,
        detail: undefined,
        pictureOne: undefined,
        pictureTwo: undefined,
        excelNo: undefined,
        deleted: undefined,
        exportStatus: 1,
        showStatus: 0
      },
      currentId: '',
      // 表单参数
      form: {},
      mapCenter: '',
      // 表单校验
      rules: {
      },
      // 经营状态数据字典
      operationList: [],
      // 特殊状态数据字典
      specialList: [],
      // 是否公开数据字典
      publicList: [],
      filelist: [],
      businessRoundlist: []
    }
  },
  created() {
    this.getAllDistrict()
    this.getListBusinessCategory()
    this.getlistBusinessRound()
    // this.rrrrr()
    // 字典 经营状态
    this.getDicts('map_operation_status').then(response => {
      this.operationList = response.data
    })
    // 特殊状态
    this.getDicts('map_special_status').then(response => {
      this.specialList = response.data
    })
    // 是否公开
    this.getDicts('map_public_status').then(response => {
      this.publicList = response.data
    })
    this.getList()
  },
  mounted() {
    window.addEventListener('message', this.hendMessage)
    // window.addEventListener('message', (event) => {
    //   const data = event.data
    //   this.mapCenter = data
    //   // this.closeSelf();
    // }, false);
  },
  methods: {
    getMap() {
      this.showMap = true
    },
    loaded() {
      // 只有在 iframe 加载时传递数据给子组件，$refs 才是非空的
      this.$refs.myframe.contentWindow.postMessage({
        type: 'myData',
        data: this.form
      }, '*')
    },
    // closeSelf() { // 关闭当前弹框
    //   this.$emit('closeIframe');
    // },
    cancelmap() {
      this.mapCenter = ''
      this.showMap = false
    },
    businessRoundIdhandleChange(val) {
      console.log(val)
      if (!val) return
      this.queryParams.businessRoundId = val[1]
    },
    businessRoundIdhandleChangeForm(val) {
      console.log(val)
      if (!val) return
      this.form.businessRoundId = val[1]
    },
    submitMap() {
      if (!this.mapCenter) {
        return
      }
      this.form.longitude = this.mapCenter.result.split(',')[0]
      this.form.latitude = this.mapCenter.result.split(',')[1]
      this.showMap = false
    },
    handleShowMore() {
      this.ShowMore = !this.ShowMore
    },
    checkTree() {
      this.treeFlag = !this.treeFlag
    },
    // 商圈查询赋值
    getlistBusinessRound() {
      listBusinessRoundtree()
        .then(response => {
          console.log('222', response.data)
          this.businessRoundIdoptions = response.data
          // response.rows.forEach(element => {
          //   this.businessRoundlist.push({ key: element.id, value: element.id, label: element.name })
          // })
        })
        .catch((response) => {
          console.log('失败', response)
        })
    },
    // rrrrr() {
    //   listBusinessRound()
    //     .then(response => {
    //       console.log('34234235', response);
    //     })
    //     .catch((response) => {
    //       console.log('失败', response)
    //     })
    // },
    // 经营状态
    operationFormat(row, column) {
      return this.selectDictLabel(this.operationList, row.operationStatus)
    },
    // 特殊状态
    specialFormat(row, column) {
      return this.selectDictLabel(this.specialList, row.specialStatus)
    },
    // 是否公开
    publicFormat(row, column) {
      return this.selectDictLabel(this.publicList, row.publicStatus)
    },
    // 选择新增区县赋值
    selCounty(val) {
      console.log(val)
      if (!val) return
      this.form.countyCode = val[1] ? val[1] : undefined
      this.form.streetCode = val[2] ? val[2] : undefined
      this.form.communityCode = val[3] ? val[3] : undefined
    },
    businessCategoryChange2(val) {
      if (!val) return
      this.form.firstBusinessCategory = val[0]
      this.form.secondBusinessCategory = val[1]
      this.form.threeBusinessCategory = val[2]
    },
    // 分类选择查询赋值
    businessCategoryChange(val) {
      console.log(2)
      if (!val) return
      // this.form.countyCode = val[1] ? val[1] : undefined
      // this.form.streetCode = val[2] ? val[2] : undefined
      // this.form.communityCode = val[3] ? val[3] :undefined

      this.queryParams.firstBusinessCategory = val[0] ? val[0] : undefined
      this.queryParams.secondBusinessCategory = val[1] ? val[1] : undefined
      this.queryParams.threeBusinessCategory = val[2] ? val[2] : undefined

      // this.queryParams.firstBusinessCategory = val[0]
      // this.queryParams.secondBusinessCategory = val[1]
      // this.queryParams.threeBusinessCategory = val[2]
    },
    // 表格切换
    handleClick(tab, event) {
      if (this.activeName === 'first') {
        this.$refs.certificateList.getList(this.currentId)
      } else if (this.activeName === 'second') {
        this.$refs.measure.getList(this.currentId)
      } else if (this.activeName === 'three') {
        this.$refs.brand.getList(this.currentId)
      }
    },
    // 点击行
    rowClick(val) {
      this.currentId = val.id
      if (this.activeName === 'first') {
        this.$refs.certificateList.getList(this.currentId)
      } else if (this.activeName === 'second') {
        this.$refs.measure.getList(this.currentId)
      } else if (this.activeName === 'three') {
        this.$refs.brand.getList(this.currentId)
      }
    },
    beforeAvatarUpload(file) {
      if (this.imageUrl.length > 2) {
        this.$message.error('最多上传两张照片!')
        return false
      }
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2
      // if (!isJPG) {
      //   this.$message.error('上传图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleAvatarSuccess(res, file, fileList) {
      this.imageUrl = fileList
      console.log(this.imageUrl)
      if (this.imageUrl && this.imageUrl.length === 1) {
        this.form.pictureOne = this.imageUrl[0].response ? this.imageUrl[0].response.url : this.imageUrl[0].url
        this.form.pictureTwo = ''
      }
      if (this.imageUrl && this.imageUrl.length === 2) {
        this.form.pictureOne = this.imageUrl[0].response ? this.imageUrl[0].response.url : this.imageUrl[0].url
        this.form.pictureTwo = this.imageUrl[1].response ? this.imageUrl[1].response.url : this.imageUrl[1].url
      }
      if (!this.imageUrl || this.imageUrl.length === 0) {
        this.form.pictureOne = ''
        this.form.pictureTwo = ''
      }
    },
    handleRemove(file, fileList) {
      this.imageUrl = fileList
      if (this.imageUrl && this.imageUrl.length === 1) {
        this.form.pictureOne = this.imageUrl[0].response ? this.imageUrl[0].response.url : this.imageUrl[0].url
        this.form.pictureTwo = ''
      }
      if (this.imageUrl && this.imageUrl.length === 2) {
        this.form.pictureOne = this.imageUrl[0].response ? this.imageUrl[0].response.url : this.imageUrl[0].url

        this.form.pictureTwo = this.imageUrl[1].response ? this.imageUrl[1].response.url : this.imageUrl[1].url
      }
      if (this.imageUrl.length === 0) {
        this.form.pictureOne = ''
        this.form.pictureTwo = ''
      }
      console.log(fileList, this.form)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 树节点点击
    handleNodeClick(data) {
      switch (data.level) {
        case 1:
          // 区县
          this.queryParams.countyCode = data.code
          this.queryParams.streetCode = undefined
          this.queryParams.communityCode = undefined
          break
        case 2:
          // 街道
          this.queryParams.countyCode = undefined
          this.queryParams.communityCode = undefined
          this.queryParams.streetCode = data.code
          break
        case 3:
          // 社区
          this.queryParams.countyCode = undefined
          this.queryParams.streetCode = undefined
          this.queryParams.communityCode = data.code
          break
        default:
          this.queryParams.countyCode = undefined
          this.queryParams.streetCode = undefined
          this.queryParams.communityCode = undefined
          break
      }
      this.getList()
    },
    // 处理当前街道社区的lable
    getTree(data) {
      for (var i = 0; i < data.length; i++) {
        data[i].label = data[i].name
        data[i].value = data[i].code
        delete data[i].name
        if (data[i].children) {
          this.getTree(data[i].children)
        }
      }
    },
    // 处理行业分类
    getBusinessCategory(data) {
      for (var i = 0; i < data.length; i++) {
        data[i].label = data[i].name
        data[i].value = data[i].code
        delete data[i].name
        delete data[i].code
        if (data[i].children) {
          this.getBusinessCategory(data[i].children)
        }
      }
    },
    // 行业分类
    getListBusinessCategory() {
      listBusinessCategory()
        .then(response => {
          console.log(response)
          this.getBusinessCategory(response.data.root)
          this.optionsBusinessCategory = response.data.root
        })
        .catch((response) => {
          console.log('失败', response)
        })
    },
    getAllDistrict() {
      allDistrict()
        .then(response => {
          this.getTree(response.data.root)
          this.treeData = [{
            value: '',
            label: '七台河市',
            children: response.data.root
          }]
          console.log(this.treeData)
        })
        .catch((response) => {
          console.log('失败', response)
        })
    },
    hendMessage(event) {
      const data = event.data
      this.mapCenter = data
    },
    /** 查询商家信息列表 */
    getList() {
      this.loading = true
      listMerchant(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.merchantList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '数据导入'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      merchantimportTemplate().then(response => {
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
        businessRoundId: undefined,
        name: undefined,
        creditCode: undefined,
        legalPerson: undefined,
        inPhone: undefined,
        outPhone: undefined,
        merchantDate: undefined,
        countyCode: undefined,
        streetCode: undefined,
        communityCode: undefined,
        address: undefined,
        longitude: undefined,
        latitude: undefined,
        firstBusinessCategory: undefined,
        secondBusinessCategory: undefined,
        threeBusinessCategory: undefined,
        operationStatus: undefined,
        specialStatus: undefined,
        workerNum: undefined,
        operationRange: undefined,
        publicStatus: undefined,
        productName: undefined,
        standardNo: undefined,
        detail: undefined,
        pictureOne: undefined,
        pictureTwo: undefined,
        excelNo: undefined,
        createTime: undefined,
        updateTime: undefined,
        updateBy: undefined,
        createBy: undefined,
        deleted: undefined
      }
      this.countyCode = undefined
      this.businessCategoryContent2 = undefined
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
      this.businessRoundId = undefined
      this.queryParams.countyCode = undefined
      this.queryParams.streetCode = undefined
      this.queryParams.businessRoundId = undefined
      this.queryParams.communityCode = undefined
      this.queryParams.firstBusinessCategory = undefined
      this.queryParams.secondBusinessCategory = undefined
      this.queryParams.threeBusinessCategory = undefined
      this.businessCategoryContent = undefined
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
      if (this.queryParams.countyCode || this.queryParams.streetCode || this.queryParams.communityCode) {
        // this.countyCode = response.data.communityCode  || response.data.streetCode || response.data.countyCode || ''
        this.countyCode = this.queryParams.communityCode || this.queryParams.streetCode || this.queryParams.countyCode || ''

        // disCode(this.queryParams.countyCode || this.queryParams.streetCode || this.queryParams.communityCode).then(response => {
        // this.countyCode = response.data.communityCode  || response.data.streetCode || response.data.countyCode || ''
        //   // this.countyCode = ['', response.data.oneCode ? response.data.oneCode :  '', response.data.twoCode ? response.data.twoCode : '', response.data.threeCode ? response.data.threeCode : '']
        //   // this.$refs['cascader'].focusFirstNode();
        // })
      }
      // console.log(this.queryParams.countyCode,
      //     this.queryParams.streetCode,
      //     this.queryParams.communityCode);
      this.open = true
      this.title = '添加商家信息'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getMerchant(id).then(response => {
        if (response.data.pictureOne && response.data.pictureTwo) {
          this.filelist = [{ name: '照片1', url: response.data.pictureOne }, { name: '照片2', url: response.data.pictureTwo }]
        } else if (response.data.pictureOne) {
          this.filelist = [{ name: '照片1', url: response.data.pictureOne }]
        } else {
          this.filelist = []
        }
        this.form = response.data
        this.form.operationStatus = response.data.operationStatus + ''
        this.form.specialStatus = response.data.specialStatus + ''
        this.form.publicStatus = response.data.publicStatus + ''
        this.businessCategoryContent2 = [response.data.firstBusinessCategory, response.data.secondBusinessCategory, response.data.threeBusinessCategory]
        // this.countyCode = ['', response.data.countyCode ? response.data.countyCode : '', response.data.streetCode ? response.data.streetCode :  '', response.data.communityCode ? response.data.communityCode : '']
        this.countyCode = response.data.communityCode || response.data.streetCode || response.data.countyCode || ''
        console.log(this.countyCode)
        this.title = '修改商家信息'
        this.open = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      console.log(this.form)
      if (!this.form.name) {
        this.msgError('企业民称不能为空')
        return
      } else if (!this.form.creditCode) {
        this.msgError('统一社会信用代码不能为空')
        return
      } else if (!this.form.legalPerson) {
        this.msgError('法定代表人不能为空')
        return
      } else if (!this.countyCode) {
        this.msgError('法定代表人不能为空')
        return
      } else if (!this.form.address) {
        this.msgError('详细地址不能为空')
        return
      } else if (!this.form.operationStatus) {
        this.msgError('经营状态不能为空')
        return
      } else if (!this.form.specialStatus) {
        this.msgError('经营状态不能为空')
        return
      }

      if (this.form.id != undefined) {
        updateMerchant(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess('修改成功')
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
      } else {
        addMerchant(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess('新增成功')
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$confirm('是否确认删除商家信息编号为"' + ids + '"的数据项,同时会删除证书、商标和计量器具?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMerchant(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    },
    /** 导出按钮操作 */
    handleExport(estatus) {
      var evalue = '是否确认导出当前页商家信息?'

      if (estatus == '2') {
        evalue = '是否确认按条件导出商家信息?'
      }
      if (estatus == '3') {
        evalue = '是否确认导出全部商家信息?'
      }
      this.queryParams.exportStatus = estatus
      const queryParams = this.queryParams
      this.$confirm(evalue, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return exportMerchant(queryParams)
      }).then(response => {
        this.download(response.msg)
      }).catch(function() {})
    },
    /** 导入经纬度按钮操作 */
    handleImportLongitude() {
      this.longitudeUpload.title = '经纬度导入'
      this.longitudeUpload.open = true
    },
    /** 下载经纬度模板操作 */
    importTemplateLongitude() {
      merchantimportLongitudeTemplate().then(response => {
        this.download(response.msg)
      })
    },
    // 文件经纬度上传中处理
    handleFileLongitudeUploadProgress(event, file, fileList) {
      this.longitudeUpload.isUploading = true
    },
    // 文件经纬度上传成功处理
    handleFileLongitudeSuccess(response, file, fileList) {
      this.longitudeUpload.open = false
      this.longitudeUpload.isUploading = false
      this.$refs.longitudeUpload.clearFiles()
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitLongitudeFileForm() {
      this.$refs.longitudeUpload.submit()
    },
    showStatusChange() {
      if (this.showStatusFlag) {
        this.queryParams.showStatus = 1
      } else {
        this.queryParams.showStatus = 0
      }
      this.queryParams.pageNum = 1
      this.getList()
    }
  }
}
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
    width: 85%;
    margin-left: 24px;
  }
  .treeGridclose {
    width: 98%;
  }
  .iconshow {
    position: absolute;
    right: 0;
    top: 0;
  }
  .treelistbox {
    width: 15%;
    overflow: auto;
    max-height: 700px;
    position: relative;
  }
  .treelist {
    margin-right: 15px;
  }
  .treeline {
    width: 1px;
    // background: #eee;
  }
</style>
<style>
.el-message-box__message p {
    margin: 0;
    line-height: 24px;
    max-height: 800px;
    overflow: scroll;
}
</style>
