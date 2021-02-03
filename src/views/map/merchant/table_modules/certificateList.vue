<!--
 * @Author: your name
 * @Date: 2020-08-25 14:23:37
 * @LastEditTime: 2020-09-07 19:44:28
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
        label="关联证书"
        align="center"
        prop="cerCode"
        :formatter="certificateFormat"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="有效期" align="center" prop="validDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.validDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
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

import { listCertificate } from '@/api/map/certificate'

export default {
    data () {
        return {
            data: [],
            total: 0,
            loading: false,
            queryParams: {
                pageNum: 1,
                pageSize: 50
            },
            certificateOptions: [ ]
        }
    },
    created () {
        this.getDicts('map_certificate_options').then(response => {
            this.certificateOptions = response.data
        })
    },
    methods: {
        // 证书code字典翻译
        certificateFormat(row, column) {
            return this.selectDictLabel(this.certificateOptions, row.cerCode)
        },
        getList (val) {
            
            this.loading = true
            this.queryParams.merchant = val
            listCertificate(this.queryParams).then(response => {
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