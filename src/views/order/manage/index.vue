<template>
    <div class="app-container">
        <el-tabs v-model="defaultType" @tab-click="handleType">
            <el-tab-pane label="全部订单" name="0">
            </el-tab-pane>
            <el-tab-pane :label="dict.label + '订单'" :name="1 + dict.value" v-for="dict in dict.type.get_type_list" />
        </el-tabs>
        <div>
            订单状态：
            <el-radio-group v-model="defaultStatus" fill="#d81440" @input="inputStatus">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button v-for="dict in dict.type.order_manage_status" :key="dict.value" :label="dict.value">{{
                    dict.label }}</el-radio-button>
            </el-radio-group>
        </div>
        <div style="margin-top: 20px;">
            支付方式：
            <el-radio-group v-model="defaultPayWay" fill="#ff1c97" @input="inputPayWay">
                <el-radio-button label="全部"></el-radio-button>
                <el-radio-button v-for="dict in dict.type.store_pay_type" :key="dict.value" :label="dict.value">{{
                    dict.label }}</el-radio-button>
            </el-radio-group>
        </div>
        <el-form :model="queryParams" size="small" :inline="true" label-width="68px" ref="queryForm"
            style="margin-top: 50px;">
            <el-form-item label="订单号" prop="orderNum">
                <el-input v-model="queryParams.orderNum" placeholder="请输入订单号" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="用户姓名" prop="customerName">
                <el-input v-model="queryParams.customerName" placeholder="请输入用户姓名" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="用户电话" prop="phonenumber">
                <el-input v-model="queryParams.phonenumber" placeholder="请输入用户电话" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="创建时间" prop="dateRange">
                <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
                    range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row>
            <!-- 订单列表 -->
            <el-table :data="orderList" style="margin-top: 20px;" v-loading="loading">
                <el-table-column label="ID" prop="orderId" width="50" align="center" />
                <el-table-column label="门店" prop="shopName" align="center" />
                <el-table-column label="桌号" prop="tableNumber" align="center" />
                <el-table-column label="订单号" prop="orderNum" align="center" width="150" />
                <el-table-column label="用户id|昵称" prop="nickName" align="center" width="120" />
                <el-table-column label="用户姓名" prop="customerName" align="center" width="120" />
                <el-table-column label="电话" prop="phonenumber" align="center" width="120" />
                <el-table-column label="商品信息" prop="products" align="center" width="200">
                    <template slot-scope="scope">
                        <div style="display: flex; justify-content: space-around;" v-for="item in scope.row.products"
                            v-if="scope.row.products.length !== undefined">
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
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="handleMore(scope.row)">>>更多</el-button>
                        <el-button size="mini" type="text" @click="handleStatus(scope.row)"
                            v-show="scope.row.status != 5">编辑</el-button>
                        <el-button size="mini" type="text" v-show="scope.row.status == 4">确认退款</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize" @pagination="getList" />
        </el-row>
        <el-dialog title="状态修改" :visible.sync="statusVisible" width="30%" @close="closeStaus">
            <el-form>
                <el-form-item :lable="statusLable">
                    <el-select v-model="status" placeholder="请选择">
                        <el-option v-for="dict in dict.type.order_manage_status" :key="dict.value" :label="dict.label"
                            :value="dict.value">
                            {{ dict.label }}
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="statusVisible = false">取 消</el-button>
                <el-button type="primary" @click="statusSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <order-detail v-if="handleMore" ref="orderMore" />
    </div>
</template>
<script>
import { status } from "nprogress";
import orderDetail from "./../../stores/table/orderDetail.vue";
import { listOrder, updateOrder } from "@/api/order/list"
export default {
    components: { orderDetail },
    dicts: ['order_manage_status', 'store_pay_type', 'get_type_list'],
    data() {
        return {
            loading: false,
            showMore: false,
            statusLable: '订单状态',
            statusVisible: false,
            orderId: undefined,
            status: '',
            showMore: false,
            open: false,
            title: '',
            total: 0,
            defaultStatus: '全部',
            defaultPayWay: '全部',
            defaultType: '0',
            // 弹窗查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                orderNum: undefined,
                customerName: undefined,
                phonenumber: undefined,
                starTime: undefined,
                endTime: undefined,
                status: undefined,
                payWay: undefined,
                type: undefined
            },
            dateRange: [],
            // 订单列表
            orderList: [
            ],
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 查询桌号订单列表
        getList() {
            this.loading = true
            listOrder(this.queryParams).then(res => {
                this.loading = false
                this.orderList = res.data.list
                this.total = res.data.total
                this.orderList.forEach(item => {
                    item.products = JSON.parse(item.products)
                })
                // console.log(this.orderList);

            }
            ).catch(() => {
                this.loading=false
            })
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.queryParams = {
                pageNum: 1,
                pageSize: 10,
                orderNum: undefined,
                customerName: undefined,
                phonenumber: undefined,
                starTime: undefined,
                endTime: undefined,
                status: undefined,
                payWay: undefined,
                type: null,
            }
            this.defaultStatus = '全部',
            this.defaultPayWay = '全部',
            this.defaultType = '0',
            this.dateRange = []
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
            this.queryParams.payWay = e
            if (e == '全部') {
                this.queryParams.payWay = undefined
            }
            this.getList()
        },
        handleQuery() {
            this.queryParams.starTime = this.dateRange[0],
                this.queryParams.endTime = this.dateRange[1],
                this.queryParams.pageNum = 1;
            this.getList();
        },
        handleStatus(row) {
            this.statusVisible = true
            this.status = row.status
            this.orderId = row.orderId
        },
        statusSubmit() {
            updateOrder({ orderId: this.orderId, status: this.status }).then(res => {
                // console.log(res);
                this.$modal.msgSuccess("编辑成功");
                this.statusVisible = false
                this.getList()
                // console.log(this.status);

            })
        },
        closeStaus() {
            this.statusVisible = false
            this.status = undefined
            this.getOrderNum = undefined
        },
        // 更多弹窗
        handleMore(row) {
            this.showMore = true
            this.$nextTick(() => {
                // 每次都传递当前行数据
                this.$refs.orderMore.init(row);
            });
        },
        handleType(e) {
            if (e.name == 0) {
                this.queryParams.type = null
            } else {
                this.queryParams.type = e.name - 10
            }
            this.getList()
        }
    },
}
</script>