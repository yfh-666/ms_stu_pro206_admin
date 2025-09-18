<template>
    <!-- 购物车小卡片 -->
    <div class="shopping-cart-item">
        <div class="left">
            <div class="product-name">{{ data[props.productName] }}</div>
            <div class="attribute" v-if="data[props.attribute] ">{{ data[props.attribute] }}</div>
        </div>
        <div class="price">￥{{ data[props.price]}}</div>
        <div class="number">
            <van-icon class="iconfont icon-jianhao" size="20" @click="reduce" />
            <span ref="number">{{ data[props.number] }}</span>
            <van-icon name="add-o" size="20" color="#f9ca02"  @click="add"/>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        props: {
            type: Object,
            default: () => ({
                attribute: 'attribute',
                productName: 'productName',
                number: 'number',
                price: 'price'
            })
        }
    },
    methods:{
        reduce(){
            if (this.$refs.number.textContent>0) {
                this.$refs.number.textContent--
            }
        },
        add(){
            this.$refs.number.textContent++
        }
    }
}
</script>
<style scoped lang="scss">
 .shopping-cart-item {
        display: flex;
        padding: 10px;
        width: 100%;
        height: 60px;
        box-sizing: border-box;
        align-items: center;
        border-bottom: 1px solid #f6f6f6;

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
</style>