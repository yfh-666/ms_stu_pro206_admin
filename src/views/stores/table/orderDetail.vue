<template>
    <el-dialog title="订单详情" width="500px" top="5vh" append-to-body :visible.sync="open" v-loading="loading"
        @closed="handleClose">
        <el-table style="width: 100% ;margin-bottom: 30px;" :data="products" v-if="products.length !== undefined">
            <el-table-column label="图片">
                <template slot-scope="scope">
                    <el-image style="width: 40px; height:40px" :src="scope.row.product.imageUrl" fit="cover"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="product.productName" label="名称">
            </el-table-column>
            <el-table-column prop="product.price" label="价格">
            </el-table-column>
            <el-table-column prop="product.copies" label="数量">
            </el-table-column>
        </el-table>
        <div>
            <div style="display: flex;margin-bottom: 20px;">
                <div class="title" style="font-size: 20px; margin-right: 10px;font-weight: bold;">订单信息</div>
                <dict-tag :options="dict.type.get_type_list" :value="detailList.type" />
            </div>
            <el-descriptions :column="2">
                <el-descriptions-item label="门店">{{ detailList.shopName }}</el-descriptions-item>
                <el-descriptions-item label="取餐号">{{ detailList.getOrderNum }}</el-descriptions-item>
                <el-descriptions-item label="桌位号">{{ detailList.tableNumber }}</el-descriptions-item>
                <el-descriptions-item label="就餐人数">{{ detailList.customerNum }}</el-descriptions-item>
                <el-descriptions-item label="订单号">{{ detailList.orderNum }}</el-descriptions-item>
                <el-descriptions-item label="订单状态">
                    <dict-tag :options="dict.type.order_manage_status"
                        :value="detailList.status" /></el-descriptions-item>
                <el-descriptions-item label="商品总数">{{ copiesCount }}</el-descriptions-item>
                <el-descriptions-item label="商品总价">{{ detailList.orderAmount }}</el-descriptions-item>
                <el-descriptions-item label="支付邮费">0</el-descriptions-item>//如果选中外卖支付邮费就是配送费,若为其他方式,则支付邮费为零
                <el-descriptions-item label="优惠券金额">{{ detailList.discountAmount }}</el-descriptions-item>
                <el-descriptions-item label="积分抵扣">{{ detailList.couponAmount }}</el-descriptions-item>
                <el-descriptions-item label="实际支付">{{ detailList.amount }}</el-descriptions-item>
                <el-descriptions-item label="赠送积分"></el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ detailList.createTime }}</el-descriptions-item>
                <!-- <el-descriptions-item label="支付时间"></el-descriptions-item> -->
                <el-descriptions-item label="支付方式"><dict-tag :options="dict.type.store_pay_type"
                        :value="detailList.payWay" /></el-descriptions-item>
            </el-descriptions>
        </div>

    </el-dialog>
</template>
<script>
import { detailOrder } from "@/api/shop/table"
export default {
    dicts: ['order_manage_status', 'store_pay_type', 'get_type_list'],
    props: {

    },
    data() {
        return {
            products: undefined,
            loading: false,
            orderId: undefined,
            open: false,
            copiesCount: 0,
            detailList: {
                shopName: undefined,
                getOrderNum: undefined,
                tableNumber: undefined,
                customerNum: undefined,
                orderNum: undefined,
                status: undefined,
                tableNumber: undefined,
                tableNumber: undefined,
                tableNumber: undefined,
                tableNumber: undefined,
            }
        }
    },
    methods: {
        // 显示弹框
        init(row) {
            this.open = true;
            this.orderId = row.orderId
            this.getList()
            this.loading = true
        },
        created() {
        },
        // 查询桌号订单列表
        getList() {
            detailOrder({ orderId: this.orderId }).then(res => {
                this.detailList = res.data
                this.detailList.products = JSON.parse(this.detailList.products)
                this.products = JSON.parse(JSON.stringify(this.detailList.products))
                this.loading = false
                // console.log(typeof(this.products));
                console.log(this.products.length);

                if (this.products.length !== undefined) {
                    this.products.map(item => {
                        this.copiesCount += item.product.copies
                    })
                }

            }
            );
        },
        getTotal() {


        },
        handleClose() {
            this.detailList = {}
        }
    },
}

</script>