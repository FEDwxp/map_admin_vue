<template>
	<div :class="className" :style="{ height: height, width: width, overflow: 'auto' }" />
</div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
// import resize from "./mixins/resize";
import { getStore } from "@/api/index/index";

const animationDuration = 6000;

export default {
	// mixins: [resize],
	props: {
		className: {
			type: String,
			default: "chart",
		},
		width: {
			type: String,
			default: "100%",
		},
		height: {
			type: String,
			default: "300px",
		},
	},
	data() {
		return {
			chart: null,
			seriesdata: [],
			xAxisdata: []
		};
	},
	created() {
		this.getStorelist();
	},
	mounted() {
		// this.$nextTick(() => {
		//   this.initChart()
		// })
	},
	beforeDestroy() {
		if (!this.chart) {
			return;
		}
		this.chart.dispose();
		this.chart = null;
	},
	methods: {
		getStorelist() {
			getStore()
				.then((response) => {
					console.log(", ====", response);
					if (response.code === 200) {
						this.seriesdata = []
						response.data.forEach(element => {
						this.seriesdata.push(element.num)
						this.xAxisdata.push(element.name)
						});
					}
					this.initChart();
				})
				.catch((response) => {
					console.log("失败", response);
				});
		},
		initChart() {
			this.chart = echarts.init(this.$el, "macarons");
			this.chart.setOption({
				title: {
					text: '网店',
					left: 'right'
				},
				tooltip: {
					trigger: "axis",
					axisPointer: {
						// 坐标轴指示器，坐标轴触发有效
						type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
					},
				},
				grid: {
					width: "100%",
					height: '80%',
					left: "1%",
					bottom: "3%",
					containLabel: true,
				},
				xAxis: [
					{
						type: "category",
						data: this.xAxisdata,
						axisTick: {
							alignWithLabel: true,
							show: true,
							interval: 0,
							length: 2,
						},
						axisLabel: {
							interval: 0
						},
					},
				],
				yAxis: [
					{
						type: "value",
					},
				],
				series: [
					{
						name: "数量",
						barWidth: "55%",
						itemStyle: {
							normal: {
								color: function (params) {
									var colorList = [
										"#C1232B",
										"#B5C334",
										"#FCCE10",
										"#E87C25",
										"#27727B",
										// '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
										// '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
									];
									return colorList[params.dataIndex];
								},
								label: {
									show: true, //开启显示
									position: "top", //在上方显示
									textStyle: {
										//数值样式
										color: "black",
										fontSize: 16,
									},
								},
							},
						},
						type: "bar",
						data: this.seriesdata,
					},
				],
			});
		},
	},
};
</script>
