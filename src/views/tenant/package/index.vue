<template>
  <div class="app-container">
    <!-- 查询表单 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="套餐名" prop="rentalMealName" @keyup.enter.native="handleQuery">
        <el-input v-model="queryParams.rentalMealName" placeholder="请输入套餐名" style="width: 240px" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.tenant_package_status" :key="dict.value" :label="dict.label"
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['system:role:add']"
          @click="openDialog('add')">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 套餐列表 -->
    <el-table :data="mealList" v-loading="listLoading">
      <el-table-column label="套餐编号" prop="rentalMealId" />
      <el-table-column label="套餐名" prop="rentalMealName" />
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tenant_package_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['tenant:package:edit']"
            @click="openDialog('edit', scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['tenant:package:remove']"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 新增或修改租户套餐对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body @close="close">
      <el-form :model="form" label-width="80px" :rules="rules" ref="form" v-loading="loading">
        <el-form-item label="套餐名" prop="rentalMealName">
          <el-input placeholder="请输入套餐名" v-model="form.rentalMealName" />
        </el-form-item>
        <el-form-item label="菜单权限">
          全选/全不选：<el-switch v-model="menuExpand" @change="handleCheckedTreeExpand($event)"></el-switch>
          全部展开/折叠：<el-switch v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)"></el-switch>
          <el-tree class="tree-border" :data="menuOptions" show-checkbox ref="menu" node-key="id" :props="defaultProps"
            empty-text="加载中，请稍候"></el-tree>

        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in dict.type.tenant_package_status" :key="dict.value" :label="dict.value">{{
              dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input placeholder="请输入备注" v-model="form.remark" />
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
import { treeselect as menuTreeselect } from "@/api/system/menu";
import { listLesseemeal, updateLesseemeal, delLesseemeal, listTreeselect, dtlLesseemeal } from "@/api/lessee/meal"
export default {
  dicts: ['tenant_package_status'],
  data() {
    return {
      loading: false,
      listLoading: false,
      // 创建时间
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        rentalMealName: undefined,
        status: undefined,
        latestCreateTime: undefined,
        earliestCreateTime: undefined
      },
      mealList: [],
      showSearch: true,
      // 总条数
      total: 0,
      open: false,
      form: {},
      title: "",
      // 菜单列表
      menuOptions: [],
      // 表单校验
      rules: {
        rentalMealName: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ],
        status: [
          { required: true, message: "该项为必填项", trigger: "blur" }
        ]

      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 树权限（展开/折叠）
      menuExpand: false,
      // 树权限（全选/全不选）
      menuNodeAll: false
    }
  },

  created() {
    this.getList()
  },
  methods: {
    /** 查询套餐列表 */
    getList() {
      this.listLoading = true
      this.handleDataRange()
      listLesseemeal(this.queryParams).then(res => {
        this.mealList = res.data.voList
        this.total = res.data.totalNumber
        this.listLoading = false
      }
      );
    },
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
    // 树权限（展开/折叠）
    handleCheckedTreeNodeAll(value) {
      let treeList = this.menuOptions;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
      }

    },
    // 树权限（全选/全不选）
    handleCheckedTreeExpand(value) {
      this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);

    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      listTreeselect().then(res => {
        this.menuOptions = res.data;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 提交按钮 */
    submitForm() {
      this.form.dataScope = '0'
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.loading = true
          this.form.menuIdList = this.getMenuAllCheckedKeys().join(',')
          if (this.form.rentalMealId !== undefined) {
            updateLesseemeal(this.form).then(res => {
              this.$modal.msgSuccess("修改成功");
              this.loading = false
              this.open = false;
              this.getList();
            }).catch(() => {
              this.loading = false
            })
          } else {
            updateLesseemeal(this.form).then(res => {
              this.$modal.msgSuccess("新增成功");
              this.loading = false
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
      this.reset();
    },
    // 修改和新增弹窗
    openDialog(type, row) {
      this.open = true;
      this.getMenuTreeselect()
      if (type === 'edit') {
        const rentalMealId = row.rentalMealId
        this.title = "修改"
        this.$nextTick(() => {
          dtlLesseemeal({ rentalMealId: rentalMealId }).then(res => {
            this.form = res.data
            this.$refs.menu.setCheckedKeys(this.form.menuIdList);
          })
        });
      }
      else {
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
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.menuExpand = false,
        this.menuNodeAll = false,
        this.resetForm("form");
    },
    // 关闭弹窗
    close() {
      this.reset()
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const rentalMealId = row.rentalMealId;
      this.$modal.confirm('是否确认删除套餐编号为"' + rentalMealId + '"的数据项？').then(function () {
        return delLesseemeal({ rentalMealId })
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
  }
}
</script>