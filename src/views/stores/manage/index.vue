<template>
    <div class="app-container">
        <!-- 查询表单 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
            <el-form-item label="店铺名称" prop="shopName" @keyup.enter.native="handleQuery">
                <el-input v-model="queryParams.shopName" placeholder="请输入店铺名称" style="width: 240px" />
            </el-form-item>
            <el-form-item label="店铺电话" prop="shopPhonenumber" @keyup.enter.native="handleQuery">
                <el-input v-model="queryParams.shopPhonenumber" placeholder="请输入店铺电话" style="width: 240px" />
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['stores:manage:add']"
                    @click="openDialog('add')">新增</el-button>
            </el-form-item>
        </el-form>
        <!-- 门店列表 -->
        <el-table :data="shopList"v-loading="listLoading">
            <el-table-column label="id" prop="shopId" width="50" align="center" />
            <el-table-column label="店铺名称" prop="shopName" align="center" />
            <el-table-column label="门店图片" width="100" align="center" prop="shopAvatarUrl">
                <template slot-scope="scope">
                    <el-image style="width: 80px; height: 80px" :src="scope.row.shopAvatarUrl" fit="cover"></el-image>
                </template>
            </el-table-column>
            <el-table-column label="店铺电话" prop="shopPhonenumber" align="center" />
            <el-table-column label="经度" prop="longitude" align="center" />
            <el-table-column label="纬度" prop="latitude" align="center" />
            <el-table-column label="外卖配送距离" prop="maxDistance" align="center" width="100px" />
            <el-table-column label="起送价钱" prop="minPrice" align="center" />
            <el-table-column label="是否营业" prop="openStatus" align="center">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.stores_yes_no" :value="scope.row.status" :key="scope.row.status" />
                </template>
            </el-table-column>
            <el-table-column label="营业开始时间" prop="openTime" width="100" align="center" />
            <el-table-column label="营业结束时间" prop="closeTime" width="100" align="center" />
            <el-table-column label="添加时间" prop="createTime" width="130" align="center" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['stores:manage:edit']"
                        @click="openDialog('edit', scope.row)">编辑</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['stores:manage:remove']"
                        @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />
        <!-- 新增或修改门店列表对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body @closed="resetForm('form')">
            <el-form :model="form" label-width="120px" :rules="rules" ref="form">
                <el-form-item label="店铺名称" prop="shopName">
                    <el-input placeholder="请输入店铺名称" v-model="form.shopName" />
                </el-form-item>
                <el-form-item label="店铺电话" prop="shopPhonenumber">
                    <el-input placeholder="请输入店铺电话" v-model="form.shopPhonenumber" />
                </el-form-item>
                <el-form-item label="门店头像" prop="shopAvatarUrl">
                    <ImageUpload @update:fileList="upAvatarImg" :limit="1" v-model="form.shopAvatarUrl"></ImageUpload>
                </el-form-item>
                <el-form-item label="门店组图" prop="shopPicturesUrl">
                    <ImageUpload @update:fileList="upListImg" :limit="5" v-model="form.shopPicturesUrl"></ImageUpload>
                </el-form-item>
                <el-form-item label="营业开始时间" prop="openTime">
                    <el-time-picker v-model="form.openTime" placeholder="请输入营业时间" value-format="HH:mm:ss">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="营业结束时间" prop="closeTime">
                    <el-time-picker v-model="form.closeTime" placeholder="请输入营业结束时间" value-format="HH:mm:ss">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="选择地图定位">
                    <el-button @click="handleArea" type="primary">点击选择地址获取经纬度</el-button>
                    <Map ref="map" @updateLocation="updateLocation" v-show="mapVisible" @map="handleMap" />
                </el-form-item>
                <el-form-item label="地图定位地址" prop="mapAdress">
                    <el-input placeholder="请输入地图定位地址" v-model="form.mapAdress" />
                </el-form-item>
                <el-form-item label="经度" prop="longitude">
                    <el-input placeholder="请输入经度" v-model="form.longitude" />
                </el-form-item>
                <el-form-item label="纬度" prop="latitude">
                    <el-input placeholder="请输入纬度" v-model="form.latitude" />
                </el-form-item>
                <el-form-item label="详细地址" prop="adress">
                    <el-input placeholder="请输入详细地址" v-model="form.adress" />
                </el-form-item>
                <el-form-item label="外卖配送距离" prop="maxDistance">
                    <el-input placeholder="请输入外卖配送距离(单位/千米)" v-model="form.maxDistance" />
                </el-form-item>
                <el-form-item label="起送价钱" prop="minPrice">
                    <el-input placeholder="请输入起送价钱(单位/元)" v-model="form.minPrice" />
                </el-form-item>
                <el-form-item label="配送价格" prop="price">
                    <el-input placeholder="请输入配送价格(单位/元)" v-model="form.price" />
                </el-form-item>
                <el-form-item label="公告" prop="anncmnt">
                    <el-input placeholder="请输入公告" v-model="form.anncmnt" type="textarea" :rows="4" />
                </el-form-item>
                <el-form-item label="绑定管理员" prop="userId">
                    <el-select v-model="form.userId" placeholder="请选择管理员">
                        <el-option v-for="item in userList" :key="item.userId" :label="item.userName"
                            :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="绑定打印机" prop="printerId" >
                    <!-- <el-select v-model="form.printerId" placeholder="请选择绑定打印机">
                        <el-option v-for="item in printerIdOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select> -->
                    <el-input v-model="form.printerId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="是否营业" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio v-for="dict in dict.type.stores_yes_no" :key="dict.value" :label="dict.value">{{
                            dict.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import Map from '@/components/Amap/index.vue'
import ImageUpload from '@/components/ImageUpload'
import { listShop, detailShop, getShop, createShop, updateShop, delShop, listUser } from "@/api/shop/shop"
export default {
    dicts: ['stores_yes_no'],
    components: { Map, ImageUpload },
    data() {
        const checkAvatar = (rule, value, callback) => {
            if (value || this.form.shopAvatarUrl) {
                callback()
            } else {
                callback(new Error())
            }
        }
        const checkDialog = (rule, value, callback) => {
            if (value || this.form.shopPicturesUrl) {
                callback()
            } else {
                callback(new Error())
            }
        }
        return {
            listLoading:false,
            shopPicturesUrl: undefined,
            shopAvatarUrl: undefined,
            markers: [],
            mapVisible: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                shopName: undefined,
                shopPhonenumber: undefined,
            },
            // 门店列表
            shopList: [],
            showSearch: true,
            // 总条数
            total: 0,
            open: false,
            form: {
                mapAdress: undefined,
                longitude: undefined,
                latitude: undefined,
                userId: [],
                printerId: [],
                avatarImag: "",
            },
            userList: [],
            title: "",
            // 表单校验
            rules: {
                shopName: [
                    { required: true, message: "该项为必填项", trigger: "blur" }
                ],
                shopPhonenumber: [
                    { required: true, message: "该项为必填项", trigger: "blur" },
                    {
                        pattern: /^(0|[1-9][0-9]*)$/,
                        message: "请输入正确格式",
                        trigger: "blur"
                    }
                ],
                shopAvatarUrl: [
                    { required: true, message: "该项为必填项！", trigger: "blur", validator: checkAvatar }
                ],
                shopPicturesUrl: [
                    { required: true, message: "该项为必填项！", trigger: "blur", validator: checkDialog }
                ],
                openTime: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ],
                closeTime: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ],
                mapAdress: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ],
                longitude: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ],
                latitude: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ],
                adress: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ],
                printerId: [
                    {
                        pattern: /^(0|[1-9][0-9]*)$/,
                        message: "请输入数字",
                        trigger: "blur"
                    }
                ],
                maxDistance: [
                    { required: true, message: "该项为必填项！", trigger: "blur" },
                    {
                        pattern: /^(0|[1-9][0-9]*)$/,
                        message: "请输入数字",
                        trigger: "blur"
                    }
                ],
                minPrice: [
                    { required: true, message: "该项为必填项！", trigger: "blur" },
                    {
                        pattern: /^(0|[1-9][0-9]*)$/,
                        message: "请输入数字",
                        trigger: "blur"
                    }
                ],
                price: [
                    { required: true, message: "该项为必填项！", trigger: "blur" },
                    {
                        pattern: /^(0|[1-9][0-9]*)$/,
                        message: "请输入数字",
                        trigger: "blur"
                    }
                ],
                userId: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ],
                anncmnt: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ],
                status: [
                    { required: true, message: "绑定云打印机用于分店小票打印", trigger: "blur" }
                ],
            },
            // 点击地图后得到位置信息
            updateLocation: (Addr) => {
                this.form.mapAdress = Addr.orgAddr,
                    this.form.longitude = Addr.lat
                this.form.latitude = Addr.lon
                this.mapVisible = false
            },
            handleMap: (Addr) => {
                this.markers = Addr
                console.log(this.markers);

            },
        }
    },
    created() {
        this.getList()
        this.getUserList()
    },
    methods: {
        upAvatarImg() {
            this.shopAvatarUrl = fileList.length > 0 ? fileList[0].url : '';
        },
        // 门店组图
        upListImg() {
            this.shopPicturesUrl = fileList.map(item => item.url).join(',')
        },
        // },
        // 获取管理员列表
        getUserList() {
            listUser().then(res => {
                this.userList = res.data
            })
        },
        /** 查询门店列表 */
        getList() {
            this.listLoading=true
            listShop(this.queryParams).then(res => {
                this.shopList = res.data.shops
                this.shopList.map(item => item.shopAvatarUrl = process.env.VUE_APP_BASE_API + item.shopAvatarUrl)
                this.total = res.data.total
                this.listLoading=false
            }
            ).catch(() => {
                this.listLoading=false
            })
        },

        /** 提交按钮 */
        submitForm() {
            console.log(this.form);

            this.$refs["form"].validate(valid => {
                if (valid) {
                    console.log(this.form);
                    if (this.form.shopId != undefined) {
                        updateShop(this.form).then(res => {
                            console.log(111);
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        })
                    } else {
                        createShop(this.form).then(res => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        })
                    }
                }
            })

        },
        // 取消按钮
        cancel() {
            this.open = false;
        },
        // 修改和新增弹窗
        openDialog(type, row) {
            this.open = true;
            if (type === 'edit') {
                this.title = "修改"
                detailShop({ shopId: row.shopId }).then(res => {
                    this.form = res.data
                    this.form.shopId = row.shopId
                })
            } else {
                this.form = {}
                this.title = "新增"
            }
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.getList()
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const shopId = row.shopId;
            this.$modal.confirm('是否确认删除门店编号为"' + shopId + '"的数据项？').then(function () {
                return delShop({ shopId })
            }).then(() => {
                this.getList()
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        handleArea() {
            this.mapVisible = true
            // this.form.mapAdress = JSON.parse.sringify(this.markers[0].text)
            this.form.mapAdress = this.markers[0].text
            this.form.longitude = this.markers[0].position[0]
            this.form.latitude = this.markers[0].position[1]
            console.log(this.markers[0].text);

        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },

    }
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
}

.avatar {
    width: 100px;
    height: 100px;
    display: block;
}
</style>