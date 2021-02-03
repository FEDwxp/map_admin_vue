<template>
	<div :class="className" :style="{ height: height, width: width, overflow: 'auto' }" />
</div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
// import resize from "./mixins/resize";
import { listBusinessCategory } from "@/api/map/businessCategory";
import { getCategory } from "@/api/index/index";

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
		topseries: {
			type: Array,
			default: [],
		},
		topxAxis: {
			type: Array,
			default: [],
		},
	},
	data() {
		return {
			chart: null,
			Categorylist: [],
		};
	},
	created() {
		// this.getCategorylist();
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
		initChart() {
			this.chart = echarts.init(this.$el, "macarons");
			this.chart.setOption({
				 title: {
					text: '行业分类',
					left: 'center'
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
					top: 30,
					left: "1%",
					bottom: "1%",
					containLabel: true,
				},
				xAxis: [
					{
						type: "category",
						data: this.topxAxis,
						axisTick: {
							alignWithLabel: true,
							show: true,
							interval: 0,
							length: 2,
						},
						axisLabel: {
							interval: 0,
							rotate: 45,
						},
					},
				],
				yAxis: [
					{
						type: "value",
					},
				],
				series: this.topseries,
				// [
				// 	{
				// 		name: "正常营业",
				// 		type: "bar",
				// 		stack: "vistors",
				// 		barWidth: "60%",
				// 		color: ["#92D050"],
				// 		data: [79, 1, 200, 334, 90, 330, 220],
				// 		animationDuration,
				// 	},
				// 	{
				// 		name: "无经营场所",
				// 		type: "bar",
				// 		stack: "vistors",
				// 		barWidth: "60%",
				// 		data: [80, 3, 200, 334, 390, 30, 220],
				// 		animationDuration,
				// 	},
				// 	{
				// 		name: "歇业",
				// 		type: "bar",
				// 		stack: "vistors",
				// 		barWidth: "60%",
				// 		data: [30, 200, 201, 3354, 390, 330, 220],
				// 		animationDuration,
				// 	},
				// 	{
				// 		name: "吊销/注销",
				// 		type: "bar",
				// 		stack: "vistors",
				// 		barWidth: "60%",
				// 		data: [30, 532, 20, 334, 390, 330, 220],
				// 		animationDuration,
				// 	},
				// ],
			});
		}
	}
};
</script>
