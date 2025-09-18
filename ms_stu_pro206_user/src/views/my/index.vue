<template>
  <div>
    <NavBar navTitle="我的"></NavBar>
    <div class="my-container">
      <van-icon name='user-circle-o' size="100" color="#ffc901"/>
      
      <div class="user-info">{{ phone }}</div>
      <van-button type="primary" @click="toLogin" style="width: 90%;" color="#ffc901" round>退出登录</van-button>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar"
import { removeToken } from '@/utils/auth'
import { removeNum } from '@/utils/num'
import { removePhone, getPhone } from '@/utils/phone'
import { getShopId } from '@/utils/shop'
import { getTableId, getTableNumber } from '@/utils/table'
export default {
  components: {
    NavBar
  },
  data() {
    return {
      phone: getPhone()
    }

  },
  methods: {
    toLogin() {
      removeToken()
      removePhone()
      removeNum()
      console.log(`/login/${getShopId()}/${getTableId()}/${getTableNumber()}`);
      this.$router.replace({ name: 'Login' })
      location.reload();
    }
  }
}
</script>
<style lang="scss" scoped>
.my-container {
  margin: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 200px;
  align-items: center;
  justify-content: space-around;
}
</style>