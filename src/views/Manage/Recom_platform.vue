<template>
  <div class="recommend">
    <Button class="addbtn" type="primary" @click="addflag = true">添加平台</Button>

    <Table class="table" :loading="tableloading" stripe border :columns="columns" :data="gamedata"></Table>

    <!-- 添加平台 -->
    <Modal v-model="addflag" width="600">
      <p slot="header" style="text-align:center">
        <span>添加平台</span>
      </p>
      <div class="addgame">
        名称:
        <Input v-model="name" placeholder="请输入平台名称..." style="width: 400px" />
      </div>
      <div class="addgame">
        平台标识:
        <Input v-model="platform" placeholder="请输入平台英文名称..." style="width: 400px" />
      </div>
      <div class="addgame">
        序号:
        <Input v-model="sort" placeholder="请输入序号,不输入默认为0..." style="width: 400px" />
      </div>
      <div class="addgame">
        备注:
        <Input v-model="note" placeholder="请输入备注(可不填)..." style="width: 400px" />
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="addPlatform">添加</Button>
      </div>
    </Modal>

    <!-- 修改平台 -->
    <Modal v-model="editflag" width="600">
      <p slot="header" style="text-align:center">
        <span>修改平台</span>
      </p>
      <div class="addgame">
        名称:
        <Input v-model="name" placeholder="请输入平台名称..." style="width: 400px" />
      </div>
      <div class="addgame">
        平台标识:
        <Input v-model="platform" placeholder="请输入平台英文名称..." style="width: 400px" />
      </div>
      <div class="addgame">
        序号:
        <Input v-model="sort" placeholder="请输入序号,不输入默认为0..." style="width: 400px" />
      </div>
      <div class="addgame">
        备注:
        <Input v-model="note" placeholder="请输入备注(可不填)..." style="width: 400px" />
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="editPlatform">添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { platformRecommend, addplatform, editplatform } from "@/api/index.js";
export default {
  data() {
    return {
      addflag: false,
      editflag: false,
      id: "",
      name: "",
      platform: "",
      sort: null,
      note: null,
      columns: [
        {
          title: "名称",
          key: "name"
        },
        {
          title: "平台标识",
          key: "platform"
        },
        {
          title: "操作",
          key: "action",
          // width: 200,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editflag = true;
                      this.id = params.row.id;
                      this.name = params.row.name;
                      this.platform = params.row.platform;
                      this.sort = params.row.sort;
                      this.note = params.row.note;
                    }
                  }
                },
                "修改"
              )
            ]);
          }
        }
      ],
      gamedata: [], //所有数据
      // total: 0, //一共几条数据
      // pagesize: 5, //一页几条数据
      tableloading: false
    };
  },
  watch: {
    editflag(val) {
      if (!val) {
        this.id = "";
        this.name = "";
        this.platform = "";
        this.sort = null;
        this.note = null;
      }
    },
    addflag(val) {
      if (!val) {
        this.id = "";
        this.name = "";
        this.platform = "";
        this.sort = null;
        this.note = null;
      }
    }
  },
  mounted() {
    this.getdata();
  },
  methods: {
    getdata() {
      this.tableloading = true;
      platformRecommend().then(res => {
        this.tableloading = false;
        this.gamedata = res.msg;
      });
    },

    addPlatform() {
      if (this.platform.length > 0 && this.name.length > 0) {
        addplatform({
          platform: this.platform,
          name: this.name,
          sort: this.sort ? this.sort : 0,
          note: this.note ? this.note : null
        }).then(res => {
          if (res.state == 1) {
            this.addflag = false;
            this.getdata();
            this.$Message.success(res.msg);
          } else {
            this.$Message.error(res.msg);
          }
        });
      } else {
        this.$Message.error("添加失败");
      }
    },
    editPlatform() {
      if (this.platform.length > 0 && this.name.length > 0) {
        editplatform({
          id: this.id,
          platform: this.platform,
          name: this.name,
          sort: this.sort ? this.sort : 0,
          note: this.note ? this.note : null
        }).then(res => {
          if (res.state == 1) {
            this.editflag = false;
            this.getdata();
            this.$Message.success(res.msg);
          } else {
            this.$Message.error(res.msg);
          }
        });
      } else {
        this.$Message.error("修改失败");
      }
    }
  }
};
</script>

<style scoped>
.recommend {
  width: 100%;
  height: 100%;
  padding: 10px 20px;
}
.addgame {
  text-align: center;
  margin-top: 10px;
}
.upload_image {
  position: absolute;
  top: 0;
  transform: translate(-50%, 0);
  height: 100%;
}
.addbtn {
  margin-bottom: 10px;
}
/* CFBundleDisplayName="Legend Never Dies";
CFBundleDisplayName="伝説は死なない";
CFBundleDisplayName="Legende stirbt nie"; 德
CFBundleDisplayName="La légende ne meurt jamais"; 法 */
</style>


