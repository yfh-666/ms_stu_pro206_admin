<template>
    <div class="app-container">
        <!-- 查询表单 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
            <el-form-item label="规格名称" prop="specificationName" @keyup.enter.native="handleQuery">
                <el-input v-model="queryParams.specificationName" placeholder="请输入规格名称" />
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['stores:manage:add']"
                    @click="handleAdd">新增</el-button>
            </el-form-item>
        </el-form>

        <!-- 规格列表 -->
        <el-table :data="specifyList" v-loading="listLoading">
            <el-table-column label="id" prop="specificationId" align="center" />
            <el-table-column label="规格名称" prop="specificationName" align="center" />
            <el-table-column label="规格值" prop="content" align="center">
                <template slot-scope="scope">
                    <div v-for="item in scope.row.content">{{ item.specify }}:{{ item.values }}</div>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" prop="operate">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit"
                        @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" style="color: #F56C6C;"
                        @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 新增/修改商品规格 -->
        <el-dialog :visible.sync="open" width="800px" append-to-body :title="title">
            <el-form :model="form" :rules="rules" label-width="80px" ref="form">
                <el-form-item label="规格名称" prop="specificationName">
                    <el-input placeholder="请输入规格名称" v-model="form.specificationName" />
                </el-form-item>
                <!-- 添加属性 -->
                <el-form-item v-for="(item, index) in content" prop='content'>
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
                <el-form :model="inputspecify" :rules="rules" :inline="true" label-width="80px" v-show="specifyOpen">
                    <el-form-item label="规格" prop="specify">
                        <el-input placeholder="请输入规格" v-model="inputspecify.specify" />
                    </el-form-item>
                    <el-form-item label="规格值" prop="specifyAttributes">
                        <el-input placeholder="请输入规格值" v-model="inputspecify.specifyAttributes" />
                    </el-form-item>
                    <el-button type="primary" @click="submitSpecify">确 定</el-button>
                    <el-button @click="specifyCancel">取 消</el-button>
                </el-form>
                <!-- 添加新规格按钮 -->
                <el-form-item>
                    <el-button type="primary" @click="addSpecify" v-show="!specifyOpen">添加新规格</el-button>
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
import { listSpecification, listDropdownbox, addSpecification, updateSpecification, delSpecification } from "@/api/product/specification"
export default {
    data() {
        return {
            listLoading: false,
            total: 0,
            // 规格和规格值的总表
            content: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                specificationName: undefined
            },
            specifyList: [],
            form: {
                specificationName: '',
                content: undefined,
            },
            // 新增规格的输入框
            inputspecify: {},
            // 新增规格输入框里面的规格
            specify: {},
            // 新增规格输入框里面的规格值
            specifyAttributes: [],
            inputValue: '',
            // 打开规格弹窗
            open: false,
            // 新增规格
            specifyOpen: false,
            title: "",
            specifyTitle: "",
            // 表单校验
            rules: {
                specificationName: [
                    { required: true, message: "该项为必填项", trigger: "blur" }
                ]
            },
        }
    },
    created() {
        this.getList()
    },
    methods: {
        /** 查询规格列表 */
        getList() {
            this.listLoading = true
            listSpecification(this.queryParams).then(res => {
                this.specifyList = res.rows
                this.specifyList.forEach(item => {
                    item.content = JSON.parse(item.content)
                    item.content.map(item2 => item2.values = item2.values.join(","))
                })
                this.total = res.total
                this.listLoading = false
                console.log(this.specifyList);
                
            }
            ).catch(() => {
                this.listLoading=false
            })
        },

        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    const content = this.content.map(item => { let { ['inputVal']: _, ...rest } = item; return rest })
                    this.form.content = JSON.stringify(content)
                    if (this.form.specificationId != undefined) {
                        updateSpecification(this.form).then(res => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        })
                    }
                    else {
                        addSpecification(this.form).then(res => {
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
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                specificationName: '',
                content: undefined,
            };
            // this.resetForm('form')
            this.specifyOpen = false
            this.inputspecify = {}
            this.content = []
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
            const data = JSON.parse(JSON.stringify(row))
            data.content.map(item => item.values = item.values.split(","))
            this.form = data
            this.content = data.content
            this.open = true;
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.getList()
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const specificationId = row.specificationId;
            this.$modal.confirm('是否确认删除门店编号为"' + specificationId + '"的数据项？').then(function () {
                return delSpecification({ specificationId: specificationId })
            }).then(() => {
                this.getList()
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        /**添加新规格 */
        addSpecify() {
            this.specifyOpen = true
        },
        /**提交新规格 */
        submitSpecify() {
            this.specifyOpen = false
            this.content.push({
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
        specifyCancel() {
            this.specifyOpen = false
            this.inputspecify = {
                specify: '',
                specifyAttributes: '',
            }
        },
        // 处理添加属性的方法  
        handleAttribute(index, val) {
            if (val.trim() !== '') { // 忽略空白输入  
                this.content[index].values.push(this.content[index].inputVal)
                this.content[index].inputVal = '' // 清空输入框  
            }
        },
        closeSpecify(index) {
            this.content.splice(index, 1)
        },
        closeValue(index, tIndex) {
            this.content[index].values.splice(tIndex, 1)
        },
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        }
    }
}
</script>