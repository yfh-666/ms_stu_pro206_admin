<template>
    <div class="scan-container">
        <NavBar navTitle="扫码点餐"></NavBar>
        <div class="page-container align-center">
            <!-- 餐厅标志和桌号 -->
            <div class="restaurant-info">
                <van-image width="75" height="75" class='restaurant-logo' :src="shopData.shopAvatarUrl" round/>
                <div class="restaurant-name">{{ shopData.shopName }}</div>
                <div class="table-number">{{ tableNumber + '桌' }}</div>
                <div class="selectInfo">请选择就餐人数</div>
            </div>

            <!-- 就餐人数选择器 -->
            <div class="flex-container">
                <div v-for="(item, index) in numbers" :key="index"
                    :class="['flex-item', { 'selected-item': selectedIndex === index + 1 }]" @click="getNumber(index)">
                    {{ item }}
                </div>
            </div>

            <!-- 确定按钮 -->
            <van-button class="confirm-button" @click="onConfirm">确定</van-button>
        </div>
    </div>
</template>
<script>
import NavBar from "@/components/NavBar"
import { setNum } from '@/utils/num'
import { shopIntroduction } from '@/api/shop/list'
import { getShopId } from '@/utils/shop'
import { getTableNumber } from '@/utils/table'
export default {
    components: {
        NavBar
    },
    data() {
        return {
            numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // 就餐人数选项  
            selectedIndex: undefined,
            shopData: {},
            tableNumber: getTableNumber(),
            shopId: getShopId()
        };
    },
    created() {
        shopIntroduction({ shopId: this.shopId }).then(res => {
            this.shopData = Object.assign({}, res.data.data)
            this.shopData.shopAvatarUrl=process.env.VUE_APP_BASE_API+this.shopData.shopAvatarUrl
            // console.log(this.shopData);
            
        })
    },
    methods: {
        getNumber(index) {
            this.selectedIndex = index + 1;
        },
        onConfirm() {
            if (this.selectedIndex !== undefined) {
                setNum(this.selectedIndex)
                this.$router.push('/menu')
                console.log(this.$store.state.user.customerNum);
            } else {
                this.$toast.fail('请选择就餐人数')
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.restaurant-info {
    display: flex;
    flex-direction: column;
    height: 175px;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
}

.restaurant-name {
    font-size: 20px;
    font-weight: bold;
    font-family: '宋体';
}

.restaurant-logo {
    width: 60px;
    height: 60px;
    margin-right: 10px;
}

.flex-container {
    display: flex;
    width: 330px;
    flex-wrap: wrap;
    align-content: center;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.flex-item {
    text-align: center;
    height: 75px;
    width: 75px;
    line-height: 75px;
    background-color: #fff;

}

.selected-item {
    background-color: #ea504e;
    color: #fff;
}

.table-number {
    font-size: 20px;
    font-weight: bold;
    color: #f2db61;
}

.selectInfo {
    color: #afb8bb;
    font-size: 16px;
    font-family: '宋体';
}

.confirm-button {
    background-color: #ffab31;
    color: #fff;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    margin-top: 20px;
    width: 100%;
}
</style>