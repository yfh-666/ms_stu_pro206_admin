<template>
    <div>
        <van-nav-bar :title="title" fixed placeholder style="width: auto;" left-arrow @click-left="onClickLeft"
            z-index="9999">
        </van-nav-bar>
        <Map ref="map" @updateLocation="updateLocation" />
        <van-form>
            <van-field v-model="form.latitude" name="latitude" label="纬度" placeholder="请输入纬度" />
            <van-field v-model="form.longitude" name="longitude" label="经度" placeholder="请输入经度" />
            <van-field v-model="form.adress" name="adress" label="地址" placeholder="请输入地址" />
            <van-field v-model="form.houseNumber" name="houseNumber" label="门牌号" placeholder="请输入门牌号" />
            <van-field v-model="form.consignee" name="consignee" label="联系人" placeholder="请输入联系人" />
            <van-field name="sex" label="性别">
                <template #input>
                    <van-radio-group v-model="form.sex" direction="horizontal" checked-color="#fec702">
                        <van-radio name="0">先生</van-radio>
                        <van-radio name="1">女士</van-radio>
                    </van-radio-group>
                </template>
            </van-field>
            <van-field name="isDefault" label="是否为默认地址">
                <template #input>
                    <van-switch v-model="form.isDefault" size="20" active-color="#fec702" />
                </template>
            </van-field>
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit" color="#fec702" @click="submit">提交</van-button>
            </div>
            <div style="margin: 16px;">
                <van-button round block type="default" native-type="submit" @click="deleteForm">删除</van-button>
            </div>
        </van-form>
    </div>
</template>
<script>
import Map from '@/components/Amap/index.vue'
import { addressEdit, addressDtl, addressDelete } from "@/api/address/address"
export default {
    components: {
        Map
    },
    data() {
        return {
            title: "",
            form: {
                adress: undefined,
                longitude: undefined,
                latitude: undefined,
                houseNumber: undefined,
                consignee: undefined,
                sex: 0,
                isDefault: 0,
                takeawayAddressId: undefined
            },
            markers: undefined,
        }
    },
    created() {

        this.openAddress()

    },
    methods: {
        onClickLeft() {
            history.back()
        },
        // 点击地图后得到位置信息
        updateLocation(Addr) {
            this.form.adress = Addr.orgAddr,
                this.form.longitude = Addr.lat
            this.form.latitude = Addr.lon
            console.log(this.form);

        },
        // 打开地址编辑
        openAddress() {
            const takeawayAddressId = this.$route.params.takeawayAddressId
            this.$toast.loading({
                message: '加载中...',
                forbidClick: true,
            });
            if (takeawayAddressId == 'add') {
                this.form = {
                    adress: undefined,
                    longitude: undefined,
                    latitude: undefined,
                    houseNumber: undefined,
                    consignee: undefined,
                    sex: 0,
                    isDefault: 0,
                    takeawayAddressId: undefined
                }
                this.title = "新增地址"
            } else {
                this.title = "修改地址"
                addressDtl({ takeawayAddressId: takeawayAddressId }).then(res => {
                    console.log(res.data.data);
                    this.form = Object.assign({}, res.data.data)
                    this.form.isDefault = this.getDefault(res.data.data.isDefault)
                })
            }
        },
        submit() {
            this.form.isDefault = this.form.isDefault == true ? "1" : "0"
            console.log(this.form);
            addressEdit(this.form).then(res => {
                console.log(res.data);
                if (res.data.code == 200) {
                    this.$toast.success(res.data.msg)
                    this.$router.back(-1)
                } else {
                    this.$toast.fail(res.data.msg);
                }
            })

        },
        deleteForm() {
            const takeawayAddressId = this.$route.params.takeawayAddressId
            addressDelete({ takeawayAddressId: takeawayAddressId }).then(res => {
                if (res.data.code == 200) {
                    this.$toast.success(res.data.msg)
                    this.$router.back(-1)
                } else {
                    this.$toast.fail(res.data.msg);
                }
            })
        },
        getDefault(item) {
            if (item == '0') {
                return false
            } else {
                return true
            }
        },
        // handleMap(Addr) {
        //      let markers = Addr
        //      console.log(markers);

        //     this.form.adress = markers[0].text
        //     this.form.longitude = markers[0].position[0]
        //     this.form.latitude = markers[0].position[1]
        // },
    }
}
</script>