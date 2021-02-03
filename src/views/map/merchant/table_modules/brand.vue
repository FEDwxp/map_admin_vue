<!--
 * @Author: your name
 * @Date: 2020-08-25 14:23:37
 * @LastEditTime: 2020-09-07 19:44:37
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
        label="商标名称"
        align="center"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="商标注册号"
        align="center"
        prop="registerNo"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="商标注册企业"
        align="center"
        prop="registerEnterprise"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="申请人" align="center" prop="applicant" />
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="申请人地址" align="center" prop="address" />
      <el-table-column label="注册日期" align="center" prop="registerDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.registerDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
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

import { listBrandRegister } from '@/api/map/brandRegister'

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
            listBrandRegister(this.queryParams).then(response => {
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