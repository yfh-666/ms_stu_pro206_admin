<template>
    <div>
        <van-nav-bar title="备注" fixed placeholder style="width: auto;" left-arrow @click-left="onClickLeft">
            <template #right>
                <div @click="submitRemark">完成</div>
            </template>
        </van-nav-bar>
        <van-cell-group inset style="margin-top: 10px;">
            <van-field v-model="remark" rows="4" autosize type="textarea" maxlength="50"
                placeholder="请输入口味、偏好等要求，不支持额外代购其他物品哦~" show-word-limit />
        </van-cell-group>
    </div>
</template>
<script>
export default {
    components: {
    },
    data() {
        return {
            remark: this.$store.state.user.remark
        }
    },
    methods: {
        onClickLeft() {
            this.$router.back(-1)
        },
        submitRemark(){
            this.$store.commit('SET_REMARK', this.remark)
           this.$router.back(-1)
        }
    }
}
</script>