<template>
    <div>
        <router-view />
        <van-tabbar v-model="active" fixed placeholder>
            <van-tabbar-item v-for="item in this.$router.options.routes[0].children" :key="item.path"
                :icon="item.meta.icon" :url="`#/${item.path}`">{{ item.meta.name }}</van-tabbar-item>
        </van-tabbar>
    </div>
</template>
<script>

export default {
    data() {
        return {
            active: 0
        }
    },
    mounted() {
        console.log(this.$route.path);
        const data = this.$router.options.routes[0]
        this.active = data.children.findIndex(item => '/' + item.path === this.$route.path)

    }
}
</script>
