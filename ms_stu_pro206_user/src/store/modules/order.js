
const order = {
  state: {
    bookingTime: '',
    couponAmount: 0,//优惠金额
    discountAmount: 0,//折扣金额
    orderAmount: undefined,//订单金额
    payWay: "0",
    products: [],
    status: 0,//订单状态:0未支付，1制作中，2待收货，3已取餐，4已退单，5已删除
    type: 7,//享用方式:0堂食，1自提，2外卖(加钱),3预约
    deliveryCost: 0,//配送费,若type为2,则必填
    orderId: undefined,//订单编号,传入此参数表示修改订单,否则为新增订单
    phonenumber: '',
    // remark: this.$store.state.user.remark,
    takeawayAddressId: undefined,//地址编号
     typeName:"",
     addressSelect:"",
  },

  mutations: {
    set_book: (state, bookingTime) => {
      state.bookingTime = bookingTime
    },
    set_addressSelect: (state, addressSelect) => {
      state.addressSelect = addressSelect
    },
    set_typeName: (state, typeName) => {
      state.typeName = typeName
    },
    set_couponAmount: (state, couponAmount) => {
      state.couponAmount = couponAmount
    },
    set_discountAmount: (state, discountAmount) => {
      state.discountAmount = discountAmount
    },
    set_orderAmount: (state, orderAmount) => {
      state.orderAmount = orderAmount
    },
    set_payWay: (state, payWay) => {
      state.payWay = payWay
    },
    set_products: (state, products) => {
      state.products = products
    },
    set_status: (state, status) => {
      state.status = status
    },
    set_type: (state, type) => {
      state.type = type
    },
    set_deliveryCost: (state, deliveryCost) => {
      state.deliveryCost = deliveryCost
    },
    set_orderId: (state, orderId) => {
      state.orderId = orderId
    },
    set_phonenumber: (state, phonenumber) => {
      state.phonenumber = phonenumber
    },
    set_takeawayAddressId: (state, takeawayAddressId) => {
      state.takeawayAddressId = takeawayAddressId
    },
  },

  actions: {
  }
}

export default order