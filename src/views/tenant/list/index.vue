<template>
  <div class="app-container">
    <!-- 查询表单 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="租户名" prop="lesseeName">
        <el-input v-model="queryParams.lesseeName" placeholder="请输入租户名" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="联系人" prop="contactPersonName">
        <el-input v-model="queryParams.contactPersonName" placeholder="请输入联系人" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="联系手机" prop="contactPersonPhonenumber">
        <el-input v-model="queryParams.contactPersonPhonenumber" placeholder="请输入联系手机" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="租户状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择租户状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.tenant_list_status" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['sass:admin:lessee:add']"
          @click="openDialog('add')">新增</el-button>
        <el-button type="warning" plain icon="el-icon-download" size="mini" 
          @click="handleExport">导出</el-button>
      </el-form-item>
    </el-form>

    <!-- 租户列表 -->
    <el-table :data="lesseeList" v-loading="listLoading">
      <el-table-column label="租户编号" prop="lesseeId" align="center" />
      <el-table-column label="租户名" prop="lesseeName" align="center" />
      <el-table-column label="租户套餐" prop="rentalMealName" align="center">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.rentalMealName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="联系人" prop="contactPersonName" align="center" />
      <el-table-column label="联系手机" prop="contactPersonPhonenumber" align="center" />
      <el-table-column label="账号额度" prop="accountValue" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.accountValue }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="过期时间" align="center" prop="deadlineDate" width="180" />
      <el-table-column label="绑定域名" prop="domainName" align="center" />
      <el-table-column label="租户状态" prop="status" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tenant_list_status" :value="scope.row.status"
            @change="handleStatusChange(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" prop="operate">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['sass:admin:lessee:update']"
            @click="openDialog('edit', scope.row)">编辑</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['sass:admin:lessee:delete']"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改租户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body @closed="resetForm('form')">
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="租户名" prop="lesseeName">
          <el-input v-model="form.lesseeName" placeholder="请输入租户名" />
        </el-form-item>
        <el-form-item label="租户套餐" prop="rentalMealId">
          <el-select v-model="form.rentalMealId" placeholder="请选择租户套餐">
            <el-option v-for="item in rentalMeal" :key="item.rentalMealId" :label="item.rentalMealName"
              :value="item.rentalMealId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPersonName">
          <el-input v-model="form.contactPersonName" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系手机" prop="contactPersonPhonenumber">
          <el-input v-model="form.contactPersonPhonenumber" placeholder="请输入联系手机" />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName" v-if="form.lesseeId == undefined">
          <el-input v-model="form.userName" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="form.lesseeId == undefined" >
          <el-input v-model="form.password" placeholder="请输入用户密码" />
        </el-form-item>
        <el-form-item label="账号额度" prop="accountValue">
          <el-input-number v-model="form.accountValue" controls-position="right" placeholder="请选择账号额度" />
        </el-form-item>
        <el-form-item label="过期时间" prop="deadlineDate">
          <el-date-picker type="date" placeholder="请选择过期时间" v-model="form.deadlineDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="绑定域名" prop="domainName">
          <el-input v-model="form.domainName" placeholder="请输入绑定域名" />
        </el-form-item>
        <el-form-item label="租户状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in dict.type.tenant_list_status" :key="dict.value" :label="dict.value">{{
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
import { listLessee, addLessee, listDropdownbox, updateLessee, delLessee } from "@/api/lessee/list"
export default {
  dicts: ['tenant_list_status'],
  data() {
    return {
      // 日期范围
      dateRange: [],
      listLoading:false,
      // 查询参数
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        contactPersonName: undefined,
        lesseeName: undefined,
        contactPersonPhonenumber: undefined,
        status: undefined,
        earliestCreateTime: undefined,
        latestCreateTime: undefined
      },
      lesseeList: [{
        tenantId: 1,
        tenantName: "hhh",
        package: 11,
        contact: 121313,
        phone: 12132312,
        limit: 100,
        expiration: 1 - 1,
        domain: 2323312,
        status: 1,
      }],
      rentalMeal: [],
      showSearch: true,
      // 总条数
      total: 0,
      // 表单参数
      form: {},
      title: "",
      open: false,
      // 表单校验
      rules: {
        lesseeName: [
          { required: true, message: "租户名不能为空", trigger: "blur" }
        ],
        rentalMealId: [
          { required: true, message: "租户套餐不能为空", trigger: "blur" }
        ],
        contactPersonName: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" }
        ],
        contactPersonPhonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        accountValue: [
          { required: true, message: "账号额度不能为空", trigger: "blur" }
        ],
        deadlineDate: [
          { required: true, message: "过期时间不能为空", trigger: "blur" }
        ],
        domainName: [
          { required: true, message: "绑定域名不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "租户状态不能为空", trigger: "blur" }
        ],
      }
    }
  },
  created() {
    this.getList()
    this.getListDropdownbox()

  },
  methods: {
    // 日期选择器赋值
    handleDataRange() {
      if (this.dateRange) {
        this.queryParams.earliestCreateTime = this.dateRange[0]
        this.queryParams.latestCreateTime = this.dateRange[1]
      } else {
        this.queryParams.earliestCreateTime = undefined
        this.queryParams.latestCreateTime = undefined
      }
    },
    /** 查询租户列表 */
    getList() {
      this.handleDataRange()
      this.listLoading=true
      listLessee(this.queryParams).then(res => {
        this.lesseeList = res.data.vos
        this.total = res.data.totalNumber
        this.listLoading=false
      }
      );
    },
    // 查询套餐编号和名称（下拉）
    getListDropdownbox() {
      listDropdownbox().then(res => {
        this.rentalMeal = res.data
      })
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const trimmedString = JSON.stringify(this.form.deadlineDate).replace(/^"|"$/g, '')
          const date = new Date(trimmedString);
          const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          this.form.deadlineDate = formattedDate
          if (this.form.lesseeId != undefined) {
            updateLessee(this.form).then(res => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            }).catch(()=>{
              this.loading=false
            })
          } else {
            addLessee(this.form).then(res => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            }).catch(()=>{
              this.loading=false
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
    openDialog(type, row = null) {
      this.open = true;
      if (type === 'edit') {
        this.title = "修改"
        this.form = { ...row };
      } else {
        this.form = {}
        this.title = "新增"
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.dateRange = []
      this.getList()
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const lesseeId = row.lesseeId;
      this.$modal.confirm('是否确认删除租户编号为"' + lesseeId + '"的数据项？').then(function () {
        return delLessee({ lesseeId })
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('sass/admin/lessee/export', {
        ...this.queryParams
      }, `lessee_${new Date().getTime()}.xlsx`)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

  }
}
</script>