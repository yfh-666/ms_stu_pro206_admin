<template>
    <div style="width: 100%;">
        <NavBar navTitle="点餐"></NavBar>
        <div class="page-container" style="position: relative;width: 100%;height: 100vh; ">
            <div class="title-conatiner">
                <van-image width="50" height="50" :src="shopDetail.shopAvatarUrl" />
                <div class="text-contaner">
                    <div class="item">
                        <div>{{ shopDetail.shopName }}</div>
                        <!-- <div style="color: #c3c3c1;">{{ shopDetail.shopName }}</div> -->
                    </div>
                    <div class="item">
                        <div>桌位号:{{ tableId }}</div>
                        <div>人数:{{ customerNum }}</div>
                    </div>
                </div>
            </div>
            <!-- 顶部通告 -->
            <van-notice-bar left-icon="volume-o" text="新店开张" scrollable style="width: 100%;box-sizing: border-box;" />
            <!-- 菜单部分 -->
            <div class="menu-container">
                <!-- 菜单左边 -->
                <div class="left-menu" ref="left">
                    <ul>
                        <div v-for="(item, index) in mealList" :key="index" @click="selectItem(index, $event)"
                            :class="['menu-item', { 'menu-item-active': currentIndex === index }]">
                            <span>{{ item.productTypeName }}</span>
                            <div><van-badge :content="item.count" v-show="item.count > 0"></van-badge></div>
                        </div>

                    </ul>
                </div>
                <!-- 右侧 -->
                <div class="right-list" ref="right">
                    <ul>
                        <div v-for="(item, index) in mealList" :key="index" class="right-item-hook right-item">
                            <div class="list-title">
                                <div class="title">{{ item.productTypeName }}</div>
                                <van-icon name="good-job" color="#d83b26" />
                            </div>
                            <div v-for="(item2, index2) in item.productVoList"
                                :class="['content-list', { sellOut: item2.stock < 1 || item2.stock == undefined }]">
                                <van-image width="75" height="75" :src="item2.coverUrl" class="cover" />
                                <div class="text-list">
                                    <div class="item-name">{{ item2.productName }}</div>
                                    <div class="item-status">
                                        <div class="money">
                                            ￥{{ item2.price }}
                                        </div>
                                        <div class="status">
                                            <van-stepper v-model="item2.copies" max="8" v-if="item2.copies > 0"
                                                theme="round" button-size="16" :max="mealDetail.stock" min="0" step="0"
                                                @plus="chooseSpecification(item2.productId)" 
                                                @minus="handleMinus(item2)" />
                                            <van-tag round type="primary" @click="chooseSpecification(item2.productId)"
                                                color="#ffc901"
                                                v-else-if="(item2.stock > 0) && (!item2.copies)">选规格</van-tag>
                                            <div v-else>已售完</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ul>
                </div>

            </div>
            <!-- 底部下单 -->
            <div class="bottom-box">
                <div class="shop_cartBox">
                    <van-icon name="bag-o" size="50" class="bag" color="#7da29c" @click="shopCartShow = true"
                        :badge="orderTotal" />
                </div>
                <div class="text">
                    <div class="all_money">{{ orderAmount }}</div>
                    <div class="account" @click="toPay">去结算</div>
                </div>
            </div>
        </div>
        <!-- 选取规格弹窗 -->
        <van-overlay :show="show" @click="closeCard">
            <div class="meal-detail" @click.stop>
                <van-icon name="cross" class='cross' @click="closeCard" />
                <van-image width="120" height="120" :src="mealDetail.imageUrl" class="img" />
                <div class="describe">
                    <div class="title">{{ mealDetail.productName }}</div>
                    <div class="title-detail" style="color: #bdbdbd; font-size: 12px;"> {{ mealDetail.details }} </div>
                </div>
                <div class="attribute-type" v-for="(item, index) in mealDetail.specification">
                    <div>{{ item.specify }}</div>
                    <div class="select-items">
                        <template v-for="value in item.values">
                            <div :class="['attribute', { active: item.active == value }]"
                                @click="handleAttribute(item, value, index)">{{ value }}</div>
                        </template>
                    </div>
                </div>
                <div class="bottom">
                    <div class="detail">
                        <div class="left">
                            <div>￥{{ mealDetail.price }}</div>
                        </div>
                        <div class="right">
                            <div>库存:{{ mealDetail.stock }}</div>
                            <van-stepper v-model="mealDetail.copies" theme="round" button-size="16" disable-input
                                min="0" :max="mealDetail.stock"/>
                        </div>
                    </div>
                    <div class="add" @click="addShoppingCart">加入购物车</div>
                </div>
            </div>
        </van-overlay>
        <!-- 购物车弹窗 -->
        <van-overlay :show="shopCartShow" @click="closeShoppingCart">
            <div class="shopping-cart">
                <div style="text-align: end; height: 20px; background-color: #dce6e9; width: 100%;"
                    @click="clearShoppingcart">
                    清空</div>
                <div class="shopping-cart-item" v-for="item in shoppingCartList" @click.stop>
                    <div class="left">
                        <div class="product-name">{{ item.product.productName }}</div>
                        <div class="attribute" v-for="item2 in item.product.specification">{{ item2.value }}</div>
                    </div>
                    <div class="price">￥{{ item.product.price * item.product.copies }}</div>
                    <van-stepper v-model="item.product.copies" theme="round" button-size="16" disable-input
                        :max="item.product.stock" min="0" @change="handleShopChange(item)" />
                </div>
                <div style="width: 100%; height: 60px; background-color: #fff;"></div>
            </div>
        </van-overlay>
    </div>
</template>
<script>
import NavBar from "@/components/NavBar"
import BScroll from 'better-scroll'
import ShoppingCartItem from "@/components/shoppingCartItem.vue";
import { productList, productDtl } from "@/api/product/list"
import { shopIntroduction } from "@/api/shop/list"
import { shoppingcartDtl, shoppingcartEdit, shoppingcartDelete, shoppingcartAdd } from "@/api/shoppingCart"
import { getNum } from "@/utils/num";
import { getShopId } from '@/utils/shop'
import { getTableNumber } from '@/utils/table'
import { _debounce, _throttle } from '@/utils/index.js'
export default {
    components: {
        NavBar,
        ShoppingCartItem
    },
    data() {
        return {
            tableId: getTableNumber(),
            orderAmount: 0,
            orderTotal: 0,
            shopDetail: [],
            inputNum: 0,
            customerNum: undefined,
            specification: [],
            shopId: getShopId(),
            listHeight: [],
            scrollY: 0, //实时获取当前y轴的高度
            clickEvent: false,
            stock: 11,
            shopCartShow: false,
            showBottom: true,
            show: false,
            mealList: [],
            mealDetail: {
            },
            // 购物车列表
            shoppingCartList: [],
            // 左边被选中
            selectedIndex: 0,
            total: 0,
            shoppingCart: {},
            value: [],
            attributeName: [],
            specification: [],
            shoppingCartProductId: undefined,
        }
    },
    created() {
        this.customerNum = getNum()
        shopIntroduction({ shopId: this.shopId }).then(res => {
            this.shopDetail = res.data.data
            this.shopDetail.shopAvatarUrl = process.env.VUE_APP_BASE_API + this.shopDetail.shopAvatarUrl

        })

    },
    methods: {
        getList() {
            productList({ shopId: this.shopId }).then(res => {
                this.mealList = res.data.data
                this.mealList.map(item => {
                    item.productVoList.map(item2 => {
                        item2.coverUrl = process.env.VUE_APP_BASE_API + item2.coverUrl
                    })
                })
                this.shoppingCartList.map(item => {
                    this.countCopies = 0
                    // item.product = JSON.parse(item.product)
                    this.mealList.map(item2 => {
                        item2.productVoList.map(item3 => {
                            if (item.product.productId == item3.productId) {
                                this.$set(item3, 'copies', item.product.copies)
                            }
                        })
                    })
                })
                this.getCopiesList()
                this.$nextTick(() => {
                    this._initScroll()
                    this._getHeight()
                })
            })
        },
        // 获取购物车列表
        getShoppingCart() {
            shoppingcartDtl({ shopId: this.shopId }).then(res => {
                this.shoppingCartList = res.data.data
                this.shoppingCartList.forEach((item, index) => {
                    item.product = JSON.parse(item.product)
                    productDtl({ productId: item.product.productId }).then(res => {
                        this.$set(item.product, 'productName', res.data.data.productName)
                        this.$set(item.product, 'price', res.data.data.price)
                    }
                    )
                })
                this.getCount()
                // console.log(this.shoppingCartList);
            })
            this.getList()

        },
        // 选择规格弹窗
        chooseSpecification(e) {
            this.$toast.loading({
                message: '加载中...',
                forbidClick: true,
            });
            productDtl({ productId: e }).then(res => {
                this.mealDetail = res.data.data
                let specify = JSON.parse(this.mealDetail.specification)
                this.mealDetail.specification = specify.specifyData
                this.mealDetail.imageUrl = process.env.VUE_APP_BASE_API + res.data.data.imageUrl
                this.shoppingCartList.map(item => {
                    if (item.product.productId == this.mealDetail.productId) {
                        this.$set(this.mealDetail, 'copies', item.product.copies)
                        this.$set(this.mealDetail, 'shoppingCartProductId', item.shoppingCartProductId)
                        if (this.mealDetail.specification !== undefined) {
                            this.mealDetail.specification.map((item1, index1) => {
                                item.product.specification.map((item2, index2) => {
                                    if (item1.specify == item2.specify) {
                                        this.$set(item1, 'active', item2.active)

                                    }
                                })
                            })
                        }

                    }
                })

            })
            this.show = true
            // })
        },
        // 选择规格
        handleAttribute(item, val, index) {
            this.$set(item, 'active', val)
            this.value[index] = val
            this.attributeName[index] = item.specify
            this.specification = this.attributeName.map((name, index) => ({
                attributeName: name,
                value: this.value[index]
            }));
        },
        // 加入购物车
        addShoppingCart() {
            this.shoppingCart = Object.assign({}, this.mealDetail)
            this.shoppingCartProductId = this.mealDetail.shoppingCartProductId
            this.$toast.loading({
                message: '加载中...',
                forbidClick: true,
            });
            if (this.shoppingCartProductId == undefined) {
                // 新增
                // this.shoppingCart.specification.length > 0
                if (this.shoppingCart.copies > 0) {
                    this.shoppingCart = JSON.stringify(this.shoppingCart)
                    shoppingcartAdd({ product: this.shoppingCart, shopId: this.shopId }).then(res => {
                        if (res.data.code == 200) {
                            this.$toast.success(res.data.msg)
                            this.getList()
                            this.getShoppingCart()
                        } else {
                            this.$toast.fail(res.data.msg);
                        }
                    })
                } else {
                    this.$toast.fail('请选择规格与数量');
                }
            } else {
                if (this.shoppingCart.copies > 0) {
                    this.shoppingCart = JSON.stringify(this.shoppingCart)
                    shoppingcartEdit({ product: this.shoppingCart, shoppingCartProductId: this.shoppingCartProductId }).then(res => {
                        if (res.data.code == 200) {
                            this.$toast.success(res.data.msg)
                            this.getList()
                            this.getShoppingCart()
                        } else {
                            this.$toast.fail(res.data.msg);
                        }
                    })
                } else {
                    this.$toast.fail('请选择规格与数量');
                }
            }
            this.getShoppingCart()
            this.closeCard()

        },
        _initScroll() {
            this.lefts = new BScroll(this.$refs.left, {
                click: true
            })
            this.rights = new BScroll(this.$refs.right, {
                probeType: 3,
                click: true
            })
            this.rights.on('scroll', (pos) => {
                this.scrollY = Math.abs(Math.round(pos.y))

            })
        },
        _getHeight() {
            let rightItems = this.$refs.right.getElementsByClassName('right-item-hook')
            let height = 0
            this.listHeight.push(height)
            for (let i = 0; i < rightItems.length; i++) {
                let item = rightItems[i]
                height += item.clientHeight
                this.listHeight.push(height)
            }
        },
        selectItem(index, event) {
            this.clickEvent = true
            if (!event._constructed) {
                return
            } else {
                let rightItems = this.$refs.right.getElementsByClassName('right-item-hook')
                let el = rightItems[index]
                // this.rights.scrollToElement(el)
                this.rights.scrollToElement(el, 300)

            }
        },
        toPay() {
            if (this.shoppingCartList.length > 0) {
                // console.log(this.shoppingCartList);
                this.$store.commit('SET_SHOPPINGCART', this.shoppingCartList)
                this.$store.commit('set_orderAmount', this.orderAmount)
                this.$router.push('/pay')
            } else {
                this.$toast.fail('购物车为空');
            }

        },
        // 关闭卡片
        closeCard() {
            this.show = false
            // this.inputNum = 0
            this.shoppingCart = {},
                this.mealDetail = {}
        },
        stepperChange(e) {
            this.inputNum = e
        },
        closeShoppingCart() {
            this.shopCartShow = false,
                this.shoppingCartProductId = undefined
        },
        handleMinus: _throttle(function (item) {
            this.shoppingCartList.map(item2 => {
                let product = item2.product
                if (product.productId == item.productId) {
                    this.$set(item, 'shoppingCartProductId', item2.shoppingCartProductId)
                    product.copies = product.copies - 1
                    if (product.copies == 0) {
                        shoppingcartDelete({ shoppingCartProductId: item2.shoppingCartProductId }).then(res => {
                            this.$toast.success(res.data.msg)
                            this.getList()
                        })
                    } else {
                        product = JSON.stringify(product)
                        this.$set(item, 'product', product)
                        shoppingcartEdit({ product: item.product, shoppingCartProductId: item.shoppingCartProductId }).then(res => {
                            if (res.data.code == 200) {
                                this.$toast.success(res.data.msg)
                                this.getList()
                                this.getShoppingCart()
                            } else {
                                this.$toast.fail(res.data.msg);
                            }
                        }).catch(() => {
                        })

                    }
                }
            })
        }, 1000),
        handleShopChange:_debounce(function (item) {
            let product = item.product
            if (product.copies == 0) {
                shoppingcartDelete({ shoppingCartProductId: item.shoppingCartProductId }).then(res => {
                    this.$toast.success(res.data.msg)
                    this.getList()
                    this.getShoppingCart()
                })
            } else {
                product = JSON.stringify(product)
                shoppingcartEdit({ product: product, shoppingCartProductId: item.shoppingCartProductId }).then(res => {
                    if (res.data.code == 200) {
                        this.$toast.success(res.data.msg)
                        this.getList()
                        this.getShoppingCart()

                    } else {
                        this.$toast.fail(res.data.msg);
                    }
                })
            }
        }, 1000),
        clearShoppingcart() {
            this.shoppingCartList.map(item => {
                shoppingcartDelete({ shoppingCartProductId: item.shoppingCartProductId }).then(res => {
                    this.$toast.success(res.data.msg)
                    this.getShoppingCart()
                    this.getList()
                })
            })

        },
        getCount() {
            this.orderTotal = 0
            this.orderAmount = 0
            this.shoppingCartList.map(item => {
                this.orderTotal += item.product.copies
                this.orderAmount += item.product.copies * item.product.price
            })
        },
        getCopiesList() {
            this.mealList.forEach(item => {
                let count = 0
                item.productVoList.forEach(item2 => {
                    if (item2.copies != undefined)
                        count += item2.copies
                })
                item.count = count
            })
        },
        handleShow() {
            this.show = true
        }

    },

    mounted() {

        this.getList()
        this.getShoppingCart()
    },
    computed: {
        // 菜单左右联动
        currentIndex() {
            for (let i = 0; i < this.listHeight.length; i++) {
                let height = this.listHeight[i]
                let height2 = this.listHeight[i + 1]
                //当height2不存在的时候，或者落在height和height2之间的时候，直接返回当前索引
                //>=height，是因为一开始this.scrollY=0,height=0
                if (!height2 || (this.scrollY >= height && this.scrollY < height2)) {
                    return i
                }
                if (this.listHeight[this.listHeight.length - 1] - this.$refs.right.clientHeight <= this.scrollY) {
                    if (this.clickTrue) {
                        return this.currentNum
                    } else {
                        return (this.listHeight.length - 1)
                    }
                }

            }
            //如果this.listHeight没有的话，就返回0
            return 0
        },
    }
}

</script>
<style lang="scss" scoped>
.title-conatiner {
    width: 100%;
    height: 66px;
    padding: 10px;
    display: flex;
    align-items: center;
    box-sizing: border-box;

    .text-contaner {
        font-family: '宋体';
        width: 70%;
        margin-left: 10px;
        display: flex;
        justify-content: space-between;

        .item {
            display: flex;
            flex-direction: column;
        }
    }
}

::v-deep .van-info.van-sidebar-item__info {
    position: absolute;
    right: -30px;
    top: 0px;
    background-color: #e2cd23;
}

::v-deep .van-badge {
    background-color: #ffc901;
}

.menu-item {
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.menu-item-active {
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #fff;
}

.menu-container {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    position: absolute;
    overflow: auto;
    height: 100%;
    background-color: #fff;

    // 菜单左边
    .left-menu {
        width: 30%;
        background-color: #f5f5f5;
        box-sizing: border-box;
        overflow: auto;
    }

    // 菜单右边
    .right-list {
        flex: 1;
        box-sizing: border-box;
        // background-color: #fff ;
        padding-left: 10px;
        height: 10px;

        .list-title {
            background-color: #fff;
            height: 60px;
            width: 100%;
            display: flex;
            align-items: center;

            .title {
                margin-right: 10px;
            }
        }

        .content-list {
            background-color: #fff;
            height: 100px;
            width: 100%;
            display: flex;
            padding: 10px;
            box-sizing: border-box;



            .text-list {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding-left: 5px;
                box-sizing: border-box;

                .item-status {
                    display: flex;
                    justify-content: space-between;


                }
            }
        }

    }
}

.number {
    width: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.bottom-box {

    width: 95%;
    height: 50px;
    background-color: #fff;
    z-index: 111;
    position: fixed;
    bottom: 60px;
    left: 10px;
    border-radius: 25px;
    display: flex;


    .shop_cartBox {
        flex: 1;
        position: relative;

        .bag {
            left: 50px;
            position: absolute;
        }
    }

    .text {
        display: flex;
        width: 70%;
        align-items: center;

        .all_money {
            width: 60%;
        }

        .account {
            width: 40%;
            display: flex;
            justify-content: center;
            height: 100%;
            line-height: 50px;
            background-color: #ffc901;
            color: #fff;
            border-radius: 0 25px 25px 0;
        }
    }
}

.meal-detail {
    width: 80%;
    height: auto;
    background-color: #fff;
    margin: auto;
    margin-top: 30%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    z-index: 1000000;

    .describe {
        padding-left: 10px;
        box-sizing: border-box;
    }

    .attribute-type {
        padding: 10px;
        box-sizing: border-box;
    }

    .cross {
        position: absolute;
        color: #a6a6a6;
        right: 10px;
        top: 10px;
    }

    .img {
        align-self: center;
        padding: 10px;
        box-sizing: border-box;
    }

    .select-items {
        margin-top: 10px;
        display: flex;

        .attribute {
            margin-right: 10px;
            background-color: #f6f6f6;
            color: #c6c6c6;
            width: 60px;
            height: 35px;
            border-radius: 5px;
            text-align: center;
            line-height: 35px;
        }

        .attribute.active {
            background-color: #feca01 !important;
            color: #fff !important;
        }
    }

    .detail {
        padding-left: 10px;
        box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        background-color: #f6f6f6;
        display: flex;
        align-items: center;

        .left {
            flex: 1;
        }

        .right {
            width: 175px;
            display: flex;
            font-size: 20px;

            .number {
                align-self: center;
                margin-left: 10px;
            }
        }
    }

    .add {
        height: 60px;
        width: 100%;
        text-align: center;
        line-height: 60px;
        background-color: #feca01;
        box-sizing: border-box;
        color: #fff;

    }
}

::v-deep .van-stepper--round .van-stepper__plus {
    background-color: #feca01;
}

::v-deep .van-stepper--round .van-stepper__minus {
    color: #000;
    border: 1px solid #000;
}

.border {
    border: 1px solid black;
}

.shopping-cart {
    position: absolute;
    bottom: 50px;
    width: 100%;
    background-color: #fff;
}

.shopping-cart-item {
    display: flex;
    padding: 10px;
    width: 100%;
    height: 70px;
    box-sizing: border-box;
    align-items: center;
    border-bottom: 1px solid #f6f6f6;

    .product-name {
        font-size: 15px;
    }

    .attribute {
        font-size: 12px;
        color: #a6a6a6;
    }

    .left {
        flex: 2;
    }

    .price {
        flex: 1;
    }

    .number {
        flex: 1;
    }
}

.sellOut {
    background-color: #f5f5f5 !important;
}
</style>