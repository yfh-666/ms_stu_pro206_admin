<template>
    <div class="card">
        <div class="left">
            <div style="display: flex; flex-direction: column;">
                <van-image width="50" height="50" :src="data[props.img]" />
                <div style="font-size: 12px; color: #c6c6c6;" v-if="data[props.attribute]">{{ data[props.attribute] }}
                </div>
            </div>
            <div class="product-name">{{ data[props.productName] }}</div>
        </div>
        <div class="right">
            <div class="number">x{{ data[props.number] }}</div>
            <div class="money">￥{{ data[props.price] }}</div>
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
                price: 'price',
                img: 'img',
            })
        }
    }
}
</script>
<style lang="scss"scoped>
.card {
    height: 80px;
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