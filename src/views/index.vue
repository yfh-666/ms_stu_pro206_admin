<template>
  <div class="app-container">
    <el-main>
      <!-- 上方卡片 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="box-card" shadow="hover">
            <div slot="header">
              <span>会员总数</span>
            </div>
            <div class="text-center">{{ memberCount }}</div>
            <div class="footer">
              <div>今日订单数</div>
              <div>{{ todayOrder }}单</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card" shadow="hover">
            <div slot="header">
              <span>订单总数</span>
            </div>
            <div class="text-center">{{ orderCount }}</div>
            <div class="footer">
              <div>昨日订单数</div>
              <div>{{ yesterdayOrder }}单</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card" shadow="hover">
            <div slot="header">
              <span>总金额</span>
            </div>
            <div class="text-center">{{ totalAmount }}</div>
            <div class="footer">
              <div>近七天订单数</div>
              <div>{{ sevenOrder }}单</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card" shadow="hover">
            <div slot="header">
              <span>商品总数</span>
            </div>
            <div class="text-center">{{ productCount }}</div>
            <div class="footer">
              <div>本月订单数</div>
              <div>{{ monthOrder }}单</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-card>
            <div slot="header" style="display: flex;justify-content: space-between;">
              <span>通知公告</span>
              <el-button size="mini" type="text" @click="openDialog">新增</el-button>
            </div>
            <div class="notice-list">
              <div v-for="(item, index) in noticeList" :key="index" class="notice" @click="handleDetail(item)">
                <div style="align-content: center ;">
                  <el-avatar size="small" :src="item.avatar"></el-avatar>
                </div>
                <div
                  style="display: flex;  justify-content: space-between;  width: 80%; flex-direction: column;margin-left: 10px;">
                  <div style="font-size: 16px;margin-bottom: 10px;">{{ item.noticeTitle }}</div>
                  <div style="color: #cacaca; font-size: 12px;">{{ item.createTime }}</div>
                </div>
                <div>
                  <el-button size="mini" type="text" icon="el-icon-edit" @click="openDialog('edit', item)"
                    @click.stop>编辑</el-button>
                  <el-button size="mini" type="text" icon="el-icon-delete" style="color: #F56C6C;" @click.stop
                    @click="handleDelete(item)">删除</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <!-- 详情弹窗 -->
    <el-dialog :visible.sync="open" width="800px" append-to-body :title="noticeDetail.noticeTitle" v-loading="loading"
      @close="handleClose">
      <div>{{ noticeDetail.noticeContent }}</div>
    </el-dialog>
    <!-- 编辑页弹窗 -->
    <el-dialog :visible.sync="show" width="500px" append-to-body v-loading="loading" @close="handleClose"
      :title="title">
      <el-form :model="form" ref="form" :inline="true" :rules="rules" label-width="120px">
        <el-form-item label="公告标题" prop="noticeTitle">
          <el-input v-model="form.noticeTitle" placeholder="请输入公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告类型" prop="noticeType">
          <el-select v-model="form.noticeType" placeholder="请选择公告类型" clearable>
            <el-option v-for="dict in dict.type.notice_type_list" :key="dict.value" :label="dict.label"
              :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="公告内容" prop="noticeContent">
          <el-input v-model="form.noticeContent" placeholder="请输入公告内容" type="textarea" :rows="6"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNumber" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
import { listNotice, dtlNotice, updateNotice, delNotice, orderTotal, orderMoney, productTotal, lesseeTotal } from "@/api/notice/list"
export default {
  dicts: ['notice_type_list'],
  data() {
    return {
      loading: false,
      open: false,
      show: false,
      form: {},
      memberCount: undefined,
      orderCount: undefined,
      totalAmount: undefined,
      productCount: undefined,
      yesterdayOrder: undefined,
      sevenOrder: undefined,
      monthOrder: undefined,
      todayOrder: undefined,
      notices: [
        { title: '公告：618最后三天，你还不来', time: '2021-01-05' },
        { title: '通知：B2C单商户微服务-统计报表功能正式发布', time: '2021-01-05' },
      ],
      noticeList: [],
      noticeDetail: {},
      // 查询参数
      queryParams: {
        pageNumber: 1,
        pageSize: 10
      },
      total: 0,
      // 表单校验
      rules: {
        noticeType: [
          { required: true, message: "请选择公告类型", trigger: "blur" }
        ],
        noticeContent: [
          { required: true, message: "请输入公告内容", trigger: "blur" }
        ],
        noticeTitle: [
          { required: true, message: "请输入公告标题", trigger: "blur" }
        ],
      },
      
      title:undefined
    };
  },
  created() {
    this.getList()
    orderTotal().then(res => {
      this.orderCount = res.data
    })
    orderTotal({ days: 2 }).then(res => {
      this.yesterdayOrder = res.data
    })
    orderTotal({ days: 1 }).then(res => {
      this.todayOrder = res.data
    })
    orderTotal({ days: -7 }).then(res => {
      this.sevenOrder = res.data
    })
    orderTotal({ days: -30 }).then(res => {
      this.monthOrder = res.data
    })
    orderMoney().then(res => {
      this.totalAmount = res.data
    })
    productTotal().then(res => {
      this.productCount = res.data
    })
    lesseeTotal().then(res => {
      this.memberCount = res.data
    })
  },
  methods: {
    viewNotice(notice) {
      // 实现查看通知详情的功能，例如打开一个对话框显示通知内容  
      this.$alert(notice.content, '通知详情', {
        confirmButtonText: '确定',
        callback: action => {
          // 可以在这里处理用户查看完通知后的操作  
        }
      });
    },
    getList() {
      listNotice(this.queryParams).then(res => {
        this.total = res.data.total
        this.noticeList = res.data.voList
        this.noticeList.map(item => item.avatar = process.env.VUE_APP_BASE_API + item.avatar)
      })
    },
    handleDetail(e) {
      this.open = true
      this.loading = true
      dtlNotice({ noticeId: e.noticeId }).then(res => {
        this.noticeDetail = res.data
        this.loading = false
      })
    },
    handleClose() {
      this.noticeDetail = {}
    },
    hanleMore() {

    },
    handleDelete(e) {
      const noticeId = e.noticeId;
      this.$modal.confirm('是否确认删除公告编号为"' + noticeId + '"的数据项？').then(function () {
        return delNotice({ noticeId: noticeId })
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    // 取消按钮
    cancel() {
      this.show = false;
    },
    // 修改和新增弹窗
    openDialog(type, row) {
      this.show = true;
      if (type === 'edit') {
        this.title = "修改"
        this.loading = true
        dtlNotice({ noticeId: row.noticeId }).then(res => {
          this.form = { ...res.data };
          this.loading = false
        })

      } else {
        this.form = {}
        this.title = "新增"
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.noticeId != undefined) {
            updateNotice(this.form).then(res => {
              this.$modal.msgSuccess("修改成功");
              this.show = false;
              this.getList();
            })
          } else {
            updateNotice(this.form).then(res => {
              this.$modal.msgSuccess("新增成功");
              this.show = false;
              this.getList();
            })
          }
        }
      })
    },
  }
};  
</script>

<style scoped>
.box-card {
  margin-bottom: 20px;
}

.text-center {
  font-size: 24px;
  height: 80px;
  align-content: center;
}

.footer {
  border-top: 1px solid #e6ebf5;
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: space-between;
}

.notice {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #e6ebf5;
  padding: 20px 0;
  cursor: pointer;
}
</style>