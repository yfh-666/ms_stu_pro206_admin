<template>
    <div class="app-container" style="position: relative; ">
        <NavBar navTitle="支付"></NavBar>
        <div class="page-container padding" style="padding-bottom: 60px;">
            <van-cell title="选择享用方式" is-link @click="typeShow = true" v-model="typeName" />
            <van-action-sheet v-model="typeShow" @select="selectType" :actions="actions">
            </van-action-sheet>
            <van-cell-group style="margin-top: 10px;">
                <!-- <van-cell title="yshop店" is-link /> -->
                <van-cell title="选择收货地址" is-link @click="addressShow = true" v-show="form.type == 2"
                    v-model="addressSelect" />
                <van-action-sheet v-model="addressShow" title="选择收货地址">
                    <van-address-list v-model="form.takeawayAddressId" :list="addressData" default-tag-text="默认"
                        @add="onAdd" @edit="onEdit" @select="selectAddress" />
                </van-action-sheet>
                <van-cell title="取餐时间" is-link :value="form.bookingTime" @click="show = true" />
                <van-action-sheet v-model="show" @select="onSelect">
                    <van-datetime-picker v-model="form.bookingTime" type="datetime" title="选择取餐时间" :min-date="minDate"
                        :max-date="maxDate" @confirm="confirmPicker" />
                </van-action-sheet>
                <van-cell center title="联系电话">
                    <template #right-icon>
                        <van-field v-model="form.phonenumber" style="width: 150px;" placeholder="请输入手机号码" />
                        <van-tag plain color="#ffc901" @click="handlePhone">自动填写</van-tag>
                    </template>
                </van-cell>
            </van-cell-group>

            <van-cell-group style="margin-top: 10px;">
                <!-- 商品结账详情小卡片 -->
                <!-- <detailCard v-for="item in productDetail" :data="item" :props="productCardProps"></detailCard> -->
                <div class="card" v-for="item in form.products">
                    <div class="left">
                        <div style="display: flex; flex-direction: column;">
                            <van-image width="50" height="50" :src="item.product.imageUrl" />
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
                <!-- 优惠券 -->
                <van-coupon-cell />
                <!-- 会员折扣 -->
                <van-cell title="会员折扣" value="没有折扣" />
                <!-- v-show="this.form.type==2" -->
                <van-cell title="运费" :value="form.deliveryCost + '元'" />
                <div class="total"><span>总计{{ form.orderAmount + form.deliveryCost }},实付{{ form.orderAmount +
                    form.deliveryCost }}</span> </div>
            </van-cell-group>
            <!-- 支付方式 -->
            <div class="pay">
                <div class="payMethod">支付方式</div>
                <van-radio-group v-model="form.payWay" checked-color="#ffc700">
                    <van-cell-group inset style="margin: 0;">
                        <van-cell title="微信支付" clickable @click="form.payWay = '0'" class="cell">
                            <template slot='icon'>
                                <van-icon class="iconfont icon-weixinzhifu" size="25" style="margin-right: 3px;"
                                    color="#75b836" />
                            </template>
                            <template #right-icon>
                                <van-radio name="0" />
                            </template>
                        </van-cell>
                        <van-cell title="支付宝支付" clickable @click="form.payWay = '1'">
                            <template slot='icon'>
                                <van-icon class="iconfont icon-zhifubao" size="25" style="margin-right: 5px;"
                                    color="#15b3ec" />
                            </template>
                            <template #right-icon>
                                <van-radio name="1" />
                            </template>
                        </van-cell>
                        <van-cell title="余额支付" clickable @click="form.payWay = '2'">
                            <template slot='icon'>
                                <van-icon class="iconfont icon-balance" size="25" style="margin-right: 5px;"
                                    color="#858585" />
                            </template>
                            <template #right-icon>
                                <van-radio name="2" />
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
            </div>
            <!-- 备注 -->
            <van-cell center title="备注" style="margin-top: 10px;">
                <template #right-icon>
                    <span style="color: #ffc800;" @click="toRemark">点击填写备注</span>
                </template>
            </van-cell>
        </div>
        <div class="bottom-container">
            <div class="left">合计:￥{{ form.orderAmount + form.deliveryCost }}元</div>
            <div class="right" @click="payOrder">付款</div>
        </div>
    </div>
</template>
<script>
import NavBar from "@/components/NavBar"
import detailCard from "@/components/detailCard";
import { getPhone } from '@/utils/phone'
import { orderEdit } from "@/api/order/list"
import { shopDeliverycost } from "@/api/shop/list"
import { addressList } from "@/api/address/address"
import { getNum } from "@/utils/num";
import { shoppingcartDelete } from "@/api/shoppingCart"
import { productDtl } from "@/api/product/list"
import { getShopId } from '@/utils/shop'
import { getTableId } from '@/utils/table'
export default {
    components: {
        NavBar,
        detailCard
    },
    data() {
        return {
            shopId: getShopId(),
            typeShow: false,
            actions: [{ name: '堂食' }, { name: '自提' }, { name: '外卖(加钱)' }, { name: '预约' }],
            form: {
                bookingTime: this.$store.state.order.bookingTime,
                couponAmount: this.$store.state.order.couponAmount,//优惠金额
                customerNum: getNum(),//人数
                discountAmount: this.$store.state.order.discountAmount,//折扣金额
                orderAmount: this.$store.state.order.orderAmount,//订单金额
                payWay: this.$store.state.order.payWay,
                products: this.$store.state.order.products,
                status: this.$store.state.order.status,//订单状态:0未支付，1制作中，2待收货，3已取餐，4已退单，5已删除
                type: this.$store.state.order.type,//享用方式:0堂食，1自提，2外卖(加钱),3预约
                deliveryCost: this.$store.state.order.deliveryCost,//配送费,若type为2,则必填
                orderId: this.$store.state.order.orderId,//订单编号,传入此参数表示修改订单,否则为新增订单
                phonenumber: this.$store.state.order.phonenumber,
                remark: this.$store.state.user.remark,
                tableId: getTableId(),
                takeawayAddressId: this.$store.state.order.takeawayAddressId,//地址编号
            },
            addressData: [],
            addressShow: false,
            minDate: new Date(2020, 0, 1),
            maxDate: new Date(2025, 10, 1),
            type: false,
            productDetail: [
                {
                    productName: '小蛋糕1',
                    number: '100',
                    price: '20',
                    attribute: '100ml'
                },
                {
                    productName: '小蛋糕2',
                    number: '100',
                    price: '20'
                },
                {
                    productName: '小蛋糕3',
                    number: '100',
                    price: '20'
                },
            ],
            productCardProps: {
                attribute: 'attribute',
                productName: 'productName',
                number: 'number',
                price: 'price',
                img: 'img',
            },
            show: false,
            typeName: this.$store.state.order.typeName,
            addressSelect: this.$store.state.order.addressSelect,
        }
    },
    created() {
        if (this.$store.state.shoppingCart.shoppingcartList.length == 0) {
            this.$router.back(-1)
        }
        if (this.typeName == '外卖(加钱)') {
            // 获取配送费
            shopDeliverycost({ shopId: this.shopId }).then(res => {
                this.form.deliveryCost = res.data.data
            })
        }
        this.getAddressList()
        this.getShoppingCart()
    },
    computed: {
    },
    methods: {
        confirmPicker(val) {
            let year = val.getFullYear()
            let month = val.getMonth() + 1
            let day = val.getDate()
            let hour = val.getHours()
            let minute = val.getMinutes()
            if (month >= 1 && month <= 9) { month = `0${month}` }
            if (day >= 1 && day <= 9) { day = `0${day}` }
            if (hour >= 0 && hour <= 9) { hour = `0${hour}` }
            if (minute >= 0 && minute <= 9) { minute = `0${minute}` }
            this.form.bookingTime = `${year}-${month}-${day} ${hour}:${minute}`
            // this.form.bookingTime = toString(this.form.bookingTime)
            this.show = false
        },
        onSelect(item) {
            this.show = false;
            this.selectTime = item.name
        },
        handlePhone() {
            this.form.phonenumber = getPhone()
        },
        payOrder() {
            console.log(this.form.products);
            
            this.form.products = JSON.stringify(this.form.products)
            orderEdit(this.form).then(res => {
                console.log(res.data);
                if (res.data.code == 200) {
                    // location.reload();
                    this.$router.push('/order')
                    this.form.products = JSON.parse(this.form.products)
                    // 清空购物车
                    this.form.products.map(item => {
                        shoppingcartDelete({ shoppingCartProductId: item.shoppingCartProductId }).then(res => {
                            if (res.data.code == 200) {
                                this.$toast.success(res.data.msg)
                                this.getShoppingCart()
                                this.form = {
                                    bookingTime: this.$store.state.order.bookingTime,
                                    couponAmount: this.$store.state.order.couponAmount,//优惠金额
                                    customerNum: getNum(),//人数
                                    discountAmount: this.$store.state.order.discountAmount,//折扣金额
                                    orderAmount: this.$store.state.order.orderAmount,//订单金额
                                    payWay: this.$store.state.order.payWay,
                                    products: this.$store.state.order.products,
                                    status: this.$store.state.order.status,//订单状态:0未支付，1制作中，2待收货，3已取餐，4已退单，5已删除
                                    type: this.$store.state.order.type,//享用方式:0堂食，1自提，2外卖(加钱),3预约
                                    deliveryCost: this.$store.state.order.deliveryCost,//配送费,若type为2,则必填
                                    orderId: this.$store.state.order.orderId,//订单编号,传入此参数表示修改订单,否则为新增订单
                                    phonenumber: this.$store.state.order.phonenumber,
                                    remark: this.$store.state.user.remark,
                                    tableId: getTableId(),
                                    takeawayAddressId: this.$store.state.order.takeawayAddressId,//地址编号
                                }
                            }
                        })
                    })
                } else {
                    this.$toast.fail(res.data.msg)
                    this.form.products=JSON.parse(this.form.products)
                }
            }).catch(() => {
                console.log(res.data);

            })

        },
        toRemark() {
            this.store()
            this.$router.push('/remark')
        },
        getSex(sex) {
            if (sex == '0') {
                return '先生'
            } else {
                return '女士'
            }
        },
        getDefault(item) {
            if (item == '0') {
                return false
            } else {
                return true
            }
        },
        getAddressList() {
            addressList().then(res => {
                const addressList = res.data.data.map(item => ({
                    id: item.takeawayAddressId,
                    name: item.consignee + this.getSex(item.sex),
                    address: item.adress + item.houseNumber,
                    isDefault: this.getDefault(item.isDefault),
                    tel: ""
                }));
                this.addressData = addressList;
            })
        },
        onAdd() {
            this.store()
            this.$router.push({ path: '/addressEdit/add' })
        },
        onEdit(item) {
            this.store()
            this.$router.push({ path: `/addressEdit/${item.id}` })
        },
        getShoppingCart() {
            this.form.products = this.$store.state.shoppingCart.shoppingcartList
            console.log(this.form.products);
            this.form.products.map(item => {
                productDtl({ productId: item.product.productId }).then(res => {
                    this.$set(item.product, "imageUrl", process.env.VUE_APP_BASE_API + res.data.data.imageUrl)
                    this.$set(item.product, "productName", res.data.data.productName)
                    this.$set(item.product, "price", res.data.data.price)
                })
            })
        },
        store() {
            this.$store.commit('set_book', this.form.bookingTime)
            this.$store.commit('set_couponAmount', this.form.couponAmount)
            this.$store.commit('set_discountAmount', this.form.discountAmount)
            this.$store.commit('set_orderAmount', this.form.orderAmount)
            this.$store.commit('set_payWay', this.form.payWay)
            this.$store.commit('set_products', this.form.products)
            this.$store.commit('set_status', this.form.status)
            this.$store.commit('set_type', this.form.type)
            this.$store.commit('set_orderId', this.form.orderId)
            this.$store.commit('set_phonenumber', this.form.phonenumber)
            this.$store.commit('set_takeawayAddressId', this.form.takeawayAddressId)
            this.$store.commit('set_typeName', this.typeName)
            this.$store.commit('set_addressSelect', this.addressSelect)
        },
        selectType(item, index) {
            this.typeShow = false;
            this.form.type = index
            this.typeName = item.name
            if (index == 2) {
                // 获取配送费
                shopDeliverycost({ shopId: this.shopId }).then(res => {
                    this.form.deliveryCost = res.data.data
                })
            }

        },
        selectAddress(item) {
            this.addressSelect = item.address
            this.addressShow = false
        }
    }
}
</script>
<style lang="scss" scoped>
.total {
    height: 45px;
    display: flex;
    justify-content: end;
    align-items: center;
    padding: 10px;
}

.pay {
    margin-top: 10px;
    width: 100%;
    background-color: #fff;

    .payMethod {
        padding: 10px;
        box-sizing: border-box;
        height: 45px;
        line-height: 25px;
    }
}

.cell {
    align-items: center;
}

.bottom-container {
    width: 100%;
    background-color: #fff;
    height: 60px;
    z-index: 1;
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .right {
        width: 100px;
        text-align: center;
        background-color: #fec702;
        height: 100%;
        line-height: 60px;
    }

    .left {
        flex: 1;
        margin-left: 10px;
    }

}

::v-deep .van-button--danger {
    color: #fff;
    background-color: #fec702;
    border: 1px solid #fec702;
}

::v-deep .van-tag--danger {
    background-color: #fec702;
}

::v-deep .van-address-item .van-radio__icon--checked .van-icon {
    background-color: #fec702;
    border-color: #fec702;
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
</style>