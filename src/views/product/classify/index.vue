<template>
    <div class="app-container">
        <!-- 查询表单 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
            <el-form-item label="分类名称" prop="productTypeName" @keyup.enter.native="handleQuery">
                <el-input v-model="queryParams.productTypeName" placeholder="请输入分类名称" />
            </el-form-item>
            <el-form-item label="店铺名称" prop="shopName" @keyup.enter.native="handleQuery">
                <el-select v-model="queryParams.shopName" placeholder="请选择店铺名称">
                    <el-option v-for="item in shopList" :key="item.shopId" :label="item.shopName"
                        :value="item.shopName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['stores:manage:add']"
                    @click="openDialog('add')">新增</el-button>
            </el-form-item>
        </el-form>

        <!-- 分类列表 -->
        <el-table :data="productTypeList" :default-sort="{ prop: 'productTypeName', order: 'descending' }" v-loading="listLoading">
            <el-table-column label="分类名称" prop="productTypeName" sortable align="center" />
            <el-table-column label="所属门店" prop="shopName" sortable align="center" />
            <el-table-column label="分类排序" prop="productTypeOrder" align="center" />
            <el-table-column label="开启状态" prop="status" align="center">
                <template v-slot="scope">
                    <dict-tag :options="dict.type.product_classify_status" :value="scope.row.status" />
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" prop="operate">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit"
                        @click="openDialog('edit', scope.row)">编辑</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" style="color: #F56C6C;"
                        @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 新增/修改商品分类 -->
        <el-dialog :visible.sync="open" width="600px" append-to-body :title="title" @closed="resetForm('form')"
           >
            <el-form :model="form" label-width="120px" :rules="rules" ref="form"  v-loading="loading">
                <el-form-item label="展示店铺" prop="shopId">
                    <el-select v-model="form.shopId" placeholder="请选择店铺">
                        <el-option v-for="item in shopList" :key="item.shopId" :label="item.shopName"
                            :value="item.shopId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分类名称" prop="productTypeName">
                    <el-input placeholder="请输入分类名称" v-model="form.productTypeName" />
                </el-form-item>
                <el-form-item label="分类图片" prop="coverUrl">
                    <ImageUpload @update:fileList="upTypeImg" :limit="1" v-model="form.coverUrl"></ImageUpload>
                </el-form-item>
                <el-form-item label="分类排序" prop="productTypeOrder">
                    <el-input-number v-model="form.productTypeOrder" controls-position="right"
                        :min="1"></el-input-number>
                </el-form-item>
                <el-form-item label="开启状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio v-for="dict in dict.type.product_classify_status" :key="dict.value"
                            :label="dict.value">{{
                                dict.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="分类描述" prop="remark">
                    <el-input placeholder="请输入分类描述" v-model="form.remark" type="textarea" :rows="2" />
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
import { listProducttype, dtlProducttype, listDropdownbox, addProducttype, updateProducttype, delProducttype } from "@/api/product/type"
import { getShop } from "@/api/shop/shop"
import ImageUpload from '@/components/ImageUpload'
export default {
    dicts: ['product_classify_status'],
    components: { ImageUpload },
    data() {
        return {
            listLoading:false,
            loading: false,
            coverUrl: undefined,
            total: 0,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                productTypeName: undefined,
                shopName: undefined
            },
            productTypeList: [],
            form: {},
            open: false,
            title: "",
            shopList: [],
            // 表单校验
            rules: {
                shopId: [
                    { required: true, message: "该项为必填项", trigger: "blur" }
                ],
                productTypeName: [
                    { required: true, message: "该项为必填项", trigger: "blur" }
                ],
                productTypeOrder: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ],
                status: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ]
            }
        }
    },
    created() {
        this.getList()
        this.getShopList()
    },
    methods: {
        upTypeImg() {
            this.coverUrl = fileList.length > 0 ? fileList[0].url : '';
        },
        /** 查询商品分类列表 */
        getList() {
            this.listLoading=true
            listProducttype(this.queryParams).then(res => {
                this.productTypeList = res.rows
                this.total = res.total
                this.listLoading=false
            }
            ).catch(() => {
                this.listLoading=false
            })
        },
        // 获取门店下拉框
        getShopList() {
            getShop().then(res => {
                this.shopList = res.data
            })
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    // console.log(this.form);
                    if (this.form.productTypeId != undefined) {
                        // this.loading = true
                        console.log(this.form);
                        
                        updateProducttype(this.form).then(res => {
                            // console.log(111);
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                            // this.loading = false
                        })
                    } else {
                         this.loading = true
                        addProducttype(this.form).then(res => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                            this.loading = false
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
                this.loading = true

                dtlProducttype({ producttypeId: row.productTypeId }).then(res => {
                    this.form = Object.assign({}, res.data)
                    this.form.status = row.status
                    this.form.shopId = row.shopId
                    this.loading = false
                })
            } else {
                this.title = "新增"
                this.form = {}
            }
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.getList()
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const productTypeId = row.productTypeId;
            this.$modal.confirm('是否确认删除商品编号为"' + productTypeId + '"的数据项？').then(function () {
                return delProducttype({ sassProducttypeId: productTypeId })
            }).then(() => {
                this.getList()
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>