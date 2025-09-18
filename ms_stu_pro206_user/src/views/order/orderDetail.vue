<template>
    <div>
        <NavBar navTitle="订单详情"></NavBar>
        <div class="page-container padding order-detail-container">
            <div class="top">
                <div class="shopName">{{ form.shopName }}</div>
                <div class="icon">
                    <van-icon name="phone" color="#efc90f" size="40" />
                    <van-icon name="map-marked" color="#efc90f" size="40" />
                </div>
            </div>
            <div class="make-container">
                <div class="make-list" v-if="form.status == 0">
                    <div class="number">{{ form.getOrderNum }}</div>
                    <div class="icon-list">
                        <van-icon name="bulb-o" size="60" color="#fcc502" />
                        <van-icon name="underway-o" size="60" color="#909090" />
                        <van-icon name="point-gift-o" size="60" color="#909090" />
                    </div>
                    <div class="info-list">
                        <div>已下单</div>
                        <div style="color: #909090;">——</div>
                        <div style="color: #909090;">制作中</div>
                        <div style="color: #909090;">——</div>
                        <div style="color: #909090;">请取餐</div>
                    </div>
                </div>
                <div class="make-list" v-if="form.status == 1">
                    <div class="number">{{ form.getOrderNum }}</div>
                    <div class="icon-list">
                        <van-icon name="bulb-o" size="60" color="#fcc502" />
                        <van-icon name="underway-o" size="60" color="#fcc502" />
                        <van-icon name="point-gift-o" size="60" color="#909090" />
                    </div>
                    <div class="info-list">
                        <div>已下单</div>
                        <div style="color: #909090;">——</div>
                        <div>制作中</div>
                        <div style="color: #909090;">——</div>
                        <div style="color: #909090;">请取餐</div>
                    </div>
                </div>
                <div class="make-list" v-if="form.status == 2">
                    <div class="number">{{ form.getOrderNum }}</div>
                    <div class="icon-list">
                        <van-icon name="bulb-o" size="60" color="#fcc502" />
                        <van-icon name="underway-o" size="60" color="#fcc502" />
                        <van-icon name="point-gift-o" size="60" color="#fcc502" />
                    </div>
                    <div class="info-list">
                        <div>已下单</div>
                        <div style="color: #909090;">——</div>
                        <div>制作中</div>
                        <div style="color: #909090;">——</div>
                        <div>请取餐</div>
                    </div>
                </div>
            </div>
            <div class="card-list" >
                <!-- 商品结账详情小卡片 -->
                <!-- <detailCard v-for="item in productDetail" :data="item" :props="productCardProps"></detailCard> -->
                <div class="card" v-for="item in form.products">
                    <div class="left">
                        <div style="display: flex; flex-direction: column;">
                            <van-image width="50" height="50" :src="item.product.imageUrl"
                                v-if="item.product.imageUrl != undefined" />
                            <div style="font-size: 12px; color: #c6c6c6;" v-if="item.product.specification.length > 0"
                                v-for="item2 in item.product.specification">{{ item2.active }}</div>
                        </div>
                        <div class="product-name">{{ item.product.productName }}</div>
                    </div>
                    <div class="right">
                        <div class="number">x{{ item.product.copies }}</div>
                        <div class="money">￥{{ item.product.price }}</div>
                    </div>
                </div>
            </div>
            <div class="pay-list">
                <div class="pay-item">
                    <div>支付方式</div>
                    <div class="right">{{ payWay(form.payWay) }}</div>
                </div>
                <div class="pay-item">
                    <div>订单金额</div>
                    <div class="right">￥{{ form.orderAmount }}</div>
                </div>
                <div class="pay-item">
                    <div>优惠金额</div>
                    <div class="right">-￥{{ form.couponAmount }}</div>
                </div>
                <div class="pay-item">
                    <div>折扣金额</div>
                    <div class="right">-￥{{ form.discountAmount }}</div>
                </div>
                <div class="pay-item">
                    <div>实付金额</div>
                    <div class="right">￥{{ form.paidAmount }}</div>
                </div>
            </div>
            <div class="pay-list">
                <div class="pay-item">
                    <div>下单时间</div>
                    <div class="right">{{ form.payTime }}</div>
                </div>
                <div class="pay-item">
                    <div>订单号</div>
                    <div class="right">{{ form.orderNum }}</div>
                </div>
            </div>
            <div class="pay-list">
                <div class="pay-item">
                    <div>享用方式</div>
                    <div class="right">{{ type(form.type) }}</div>
                </div>
                <div class="pay-item">
                    <div>取餐时间</div>
                    <div class="right">{{ form.bookingTime }}</div>
                </div>
                <div class="pay-item">
                    <div>制作完成时间</div>
                    <div class="right">{{ form.productionCompletionTime }}</div>
                </div>
                <div class="pay-item">
                    <div>备注</div>
                    <div class="right">{{ form.remark }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import NavBar from "@/components/NavBar"
import detailCard from "@/components/detailCard";
import { orderDtl, orderList } from "@/api/order/list"
export default {
    components: {
        NavBar,
        detailCard
    },
    created() {
        this.getList()

    },
    data() {
        return {
            productDetail: [
            ],
            productCardProps: {
                attribute: 'attribute',
                productName: 'productName',
                number: 'number',
                price: 'price',
                img: 'img',
            },
            typeList: [{ title: "堂食", index: 0 }, { title: "自提", index: 1 }, { title: "外卖", index: 2 }, { title: "预约", index: 3 },],
            payWayList: [{ title: "微信支付", index: 0 }, { title: "支付宝", index: 1 }, { title: "现金", index: 2 }],
            statusList: [{ title: "全部", index: 6 }, { title: "未支付", index: 0 }, { title: "制作中", index: 1 }, { title: "待收货", index: 2 }, { title: "已取餐", index: 3 }, { title: "已退单", index: 4 },],
            form: {}
        }
    },
    computed: {
        type() {
            return function (type) {
                const typeVal = this.typeList.filter(item => item.index == 0)
                return typeVal[0].title
            }
        },
        payWay() {
            return function (payWay) {
                const payWayList = this.payWayList.filter(item => item.index == 0)
                return payWayList[0].title
            }
        }
    },
    methods: {
        getList() {
            this.$toast.loading({
                message: '加载中...',
                forbidClick: true,
            });
            orderDtl({ orderId: this.$route.params.orderId }).then(res => {
                this.form = Object.assign({}, res.data.data)
                this.form.products = JSON.parse(this.form.products)
                console.log(this.form);
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.order-detail-container {
    background-color: #fff;
    margin: 10px;
    box-sizing: border-box;

    .top {
        height: 60px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #f0f0f0;

        .icon {
            width: 100px;
            display: flex;
            justify-content: space-between;
        }
    }

    .make-list {
        height: 300px;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f0f0f0;

        .number {
            height: 50%;
            font-size: 40px;
            font-weight: bold;
            line-height: 150px;
        }

        .icon-list {
            width: 100%;
            display: flex;
            justify-content: space-around;
        }

        .info-list {
            margin-top: 10px;
            width: 90%;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
    }

    .card-list {
        padding: 10px 10px 40px;
        box-sizing: border-box;
        border-bottom: 1px solid #f0f0f0;
    }

    .pay-list {
        // width: 100%;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-bottom: 1px solid #f0f0f0;

        .pay-item {
            height: 40px;
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;

            .right {
                font-weight: bold;
            }
        }
    }

    .card {
        height: 100px;
        width: 100%;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        padding: 10px;
        box-sizing: border-box;

        .left {
            display: flex;
            align-items: center;

            .product-name {
                margin-left: 10px;
            }
        }

        .right {
            align-items: center;
            display: flex;

            .money {
                margin-left: 10px;
            }
        }
    }
}
</style>