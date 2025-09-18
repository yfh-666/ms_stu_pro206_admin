<template>
    <div>
        <!-- 订单弹窗 -->
        <el-dialog :visible.sync="open" width="1100px" append-to-body :title="title" @closed="handleClose">
            <el-tabs v-model="activeName">
                <el-tab-pane label="全部订单" name="orders">
                    <div>
                        订单状态：
                        <el-radio-group v-model="defaultStatus" fill="#d81440" @input="inputStatus">
                            <el-radio-button label="全部"></el-radio-button>
                            <el-radio-button v-for="dict in dict.type.order_manage_status" :key="dict.value"
                                :label="dict.value">{{ dict.label }}</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div style="margin-top: 20px;">
                        支付方式：
                        <el-radio-group v-model="defaultPayWay" fill="#ff1c97" @input="inputPayWay">
                            <el-radio-button label="全部"></el-radio-button>
                            <el-radio-button v-for="dict in dict.type.store_pay_type" :key="dict.value"
                                :label="dict.value">{{ dict.label }}</el-radio-button>
                        </el-radio-group>
                    </div>

                    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px"
                        style="margin-top: 50px;">
                        <el-form-item label="订单号" prop="orderNum" @keyup.enter.native="handleQuery">
                            <el-input v-model="queryParams.orderNum" placeholder="请输入订单号" />
                        </el-form-item>
                        <el-form-item label="用户姓名" prop="nickName" @keyup.enter.native="handleQuery">
                            <el-input v-model="queryParams.nickName" placeholder="请输入用户姓名" />
                        </el-form-item>
                        <el-form-item label="用户电话" prop="phonenumber" @keyup.enter.native="handleQuery">
                            <el-input v-model="queryParams.phonenumber" placeholder="请输入用户电话" />
                        </el-form-item>
                        <el-form-item>
                            <el-button icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        </el-form-item>
                    </el-form>

                    <el-row>
                        <!-- 订单列表 -->
                        <el-table :data="orderList" style="margin-top: 20px;">
                            <el-table-column label="ID" prop="orderId" width="50" align="center" />
                            <el-table-column label="门店" prop="shopName" align="center" />
                            <el-table-column label="桌号" prop="tableNumber" align="center" />
                            <el-table-column label="订单号" prop="orderNum" align="center" width="150" />
                            <el-table-column label="用户id" prop="customerId" align="center" width="120" />
                            <el-table-column label="昵称" prop="nickName" align="center" width="120" />
                            <el-table-column label="用户姓名" prop="customerName" align="center" width="120" />
                            <el-table-column label="电话" prop="phonenumber" align="center" width="120" />
                            <el-table-column label="商品信息" prop="products" align="center" width="200">
                                <template slot-scope="scope">
                                    <div style="display: flex; justify-content: space-around;" v-if="scope.row.products.length!==undefined"
                                        v-for="item in scope.row.products">
                                        <div style="display: flex; width: 60%; align-items: center;">
                                            <el-image style="width: 50px; height: 50px" :src="item.product.imageUrl"
                                                fit="cover"></el-image>
                                            <div>{{ item.product.productName }}
                                            </div>
                                        </div>
                                        <div style="align-content: center;">￥{{ item.product.price }}x{{
                                            item.product.copies }}
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="支付方式" prop="payWay" align="center">
                                <template slot-scope="scope">
                                    <dict-tag :options="dict.type.store_pay_type" :value="scope.row.payWay" />
                                </template>
                            </el-table-column>
                            <el-table-column label="购买类型" prop="buyType" align="center" />
                            <el-table-column label="支付时间" prop="payTime" align="center" />
                            <el-table-column label="订单状态" prop="status" align="center">
                                <template slot-scope="scope">
                                    <dict-tag :options="dict.type.order_manage_status" :value="scope.row.status" />
                                </template>
                            </el-table-column>
                            <el-table-column label="添加时间" prop="createTime" width="130" align="center" />
                            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="text" @click="handleMore(scope.row)">更多</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- 分页 -->
                        <!-- <pagination :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                            @pagination="getList" /> -->
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <order-detail v-if="handleMore" ref="orderMore" />
    </div>
</template>
<script>
import orderDetail from "./orderDetail";
import { listOrder } from "@/api/shop/table"
export default {
    components: { orderDetail },
    dicts: ['order_manage_status', 'store_pay_type'],
    props: {
    },
    data() {
        return {
            showMore: false,
            open: false,
            title: '',
            // total: 0,
            defaultStatus: '全部',
            defaultPayWay: '全部',
            activeName: "orders",
            // 弹窗查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 100,
                status: undefined,
                payway: undefined,
                orderNum: undefined,
                nickName: undefined,
                phonenumber: undefined
            },
            // 订单列表
            orderList: [],
        }
    },
    created() {
    },
    methods: {
        // 查询桌号订单列表
        getList() {
            listOrder(this.queryParams).then(res => {
                this.orderList = res.data
                this.orderList.tableId = this.queryParams.tableId
                this.orderList.forEach(item => {
                    item.products = JSON.parse(item.products)
                })
                console.log(this.orderList);

            }
            );
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.getList()
        },
        // 更多弹窗
        handleMore(row) {
            this.showMore = true
            this.$nextTick(() => {
                // 每次都传递当前行数据
                this.$refs.orderMore.init(row);
            });
        },
        closeOrder() {
            this.showMore = false
        },
        init(row) {
            this.open = true;
            this.queryParams.tableId = row.tableId
            this.getList()
        },
        inputStatus(e) {
            this.queryParams.status = e
            if (e == '全部') {
                this.queryParams.status = undefined
            }
            this.getList()
        },
        inputPayWay(e) {
            this.queryParams.payway = e
            if (e == '全部') {
                this.queryParams.payway = undefined
            }
            this.getList()
        },
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        handleClose() {
            this.defaultStatus = '全部'
            this.defaultPayWay = '全部'
        }

    },
}
</script>