<template>
    <div class="app-container">
        <!-- 查询表单 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
            <el-form-item label="店铺名称" prop="shopName" @keyup.enter.native="handleQuery">
                <el-input v-model="queryParams.shopName" placeholder="请选择店铺" style="width: 240px" />
            </el-form-item>
            <el-form-item label="桌号" prop="tableNumber" @keyup.enter.native="handleQuery">
                <el-input v-model="queryParams.tableNumber" placeholder="请输入桌号" style="width: 240px" />
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['stores:table:add']"
                    @click="openDialog('signal', '新增')">新增</el-button>
                <el-button type="primary" plain icon="el-icon-plus" size="mini"
                    @click="openDialog('batch', '批量新增')">批量新增</el-button>
                <el-button type="success" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
                <el-button type="warning" plain icon="el-icon-download" size="mini"
                    @click="downloadImg">批量下载点餐码</el-button>
                <el-button type="danger" plain icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
                <el-button type="success" plain icon="el-icon-download" size="mini"
                    @click="importTemplate">下载导入模板</el-button>
            </el-form-item>
        </el-form>

        <!-- 桌号管理列表 -->
        <el-table :data="tableList" :default-sort="{ prop: 'tableId', order: 'descending' }" v-loading="listLoading"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="id" prop="tableId" width="60" align="center" sortable />
            <el-table-column label="店铺名称" prop="shopName" align="center" />
            <el-table-column label="桌号" prop="tableNumber" align="center" />
            <el-table-column label="下单数" prop="orderNumber" align="center" />
            <el-table-column label="消费金额" prop="totalAmount" align="center" />
            <el-table-column label="上次下单时间" prop="lastOrderTime" align="center" width="120px" />
            <el-table-column label="状态" prop="status" align="center">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.store_table_status" :value="scope.row.status" />
                </template>
            </el-table-column>
            <el-table-column label="添加时间" prop="createTime" width="130" align="center" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" style="color: #67C23A;"
                        @click="handleQrcode(scope.row)">二维码</el-button>
                    <el-button size="mini" type="text" @click="handleOrder(scope.row)">相关订单</el-button>
                    <el-button size="mini" type="text" @click="openDialog('edit', '修改', scope.row)">编辑</el-button>
                    <el-button size="mini" type="text" @click="handleDelete(scope.row)"
                        style="color: #F56C6C;">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />
        <!-- 二维码图片 -->
        <el-dialog title="二维码" :visible.sync="qrcodeVisible" width="400px">
            <div style="display: flex;">
                <h3 style="margin:0 20px 0 0;">{{ tableNumber }}二维码</h3>
                <qr-code :id="'QrCode'" :text="codeUrl" class="qrcode" />
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="downloadQrcode">下载</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </el-dialog>

        <!-- 新增或修改桌号列表对话框 -->
        <el-dialog :visible.sync="open" width="800px" append-to-body :title="title" @closed="resetForm('form')">
            <el-form :model="form" label-width="120px" :rules="rules" ref="form" v-loading="loading">
                <el-form-item label="选择店铺" prop="shopId">
                    <el-select v-model="form.shopId" placeholder="选择店铺">
                        <el-option v-for="item in shopList" :key="item.shopId" :label="item.shopName"
                            :value="item.shopId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 批量新增特有的字段 -->
                <el-form-item label="桌号前缀" prop="prefix" v-if="operationType == 'batch'">
                    <el-input placeholder="比如:Y" v-model="form.prefix" />
                </el-form-item>
                <el-form-item label="桌号范围" v-if="operationType == 'batch'">
                    <el-input-number v-model="form.starNumber" :min="1" :max="99" :controls="false" placeholder="1"
                        style="width: 100px;"></el-input-number>
                    <el-button type="text" style="color: #909399;">-</el-button>
                    <el-input-number v-model="form.endNumber" :min="1" :max="99" :controls="false" style="width: 100px;"
                        placeholder="99"></el-input-number>
                </el-form-item>
                <el-form-item label="桌号" prop="tableNumber" v-if="operationType != 'batch'">
                    <el-input placeholder="请输入桌号" v-model="form.tableNumber" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input placeholder="请输入备注" v-model="form.remark" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio v-for="dict in dict.type.store_table_status" :key="dict.value" :label="dict.value">{{
                            dict.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 相关订单 -->
        <order ref="orderData" v-if="showOrder"></order>
        <!-- 导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
            <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
                :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
                :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip text-center" slot="tip">
                    <div class="el-upload__tip" slot="tip">
                        <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
                    </div>
                    <span>仅允许导入xls、xlsx格式文件。</span>
                </div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
                <el-button @click="upload.open = false">取 消</el-button>
            </div>
        </el-dialog>

        <div id="code-box" ref="qrCodeDiv" style="position: absolute; left: -1000px; top: -1000px; z-index: -999">
            <div v-for="(item, index) in codeList" :ref="'code' + index" :id="'code' + index" :key="index"></div>
        </div>

    </div>
</template>
<script>
import order from "./order.vue";
import qrCode from '@/components/QRCode/index.vue'
import { getToken } from "@/utils/auth";
import { listTable, detailTable, createTable, createTableBranch, updateTable, delTable } from "@/api/shop/table"
import { getShop } from "@/api/shop/shop"
import FileSaver from "file-saver";
import JSZip from "jszip";
import QRCode from "qrcodejs2";
import html2canvas from "html2canvas";
export default {
    dicts: ['store_table_status'],
    components: { order, qrCode },
    data() {
        return {
            codeList: [],
            listLoading: false,
            // 导入参数
            upload: {
                selectList: [],
                // 是否显示弹出层（用户导入）
                open: false,
                // 弹出层标题（用户导入）
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的用户数据
                updateSupport: 0,
                // 设置上传的请求头部,
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/ms/lessee/table/importData"
            },
            loading: false,
            showOrder: false,
            total: 0,
            codeUrl: '',
            qrcodeVisible: false,
            form: {

            },
            tableScope: [],
            shopList: [],
            open: false,
            title: '',
            tableNumber: undefined,
            // 默认操作类型是单个新增
            operationType: 'single',
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                shopName: undefined,
                tableNumber: undefined,
            },
            tableList: [],
            // 表单校验
            rules: {
                shopId: [
                    { required: true, message: "该项为必填项", trigger: "blur" }
                ],
                prefix: [
                    { required: true, message: "该项为必填项", trigger: "blur" }
                ],
                tableNumber: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ],
                status: [
                    { required: true, message: "该项为必填项！", trigger: "blur" }
                ]

            }
        }
    },
    created() {
        // console.log(this.queryParams);
        // console.log(window.location.host);
        // console.log(window.location.hostname);

        this.getList()
        // 查询门店列表
        getShop().then(res => {
            this.shopList = res.data
        })

    },
    methods: {
        handleSelectionChange(e) {
            this.selectList = e
            this.selectList.map(item => {
                let shopData = this.shopList.filter(item2 => {
                    return item2.shopName == item.shopName
                })
                this.$set(item, 'codeUrl', `http://${window.location.host}:8081/#/login/${shopData[0].shopId}/${item.tableId}/${item.tableNumber}`)
            })
            this.codeList = this.selectList.map((item, index) => {
                return Object.assign({}, { 'codeUrl': item.codeUrl })
            })
        },
        /** 查询桌号列表 */
        getList() {
            this.listLoading = true
            listTable(this.queryParams).then(res => {
                this.tableList = res.data.tables
                this.total = res.data.total
                this.listLoading = false
            }).catch(() => {
                this.listLoading=false
            })
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.loading = true
                    if (this.form.tableId != undefined) {
                        updateTable(this.form).then(res => {
                            this.loading = false
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        })
                    }
                    else if (this.form.prefix != undefined) {
                        createTableBranch(this.form).then(res => {
                            this.loading = false
                            this.$modal.msgSuccess("批量新增成功");
                            this.open = false;
                            this.getList();
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        createTable(this.form).then(res => {
                            this.loading = false
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        }).catch(() => {
                            this.loading = false
                        })
                    }
                }
            })

        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.qrcodeVisible = false
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('/ms/lessee/table/export', {
                ...this.queryParams
            }, `table_${new Date().getTime()}.xlsx`)
        },
        // 修改和新增弹窗
        openDialog(type, title, row) {
            this.open = true;
            this.operationType = type
            this.title = title;
            if (type === 'edit') {
                detailTable({ tableId: row.tableId }).then(res => {
                    this.form = res.data
                    this.form.tableId = row.tableId
                })
            } else if (type = 'signal') {
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
            const tableId = row.tableId;
            this.$modal.confirm('是否确认删除门店编号为"' + tableId + '"的数据项？').then(function () {
                return delTable({ tableId })
            }).then(() => {
                this.getList()
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        /**相关订单按钮操作 */
        handleOrder(row) {
            this.showOrder = true
            this.$nextTick(() => {
                // 每次都传递当前行数据
                this.$refs.orderData.init(row);
            });
        },
        closeOrder() {
            this.showOrder = false
        },
        // 打开二维码
        handleQrcode(value) {
            this.qrcodeVisible = true
            this.tableNumber = value.tableNumber
            let shopData = this.shopList.filter(item => {
                return item.shopName == value.shopName
            })
            this.codeUrl = encodeURI(`http://${window.location.host}:8081/#/login/${shopData[0].shopId}/${value.tableId}/${value.tableNumber}`)
            console.log(encodeURI(this.codeUrl));
        },
        // 单个下载二维码
        downloadQrcode() {
            //获取canvas标签
            let canvas = document.getElementsByClassName('qrcode')[0].getElementsByTagName('canvas')
            //创建a标签
            let a = document.createElement('a')
            //获取二维码的url并赋值地址为a.href
            a.href = canvas[0].toDataURL('img/png')
            //设置下载文件的名字
            a.download = '二维码图片'
            //点击事件，相当于下载
            a.click()
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 导入按钮操作 */
        handleImport() {
            this.upload.title = "用户导入";
            this.upload.open = true;
        },
        /** 下载模板操作 */
        importTemplate() {
            this.download('/ms/lessee/table/importTemplate', {
            }, `table_template_${new Date().getTime()}.xlsx`)
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.upload.open = false;
            this.upload.isUploading = false;
            this.$refs.upload.clearFiles();
            this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
            this.getList();
            console.log(file);
            console.log(fileList);

        },
        // 提交上传文件
        submitFileForm() {
            this.$refs.upload.submit();
        },
        downloadImg() {
            // 初始化压缩包
            var zip = new JSZip();
            var img = zip.folder("images");
            this.codeList.forEach((item, index, arr) => {
                var qrcode = new QRCode("code" + index, {
                    width: 200, // 设置宽度
                    height: 200, // 设置高度
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    text: item.codeUrl,   //需要跳转的地址--带上编号
                });
                console.log(qrcode, "qrcode");
                // 将生成二维码转换为图片
                html2canvas(document.querySelector("#code" + index), {
                    logging: false,
                    useCORS: true,
                }).then((canvas) => {
                    var imgUrl = canvas.toDataURL("png");
                    // 需要对base64进行截取处理,否则无法顺利打包
                    var regex = /data:image\/.*;base64,/;
                    imgUrl = imgUrl.replace(regex, "");
                    // 添加进img
                    img.file(item + ".png", imgUrl, { base64: true });
                    this.$nextTick(() => {
                        // 判断如果为最后一张图片
                        if (index == arr.length - 1) {
                            zip.generateAsync({ type: "blob" }).then(function (content) {
                                // 调用api进行下载
                                FileSaver.saveAs(content, "二维码.zip");
                            });
                        }
                    });
                });
            });
        },

    }
}
</script>
<style lang="scss" scoped></style>