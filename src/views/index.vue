<!--
 * @Author: your name
 * @Date: 2020-08-23 09:00:10
 * @LastEditTime: 2021-01-26 15:40:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /show-admin-supervise/src/views/index.vue
-->
<template>
	<div class="dashboard-editor-container">
		<MerchantsNum @MerchantsId="MerchantsId"></MerchantsNum>
		<el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
			<bar-chart-top
				ref="charttop"
				:topseries="topseries"
				:topxAxis="topxAxis"
			/>
		</el-row>

		<el-row :gutter="32">
			<el-col :xs="24" :sm="24" :lg="8">
				<div class="chart-wrapper">
					<pie-chart />
				</div>
			</el-col>
			<el-col :xs="24" :sm="24" :lg="8">
				<div class="chart-wrapper">
					<bar-chart-store />
				</div>
			</el-col>
			<el-col :xs="24" :sm="24" :lg="8">
				<div class="chart-wrapper">
					<BarChartYun />
					<!-- <BarChart></BarChart> -->
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import MerchantsNum from "./dashboard/MerchantsNum";
import BarChartYun from "./dashboard/BarChartYun";
import BarChartStore from "./dashboard/BarChartStore";
import PieChart from "./dashboard/PieChart";
import BarChart from "./dashboard/BarChart";
import BarChartTop from "./dashboard/BarChartTop";
import { getCategory, getStore, getTransport } from "@/api/index/index";

export default {
	name: "Index",
	components: {
		MerchantsNum,
		BarChartStore,
		PieChart,
		BarChart,
		BarChartYun,
		BarChartTop,
	},
	data() {
		return {
			topseries: [],
			topxAxis: [],
		};
	},
	methods: {
		MerchantsId(val) {
			// 获取行业分类数据
			getCategory({ codes: val })
				.then((response) => {
					this.topxAxis = [];
					this.topseries = [];
					const arr = response.data;
					// const arr = [
					// 	{
					// 		firstCategory: "F",
					// 		firstCategoryName: val,
					// 		num: 2298,
					// 		merchantOperationDto: {
					// 			operationStatusA: "正常营业",
					// 			operationStatusANum: 2175,
					// 			operationStatusB: "无经营场所营业",
					// 			operationStatusBNum: 14,
					// 			operationStatusC: "歇业",
					// 			operationStatusCNum: 5,
					// 			operationStatusD: "吊销",
					// 			operationStatusDNum: 5,
					// 		},
					// 	},
					// 	{
					// 		firstCategory: "H",
					// 		firstCategoryName: "住宿和餐饮业",
					// 		num: 1243,
					// 		merchantOperationDto: {
					// 			operationStatusA: "正常营业",
					// 			operationStatusANum: 1145,
					// 			operationStatusB: "无经营场所营业",
					// 			operationStatusBNum: 12,
					// 			operationStatusC: "歇业",
					// 			operationStatusCNum: 8,
					// 			operationStatusD: "吊销",
					// 			operationStatusDNum: 8,
					// 		},
					// 	},
					// ];
					var arr1 = [];
					var arr2 = [];
					var arr3 = [];
					var arr4 = [];
					var arr5 = [];
					arr.forEach((element) => {
						this.topxAxis.push(element.firstCategoryName);
						arr1.push(element.merchantOperationDto.operationStatusANum);
						arr2.push(element.merchantOperationDto.operationStatusBNum);
						arr3.push(element.merchantOperationDto.operationStatusCNum);
						arr4.push(element.merchantOperationDto.operationStatusDNum);
						arr5.push(
							element.merchantOperationDto.operationStatusANum +
								element.merchantOperationDto.operationStatusBNum +
								element.merchantOperationDto.operationStatusCNum +
								element.merchantOperationDto.operationStatusDNum
						);
						this.topseries = [
							{
								name: element.merchantOperationDto.operationStatusA,
								type: "bar",
								stack: "vistors",
								barWidth: "60%",
								color: ["#92D050"],
								data: arr1,
								animationDuration: 300,
							},
							{
								name: element.merchantOperationDto.operationStatusB,
								type: "bar",
								stack: "vistors",
								barWidth: "60%",
								color: ["#9CC3E6"],
								data: arr2,
								animationDuration: 300,
							},
							{
								name: element.merchantOperationDto.operationStatusC,
								type: "bar",
								stack: "vistors",
								barWidth: "60%",
								color: ["#FFC000"],
								data: arr3,
								animationDuration: 300,
							},
							{
								name: element.merchantOperationDto.operationStatusD,
								type: "bar",
								stack: "vistors",
								barWidth: "60%",
								color: ["#FF0000"],
								data: arr4,
								animationDuration: 300,
							},
							{
								name: "总数",
								type: "bar",
								barWidth: "60%",
								barGap: "-100%",
								color: ["rgba(0, 0, 0, 0)"],
								data: arr5,
								animationDuration: 300,
								label: {
									normal: {
										show: true, //显示数值
										position: "top", //  位置设为top
										formatter: "{c}",
										textStyle: { color: "#000" }, //设置数值颜色
									},
								},
							},
						];
					});
					this.$nextTick(() => {
						this.$refs.charttop.initChart();
					});
				})
				.catch((response) => {
					console.log("失败", response);
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
	padding: 24px;
	background-color: rgb(240, 242, 245);
	position: relative;

	.chart-wrapper {
		background: #fff;
		padding: 16px 16px 0;
		margin-bottom: 32px;
	}
}

@media (max-width: 1024px) {
	.chart-wrapper {
		padding: 8px;
	}
}
</style>
