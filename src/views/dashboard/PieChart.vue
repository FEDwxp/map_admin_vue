<!--
 * @Author: your name
 * @Date: 2020-08-23 09:00:10
 * @LastEditTime: 2020-11-30 17:13:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /show-admin-supervise/src/views/dashboard/PieChart.vue
-->
<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { getStatus } from "@/api/index/index";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      list: []
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.initChart()
    // })
    this.getdata()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    // getStatus
    getdata(val) {
      // 获取行业分类数据
			getStatus()
				.then((response) => {
          // this.list = []
					this.list = response.data.map((item) => {
            const obj = {value: item.num, name: item.operationStatusName};
					  return obj
          });
          this.$nextTick(() => {
            this.initChart()
          })
				})
				.catch((response) => {
					console.log("失败", response);
				});
		},
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
					text: '经营状态',
					left: 'right'
				},
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '0',
          data: ['正常营业', '无经营场所', '歇业', '吊销/注销']
        },
        series: [
          {
            name: '营业状态',
            type: 'pie',
            // roseType: 'radius',
            radius: '55%',
            center: ['50%', '40%'],
            data: this.list,
            itemStyle: {
							normal: {
								color: function (params) {
									//注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
									var colorList = [
										"#92D050",
										"#9CC3E6",
										"#FFC000",
										"#FF0000",
									];
									return colorList[params.dataIndex];
								},
							},
						},
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
