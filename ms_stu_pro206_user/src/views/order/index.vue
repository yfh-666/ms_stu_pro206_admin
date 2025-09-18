<template>
  <div>
    <NavBar navTitle="订单"></NavBar>
    <van-tabs v-model:active="queryParams.type" sticky color="#c37280" @change="typeChange">
      <van-tab v-for="item in typeList" :title="item.title" :name="item.index">
      </van-tab>
    </van-tabs>
    <van-tabs v-model:active="queryParams.status" color="#6498c1" @change="statusChange">
      <van-tab v-for="item in statusList" :title="item.title" :name="item.index">
      </van-tab>
    </van-tabs>
    <!-- 订单内容 -->
    <div class="page-container padding order-container">
      <div class="order-item" v-for="item in orderData">
        <div class="top">
          <div class="left">
            <div class="shopName">{{ item.shopName }}</div>
            <div class="orderNum">
              <van-tag plain color="#ead6a1">{{ status(item.status) }}</van-tag>
              <span class="num">订单编号{{ item.orderNum }}</span>
            </div>
          </div>
          <div class="right">{{ type(item.type) }}</div>
        </div>
        <div class="middle" v-if="item.product.length !== undefined">
          <van-image width="80" height="80" :src="item2.product.imageUrl" radius="5px"
            v-if="item2.product !== undefined && item2.product.imageUrl !== undefined" v-for="item2 in item.product" />
        </div>
        <div class="bottom">
          <div class="time-cost">
            <div class="time">{{ item.createTimes }}</div>
            <div class="cost">共5件商品，实付￥{{ item.paidAmount }}</div>
          </div>
          <div class="detail">
            <van-button plain type="primary" color="#7d7d7d" style="width: 100px; " v-show="item.status != 0"
              @click='toDetail(item.orderId)'>订单详情</van-button>
            <van-button plain color="#ffc901" style="width: 100px;" v-show="item.status == 0"
              @click='toPayMoney(item)'>去支付</van-button>
          </div>
        </div>
      </div>
      <van-empty description="这里是空的哦！" v-if="orderData.length == 0" />
    </div>
    <van-dialog v-model="comfirmShow" title="确认支付？" show-cancel-button @confirm="payMoney">
    </van-dialog>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar"
import { orderList } from "@/api/order/list"
import { productCredits, productUpdate } from "@/api/product/list"
import { orderPay } from "@/api/order/list"
import { getShopId } from "@/utils/shop"
export default {
  components: {
    NavBar
  },
  data() {
    return {
      comfirmShow: false,
      activeOrder: 0,
      activeStatus: 0,
      queryParams: {
        status: 6,
        type: 0
      },
      typeList: [{ title: "堂食", index: 0 }, { title: "自提", index: 1 }, { title: "外卖", index: 2 }, { title: "预约", index: 3 },],
      statusList: [{ title: "全部", index: 6 }, { title: "未支付", index: 0 }, { title: "制作中", index: 1 }, { title: "待收货", index: 2 }, { title: "已取餐", index: 3 }, { title: "已退单", index: 4 },],
      orderData: [],
      products: [],
      credits: {},
      creditsForm: [],
      payForm: {
        givenCredits: undefined,
        orderId: undefined,
        pointsCost: 0
      },
      productList: [],
      productList: [],
      updateForm: {},
    }
  },
  computed: {
    type() {
      return function (type) {
        const typeVal = this.typeList.filter(item => item.index == type)
        return typeVal[0].title
      }
    },
    status() {
      return function (status) {
        const statusVal = this.statusList.filter(item => item.index == status)
        return statusVal[0].title
      }
    }
  },
  created() {
    this.getList()

  },
  methods: {
    toDetail(orderId) {
      this.$router.push({
        path: `/orderDetail/${orderId}`
      })
    },

    getList() {
      orderList(this.queryParams).then(res => {
        this.orderData = res.data.data
        this.orderData.map(item => {
          item.products = JSON.parse(item.products)
          let product = JSON.parse(JSON.stringify(item.products))
          item.product = product
        })

      })
    },
    statusChange(e) {
      this.getList()
    },
    typeChange(e) {
      this.getList()

    },
    toPayMoney(item) {
      this.products = item.products
      this.creditsForm = []
      this.payForm.orderId = item.orderId
      if (this.products.length != undefined) {
        this.products.map(item => {
          this.credits = {}
          this.$set(this.credits, 'productId', item.product.productId)
          this.$set(this.credits, 'copies', item.product.copies)
          this.creditsForm.push(this.credits)
        })
        productCredits(this.creditsForm).then(res => {
          this.payForm.givenCredits = res.data.data
        })
        this.comfirmShow = true
      }
      else {
        this.$toast.fail('找不到该商品')
      }

    },
    payMoney() {
      orderPay(this.payForm).then(res => {
        if (res.data.code == 200) {
          this.$toast.success(res.data.msg)
          this.getList()
          this.products.map(item => {
            this.updateForm = {}
            this.$set(this.updateForm, 'productList[0].copies', item.product.copies)
            this.$set(this.updateForm, 'productList[0].productId', item.product.productId)
            this.$set(this.updateForm, 'shopId', getShopId())
            productUpdate(this.updateForm).then(res => {
              console.log(res);
            })
          })
        }else{
          this.$toast.fail(res.data.msg)
        }
      })

    }
  }
}
</script>
<style lang="scss" scoped>
.order-item {
  width: 100%;
  margin-top: 10px;
  // height: 350px;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;

  .top {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #fbf9fa;

    .left {
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: space-between;

      .num {
        font-size: 12px;
        margin-left: 10px;
        box-sizing: border-box;
        color: #b3b3b3;
      }
    }

    .right {
      height: 100%;
      line-height: 60px;
      width: 50px;
      color: #e0d56b;
    }
  }

  .middle {
    margin: 10px 0;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;

    .img {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 80px;

    .time-cost {
      display: flex;
      justify-content: space-between;
      width: 100%;

      .time {
        color: #a5a5a5;
      }
    }

    .detail {
      display: flex;
      justify-content: end;
      width: 100%;


    }
  }

  ::v-deep .van-dialog__confirm {
    color: #e0d56b;
  }


}
</style>