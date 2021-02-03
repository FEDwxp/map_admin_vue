<!--
 * @Author: your name
 * @Date: 2020-11-29 11:07:19
 * @LastEditTime: 2021-01-12 10:02:45
 * @LastEditors: Please set LastEditors
 * @Description: 商家数量区域
 * @FilePath: /show-admin-supervise/src/views/dashboard/BuildNum.vue
-->
<template>
	<div class="numBox">
		<div class="numItemleft">
			<h5>商家总数量</h5>
			<div style="margin-top: 45px;font-size: 32px;" class="numText">
				{{ MerchantsObj.totalNum | toThousands }}
			</div>
		</div>
		<div class="numItemright">
			<div class="righttop">
				<div class="numItem numItem1">
					<h5>正常营业</h5>
					<div class="numText">
						{{ MerchantsObj.operationStatusANum | toThousands }}
					</div>
				</div>
				<div class="numItem numItem2">
					<h5>无经营场所</h5>
					<div class="numText">
						{{ MerchantsObj.operationStatusBNum | toThousands }}
					</div>
				</div>
				<div class="numItem numItem3">
					<h5>歇业</h5>
					<div class="numText">
						{{ MerchantsObj.operationStatusCNum | toThousands }}
					</div>
				</div>
				<div class="numItem numItem4">
					<h5>注销/吊销</h5>
					<div class="numText">
						{{ MerchantsObj.operationStatusDNum | toThousands }}
					</div>
				</div>
				<div class="numItem numItem5">
					<h5>区域选择</h5>
					<div class="numText">
						<el-select
							v-model="countyCode"
							placeholder="区域选择"
							:multiple="true"
							collapse-tags
							size="small"
                            @change="countyCodeget"
						>
							<el-option
								v-for="item in countyCodeList"
								:key="item.dictValue"
								:label="item.dictLabel"
								:value="item.dictValue"
							/>
						</el-select>
					</div>
				</div>
				<div class="numItem numItem6">
					<h5>证件数量/超期数量</h5>
					<div class="numText">
						{{ MerchantsObj.certificateNum }}/
						<span style="color: red">{{
							MerchantsObj.certificateExpiredNum
						}}</span>
					</div>
				</div>
			</div>
			<div class="rightottom">
				<div class="numItem numItem7">
					<h5>正常经营</h5>
					<div class="numText">
						{{ MerchantsObj.businessNum | toThousands }}
					</div>
				</div>
				<div class="numItem numItem8">
					<h5>无照经营</h5>
					<div class="numText">
						{{ MerchantsObj.noBusinessNum | toThousands }}
					</div>
				</div>
				<div class="numItem numItem9">
					<h5>非注册地经营</h5>
					<div class="numText">
						{{ MerchantsObj.noAddressBusinessNum | toThousands }}
					</div>
				</div>
				<div class="numItem numItem10">
					<h5>网店</h5>
					<div class="numText">{{ MerchantsObj.storeNum | toThousands }}</div>
				</div>
				<div class="numItem numItem11">
					<h5>运输户</h5>
					<div class="numText">
						{{ MerchantsObj.transportNum | toThousands }}
					</div>
				</div>
				<div class="numItem numItem12">
					<h5>器具数量/超期数量</h5>
					<div class="numText">
						{{ MerchantsObj.applianceNum }}/
						<span style="color: red">{{
							MerchantsObj.applianceExpiredNum
						}}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getNum } from "@/api/index/index";

export default {
	data() {
		return {
            countyCode: undefined,
            countyCodeList: [],
			MerchantsObj: {},
		};
	},
	filters: {
		toThousands: function (value) {
			return (value || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
		},
	},
	created() {
        this.getDicts('map_county_code').then(response => {
            this.countyCodeList = response.data
			this.countyCode = [response.data[0].dictValue]
	        this.getData();
			this.$emit("MerchantsId", [response.data[0].dictValue]);
        })
	},
	methods: {
        countyCodeget (val) {
			console.log(val.length);
			if (!val.length) {
				this.countyCode = [this.countyCodeList[0].dictValue]
				this.getData();
				this.$emit("MerchantsId", this.countyCode);
				return
			}
			this.$emit("MerchantsId", val);
        },
		getData() {
			getNum({ codes: this.countyCode }).then((response) => {
				console.log(response);
				if (response.code === 200) {
					this.MerchantsObj = response.data;
				} else {
					this.msgError(response.msg);
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.numText {
	text-align: center;
	font-size: 24px;
	font-weight: 700;
}
.numItemright .numText {
	font-size: 18px;
	font-weight: 400;
	margin-top: 8px;
}
h5 {
	margin: 0;
	padding-left: 5px;
}
.numBox {
	display: flex;
	margin-bottom: 12px;
}
.numItem {
	background: #fff;
	padding: 8px;
	display: inline-block;
	flex: 1;
	height: 100%;
	margin-right: 12px;
}
.numItemright {
	height: 150px;
	flex: 4;
}
.righttop,
.rightottom {
	height: 50%;
	display: flex;
}
.righttop {
	margin-bottom: 12px;
}
.numItemleft {
	background: #fff;
	padding: 8px;
	height: 160px;
	flex: 1;
	margin-right: 12px;
}
.numItem5,
.numItem11 {
    flex: 1.5;
}
</style>
