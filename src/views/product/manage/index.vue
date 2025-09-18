<template>
    <div class="app-container">
        <el-row :gutter="20">
            <!--分类数据-->
            <el-col :span="4" :xs="24">
                <div class="head-container">
                    <el-input v-model="productTypeName" placeholder="请输入分类名称" clearable size="small"
                        prefix-icon="el-icon-search" style="margin-bottom: 20px"
                        @keyup.enter.native="handleQueryType" />
                </div>
                <div class="head-container">
                    <div v-for="(item,index) in typeData" @click="handleType(item,index)" :class="['type',{'active':index===activeIndex}]">{{
                        item.producttypeName }} </div>
                </div>
            </el-col>
            <!--用户数据-->
            <el-col :span="20" :xs="24" v-loading="listLoading">
                <!-- 查询表单 -->
                <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
                    <el-form-item label="商品名称" prop="productName" @keyup.enter.native="handleQuery">
                        <el-input v-model="queryParams.productName" placeholder="请输入商品名称" />
                    </el-form-item>
                    <el-form-item label="店铺名称" prop="shopName" @keyup.enter.native="handleQuery">
                        <el-input v-model="queryParams.shopName" placeholder="请输入店铺名称" />
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        <el-button type="primary" plain icon="el-icon-plus" size="mini"
                            v-hasPermi="['stores:manage:add']" @click="handleAdd">新增</el-button>
                    </el-form-item>
                </el-form>
                <!-- 标签页数据 -->
                <el-tabs v-model="queryParams.status" type="card" @tab-click="tabClick">
                    <el-tab-pane v-for="dict in dict.type.product_manage_status" :key="dict.value" :name="dict.value"
                        :label="dict.label + '商品'"></el-tab-pane>
                </el-tabs>
                <el-table :data="productList">
                    <el-table-column label="id" prop="productId" align="center" />
                    <el-table-column label="商品图片" align="center">
                        <template slot-scope="scope">
                            <el-image style="width: 80px; height: 80px" :src="scope.row.coverUrl"
                                fit="cover"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column label="所属门店" prop="shopName" align="center" />
                    <el-table-column label="商品名称" prop="productName" align="center" />
                    <el-table-column label="商品价格" prop="price" align="center" />
                    <el-table-column label="销量" prop="sellNum" align="center" />
                    <el-table-column label="库存" prop="stock" align="center" />
                    <el-table-column label="状态" prop="status" align="center">
                        <template slot-scope="scope">
                            <dict-tag :options="dict.type.product_manage_status" :value="scope.row.status" />
                        </template>
                    </el-table-column>
                    <el-table-column label="添加时间" prop="createTime" align="center" />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120"
                        prop="operate">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit"
                                @click="handleUpdate(scope.row)">编辑</el-button>
                            <el-button size="mini" type="text" icon="el-icon-delete" style="color: #F56C6C;"
                                @click="handleDelete(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />
        <!-- 新增/修改商品信息 -->
        <el-dialog :visible.sync="open" width="1000px" append-to-body :title="title">
            <el-tabs type="border-card" v-model="activeTabName">
                <el-tab-pane v-for="(tab, index) in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
                </el-tab-pane>
                <el-form :model="form" label-width="120px" :rules="rules" ref="form">
                    <!-- 商品基本信息填写 -->
                    <div v-show="activeTabName == 'basicData'">
                        <el-form-item label="展示店铺" prop="shopId">
                            <el-select v-model="form.shopId" placeholder="请选择店铺" @change="shopChange">
                                <el-option v-for="item in shopList" :key="item.shopId" :label="item.shopName"
                                    :value="item.shopId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品名称" prop="productName">
                            <el-input placeholder="请输入商品名称" v-model="form.productName" />
                        </el-form-item>
                        <el-form-item label="商品分类" prop="productTypeId">
                            <el-select v-model="form.productTypeId" placeholder="请选择商品分类">
                                <el-option v-for="item in typeList" :key="item.producttypeId"
                                    :label="item.producttypeName" :value="item.producttypeId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关键字" prop="keyWord">
                            <el-input placeholder="请输入关键字" v-model="form.keyWord" />
                        </el-form-item>
                        <el-form-item label="单位名" prop="unit">
                            <el-input placeholder="请输入单位名" v-model="form.unit" />
                        </el-form-item>
                        <el-form-item label="商品价格" prop="price">
                            <el-input placeholder="请输入商品价格" v-model="form.price" />
                        </el-form-item>
                        <el-form-item label="市场价" prop="marketPrice">
                            <el-input placeholder="请输入市场价" v-model="form.marketPrice" />
                        </el-form-item>
                        <el-form-item label="库存" prop="stock">
                            <el-input placeholder="请输入库存" v-model="form.stock" />
                        </el-form-item>
                        <el-form-item label="封面图" prop="coverUrl">
                            <ImageUpload @update:fileList="upCoverImg" :limit="1" v-model="form.coverUrl">
                            </ImageUpload>
                        </el-form-item>
                        <el-form-item label="轮播图" prop="imageUrl">
                            <ImageUpload @update:fileList="upBannerImg" :limit="5" v-model="form.imageUrl">
                            </ImageUpload>
                        </el-form-item>
                        <el-form-item label="商品状态" prop="status">
                            <el-radio-group v-model="status">
                                <el-radio v-for="dict in dict.type.product_manage_status" :key="dict.value"
                                    :label="dict.value">{{
                                        dict.label }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="商品简介" prop="introduce">
                            <el-input placeholder="请输入商品简介" v-model="form.introduce" type="textarea" :rows="2" />
                        </el-form-item>
                    </div>
                    <!-- 商品规格信息填写 -->
                    <div :rules="rules" v-show="activeTabName == 'specification'">
                        <!-- 单规格/多规格radio选择 -->
                        <el-form-item label="开启状态">
                            <el-radio-group v-model="specifyRadio">
                                <el-radio label="singalSpecify">单规格</el-radio>
                                <el-radio label="mutipleSpecify">多规格</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <!-- 单规格 -->
                        <el-form-item v-show="specifyRadio == 'singalSpecify'">
                            <el-table :data="singalSpecify" style="width: 100%">
                                <el-table-column prop="specificationUrl" label="图片" width="180" align="center">
                                    <template slot-scope="{row}">
                                        <ImageUpload @update:fileList="upSpecifyImg" :limit="1" v-model="row.image">
                                        </ImageUpload>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="sellingPrice" label="售价" width="120" align="center">
                                    <template slot-scope="{row}">
                                        <el-input v-model="row.sellingPrice"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="costPrice" label="成本价" width="120" align="center">
                                    <template slot-scope="{row}">
                                        <el-input v-model="row.costPrice"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="price" label="原价" width="120" align="center">
                                    <template slot-scope="{row}">
                                        <el-input v-model="row.price"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="stock" label="库存" width="120" align="center">
                                    <template slot-scope="{row}">
                                        <el-input v-model="row.stock"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="weight" label="重量(KG)" width="120" align="center">
                                    <template slot-scope="{row}">
                                        <el-input v-model="row.weight"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="bulk" label="体积(m3)" width="120" align="center">
                                    <template slot-scope="{row}">
                                        <el-input v-model="row.bulk"></el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                        <!-- 多规格 -->
                        <div v-show="specifyRadio == 'mutipleSpecify'">
                            <el-form-item label="选择规格">
                                <el-select v-model="specificationName" placeholder="请选择规格">
                                    <el-option v-for="(item, index) in specificationList" :key="index"
                                        :label="item.specificationName" :value="item.specificationName">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary">确认</el-button>
                            </el-form-item>
                            <!-- 添加属性 -->
                            <el-form-item v-for="(item, index) in specifyData">
                                <el-tag class="custom-tag" color=" rgba(0, 0, 0, 0)" closable size="medium"
                                    @close="closeSpecify(index)">{{
                                        item.specify }}</el-tag>
                                <div>
                                    <el-tag closable :disable-transitions="false" v-for="(tag, tIndex) in item.values"
                                        @close="closeValue(index, tIndex)">
                                        {{ tag }}
                                    </el-tag>
                                    <el-input placeholder="请输入属性名称" v-model="item.inputVal"
                                        style="width: 200px; margin-left: 10px;">
                                        <template slot="append">
                                            <el-button @click="handleAttribute(index, item.inputVal)">添加</el-button>
                                        </template>
                                    </el-input>
                                </div>
                            </el-form-item>
                            <!-- 新增规格 -->
                            <el-form :model="inputspecify" v-show="specifyOpen" label-width="120px" ref="inputspecify">
                                <el-form-item label="规格" prop="specify">
                                    <el-input placeholder="请输入规格" v-model="inputspecify.specify" />
                                </el-form-item>
                                <el-form-item label="规格值" prop="specifyAttributes">
                                    <el-input placeholder="请输入规格值" v-model="inputspecify.specifyAttributes" />
                                </el-form-item>
                                <el-button type="primary" @click="submitSpecify">确 定</el-button>
                                <el-button @click="specifyCancel" type="danger">取 消</el-button>
                            </el-form>
                            <!-- 添加新规格按钮 -->
                            <el-form-item>
                                <el-button type="primary" @click="addSpecify" v-show="!specifyOpen">添加新规格</el-button>
                            </el-form-item>
                        </div>
                    </div>
                    <!-- 商品详情信息填写 （富文本编辑）-->
                    <div v-if="activeTabName == 'details'">
                        <el-form-item label="产品描述" prop='details'>
                            <editor v-model="form.details" :min-height="192" />
                        </el-form-item>
                    </div>
                    <!-- 营销设置信息填写 -->
                    <div v-show="activeTabName == 'marketData'" ref="marketData">
                        <el-form-item label="获得积分" prop="marketCredits">
                            <el-input v-model="form.marketCredits"></el-input>
                        </el-form-item>
                    </div>
                </el-form>


            </el-tabs>
            <div slot="footer" class="dialog-footer">
                <el-button v-show="activeTabName != 'basicData'" @click="prevTab">上一步</el-button>
                <el-button type="primary" @click="nextTab" v-show="activeTabName != 'marketData'">下一步</el-button>
                <el-button type="primary" v-show="activeTabName == 'marketData'" @click="submitForm">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { listProduct, dtlProduct, addProduct, updateProduct, delProduct } from "@/api/product/manage"
import { listDropdownbox, listbyshopid } from "@/api/product/type"
import { lisSpecification } from "@/api/product/specification"
import ImageUpload from '@/components/ImageUpload'
import { getShop } from "@/api/shop/shop"
export default {
    dicts: ['product_manage_status'],
    components: {
        ImageUpload
    },
    data() {
        return {
            activeIndex:undefined,
            form: {},
            typeData: [],
            productTypeName: undefined,
            listLoading: false,
            specificationName: undefined,
            specificationUrl: undefined,
            coverUrl: undefined,
            imageUrl: undefined,
            total: 0,
            typeList: [],
            shopList: [],
            // 规格 规格值 规格名称
            specificationData: {},
            // 规格和规格值的总表
            specifyData: [],
            productName: '',
            // 分类部分默认为出售中
            classifyList: 'onSale',
            // 出售中商品 /标签页数据
            productList: [],
            // 默认对话框tab标签在基本信息
            activeTabName: 'basicData', // 当前激活的Tab页name  
            tabs: [
                { name: 'basicData', label: '基本信息' },
                { name: 'specification', label: '商品规格' },
                { name: 'details', label: '商品详情' },
                { name: 'marketData', label: '营销设置' }
            ],
            currentIndex: 0, // 当前Tab页的索引
            // 单规格/多规格按钮
            specifyRadio: 'singalSpecify',
            // 新增规格
            specifyOpen: false,
            inputspecify: {},
            // 单规格
            singalSpecify: [
                {
                    image: undefined,
                    price: 0,
                    sellingPrice: 0,
                    costPrice: 0,
                    stock: 0,
                    weight: 0,
                    bulk: 0,
                }
            ],
            specificationList: [],
            title: '',
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                productName: undefined,
                shopName: undefined,
                status: '1',
                productTypeId: undefined,
            },
            status:"1",
            // 商品详情数据
            details: '',

            // 表单校验
            rules: {
                coverUrl: [
                    { required: true, message: "该项为必填项", trigger: "blur" }
                ],
                imageUrl: [
                    { required: true, message: "该项为必填项", trigger: "blur" }
                ],
                price: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ],
                productName: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ],
                productTypeId: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ],
                shopId: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ]
            }
        }
    },
    created() {
        this.getList()
        this.getTypeList()
    },
    methods: {
        upSpecifyImg() {
            this.specificationUrl = fileList.length > 0 ? fileList[0].url : '';
        },
        upCoverImg() {
            this.coverUrl = fileList.length > 0 ? fileList[0].url : '';
        },
        upBannerImg() {
            this.imageUrl = fileList.map(item => item.url).join(',')
        },
        tabClick(e) {
            this.queryParams.status = e.name
            this.getList()
        },
        getList() {
            this.listLoading = true
            listProduct(this.queryParams).then(res => {
                this.productList = res.rows
                this.total = res.total
                this.productList.map(item => item.coverUrl = process.env.VUE_APP_BASE_API + item.coverUrl)
                this.listLoading = false
            }
            ).catch(() => {
                this.listLoading=false
            })
            // 查询门店列表
            getShop().then(res => {
                this.shopList = res.data
            }),

                // 规格列表
                lisSpecification().then(res => {
                    this.specificationList = res
                    // console.log(res);

                })
        },
        getTypeList() {
            // 分类信息
            listDropdownbox({ productTypeName: this.productTypeName }).then(res => {
                console.log(res);
                this.typeData = res
            })
        },
        shopChange(e) {
            // 分类列表
            listbyshopid({ shopId: e }).then(res => {
                this.typeList = res
                if (this.form.productTypeId) {
                    this.form.productTypeId = undefined
                }
            })
            // 

        },
        /** 提交按钮 */
        submitForm() {
            this.specificationData.specificationName = this.specificationName
            console.log(this.specifyData);

            if (this.specifyData != undefined) {
                this.specificationData.specifyData = this.specifyData.map(item => { let { ['inputVal']: _, ...rest } = item; return rest })
                let specification = JSON.stringify(Object.assign(this.specificationData, this.singalSpecify[0]))
                this.form.specification = specification
            }


            this.form.status = this.status
            console.log(this.form);


            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.productId !==undefined) {
                        updateProduct(this.form).then(res => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        })
                    }
                    else {
                    addProduct(this.form).then(res => {
                        this.$modal.msgSuccess("新增成功");
                        this.open = false;
                        this.getList();
                    })
                }
                }
            })
        },
        // },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "新增";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.title = "修改";
            this.open = true;
            dtlProduct({ productId: row.productId }).then(res => {
                this.form = Object.assign({}, res.data)
                console.log(res.data);
                
                this.form.specification = JSON.parse(this.form.specification)
                this.singalSpecify[0].price = this.form.specification.price
                this.singalSpecify[0].sellingPrice = this.form.specification.sellingPrice
                this.singalSpecify[0].costPrice = this.form.specification.costPrice
                this.singalSpecify[0].stock = this.form.specification.stock
                this.singalSpecify[0].productId = this.form.specification.productId
                this.singalSpecify[0].weight = this.form.specification.weight
                this.singalSpecify[0].bulk = this.form.specification.bulk
                this.specificationName = this.form.specification.specificationName
                this.specifyData = this.form.specification.specifyData

            })
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.queryParams.productTypeId=undefined
            this.queryParams.status='1'
            this.activeIndex=undefined
            this.getList()
        },
        // 表单重置
        reset() {
            this.resetForm("form");
            this.form.details = undefined,
            this.specificationName=undefined
            this.specificationData = {}
            this.specifyData = []
            // table单规格表单重置
            this.singalSpecify = [{
                image: undefined,
                price: 0,
                sellingPrice: 0,
                costPrice: 0,
                stock: 0,
                productId: 0,
                weight: 0,
                bulk: 0,
            }]
            // 规格默认选单规格
            this.specifyRadio = 'singalSpecify'
            // 默认选中第一个
            this.activeTabName = 'basicData'
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const productId = row.productId;
            this.$modal.confirm('是否确认删除商品编号为"' + productId + '"的数据项？').then(function () {
                return delProduct({ productId: productId })
            }).then(() => {
                this.getList()
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        /**提交新规格 */
        submitSpecify() {
            this.specifyOpen = false

            this.specifyData.push({
                specify: this.inputspecify.specify,
                values: [this.inputspecify.specifyAttributes],
                inputVal: ''
            })
            // // 添加规格值
            this.inputspecify = {
                specify: '',
                specifyAttributes: ''
            }
        },
        /**添加新规格 */
        addSpecify() {
            this.specifyOpen = true
        },

        specifyCancel() {
            this.specifyOpen = false
            this.inputspecify = {
                specify: '',
                specifyAttributes: '',
            }
        },

        /**对话框下一步 */
        nextTab() {
            // 计算下一个Tab页的索引  
            const nextIndex = (this.currentIndex + 1) % this.tabs.length;
            // 更新当前索引  
            this.currentIndex = nextIndex;
            // 更新当前激活的Tab页name  
            this.activeTabName = this.tabs[nextIndex].name;
        },
        /**对话框上一步 */
        prevTab() {
            this.currentIndex--;
            this.activeTabName = this.tabs[this.currentIndex].name;
        },
        // 处理添加属性的方法  
        handleAttribute(index, val) {
            if (val.trim() !== '') { // 忽略空白输入  
                this.specifyData[index].values.push(this.specifyData[index].inputVal)
                this.specifyData[index].inputVal = '' // 清空输入框  
            }
        },
        closeSpecify(index) {
            this.specifyData.splice(index, 1)
        },
        closeValue(index, tIndex) {
            this.specifyData[index].values.splice(tIndex, 1)
        },
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        handleQueryType() {
            this.getTypeList()
        },
        handleType(item,index) {
            this.queryParams.productTypeId = item.producttypeId
            this.activeIndex=index
            this.getList()
        }
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

.type {
    color: #606266;
    /* padding-top: 10px; */
    padding: 10px 20px;
    cursor: pointer;
    box-sizing: border-box;
    
}
.active{
        background-color: #f8f8f9;
    }
</style>