<template>
    <div>
        <van-nav-bar :title="navTitle" fixed placeholder style="width: auto;" left-arrow
        @click-left="onClickLeft">
            <!-- <template #left >
                <van-icon name="cross" size="18" />
            </template> -->
            <template #right>
                <van-icon name="ellipsis" size="18" @click="showShare = true" />
            </template>
        </van-nav-bar>
        <van-share-sheet v-model:show="showShare" title="立即分享给好友" :options="options" />
    </div>
</template>
<script>
export default {
    props: {
        navTitle: String
    },
    data() {
        return {
            showShare: false,
            options:[
                { name: '微信', icon: 'wechat' },
                { name: '微博', icon: 'weibo' },
                { name: '复制链接', icon: 'link' },
                { name: '分享海报', icon: 'poster' },
                { name: '二维码', icon: 'qrcode' },
            ]
        }},
        methods:{
            onClickLeft(){
                history.back()
            }
        }
}

</script>