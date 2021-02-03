<!--
 * @Author: your name
 * @Date: 2020-08-25 14:23:37
 * @LastEditTime: 2020-09-07 19:44:21
 * @LastEditors: Please set LastEditors
 * @Description: 证书info
 * @FilePath: /show-admin-supervise/src/views/map/merchant/table_modules/certificateList.vue
-->
<template>
  <div>
      <el-table v-loading="loading" :data="data">
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
      <!-- <el-table-column
        label="生产厂家"
        align="center"
        prop="factoryName"
        :show-overflow-tooltip="true"
      /> -->
      <el-table-column label="出厂编号" align="center" prop="leaveNo" />
      <el-table-column
        label="用途"
        align="center"
        prop="purpose"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column label="检定情况" align="center" prop="checkCase" /> -->
      <el-table-column label="有效期" align="center" prop="validDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.validDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
     <!-- <el-table-column
        label="备注"
        align="center"
        prop="remark"
        :show-overflow-tooltip="true"
      /> -->
      </el-table>
      <!-- <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      /> -->
  </div>
</template>

<script>

import { listMeasureAappliance } from '@/api/map/measureAappliance'

export default {
    data () {
        return {
            data: [],
            total: 0,
            loading: false,
            queryParams: {
                pageNum: 1,
                pageSize: 50
            }
        }
    },
    methods: {
        getList (val) {
            this.loading = true
            this.queryParams.merchant = val
            listMeasureAappliance(this.queryParams).then(response => {
                this.data = response.rows
                this.total = response.total
                this.loading = false
            })
            .catch((response) => {
                console.log('失败', response);
            })
        }
    }
}
</script>

<style>

</style>
