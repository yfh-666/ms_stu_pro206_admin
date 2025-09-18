<template>
  <div class="login-container">
    <NavBar navTitle="登录"></NavBar>
    <div class="page-container login">
      <h3 style="margin-bottom: 20px;">欢迎登录</h3>
      <van-form style="width: 100%;" ref='form' validate-trigger="onSubmit" @submit="submit">
        <van-field v-model="form.phonenumber" placeholder="请输入手机号"
          :rules="[{ validator: validatorphonenumber, required: true, message: '请输入手机号' }]" />
        <!-- <van-field v-model="form.phonenumber" placeholder="请输入姓名"
          :rules="[{ validator: validatorphonenumber, required: true, message: '请输入姓名' }]" />
        <van-field v-model="form.phonenumber" placeholder="请输入昵称"
          :rules="[{ validator: validatorphonenumber, required: true, message: '请输入昵称' }]" /> -->
        <!-- <div style="color: #c8c9cc; font-size: 14px; margin-left: 12px;">未注册的手机号验证后自动创建账号</div> -->
        <van-field v-model="form.code" placeholder="请输入验证码" :rules="[{ required: true, message: '请输入验证码' }]">
          <template #button>
            <div class="button" @click="countdownChange">{{ countdown.validText
              }}</div>
          </template>
        </van-field>
        <van-button round block type="warning" native-type="submit" style="margin-top: 20px;">
          提交
        </van-button>
      </van-form>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar"
import { setPhone } from '@/utils/phone'
import { setShopId } from '@/utils/shop'
import { setTableId, setTableNumber } from '@/utils/table'
import { getInfo, getCode, login } from '@/api/login'
import { setToken } from '@/utils/auth'
export default {
  components: {
    NavBar
  },
  data() {
    return {
      form: {
        phonenumber: '',
        code: '',
      },
      phonenumberRules: [{
        required: true, message: '手机号码不能为空', trigger: 'onBlur'
      }],
      codeRules: [{
        required: true, message: '验证码不能为空', trigger: 'onBlur'
      }],
      countdown: {
        validText: '获取验证码',
        time: 60
      },
      flag: false,
      phonenumberReg: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    }
  },
  created() {
  },
  methods: {
    submit() {
      // getInfo({ phonenumber: this.form.phonenumber }).then(res => {
      //   console.log(res);
      // })
      login(this.form).then(res => {
        console.log(res.data.code);
        if (res.data.code == 200) {
          this.$toast.success('登录成功')
          setPhone(this.form.phonenumber)
          setToken(res.data.token)
          this.$store.commit('SET_TOKEN', res.data.token)
          setShopId(this.$route.params.shopId)
          setTableId(this.$route.params.tableId)
          setTableNumber(this.$route.params.tableNumber)
          this.$router.push({ path: '/scan' })
        } else {
          this.$toast.fail(res.data.msg)
        }
      })

      // getInfo({ phonenumber: this.form.phonenumber }).then(res => {
      //   console.log(res);
      // })
      // this.$store.dispatch('Login', this.form).then(res => {
      // this.$router.push({ path: '/scan' })
      // setPhone(this.form.phonenumber)
      // console.log();

      // setShopId(this.$route.params.shopId)
      // setTableId(this.$route.params.tableId)
      // setTableNumber(this.$route.params.tableNumber)
      // })
      // this.$refs["form"].validate(valid => {
      //   if (valid) {
      //   // login(this.form).then(res => {
      //   //   console.log(res);
      //   //   this.$toast.success('登录成功')
      //   //   this.$router.push('/scan')
      //   // })

      //   }
      // }).catch(() => {
      //   this.$toast.fail('登录失败')
      // })

    },

    // 发送验证码
    countdownChange() {
      // 如果已发送不处理
      if (this.flag) return
      // 判断手机号是否正确
      // const 
      if (!this.form.phonenumber || !this.phonenumberReg.test(this.form.phonenumber)) {
        this.$toast('请检查手机号是否正确');
      } else {
        // getCode({ phonenumber: this.form.phonenumber }).then(res => {
        //   // this.$toast.fail(res)
        // })
        // 倒计时
        const time = setInterval(() => {
          if (this.countdown.time <= 0) {
            this.countdown.time = 60
            this.countdown.validText = '获取验证码'
            this.flag = false
            clearInterval(time)
          } else {
            this.countdown.time -= 1
            this.countdown.validText = `剩余${this.countdown.time}s`
          }
        }, 1000)

        this.flag = true
      }


    },
    // 手机号校验
    validatorphonenumber(value) {
      if (!this.phonenumberReg.test(value)) {
        this.$toast('请检查手机号是否正确')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button {
  width: 80px;
  color: #909090;
  height: 100%;
  text-align: center;
  background-color: #fbf3cd;
}
</style>