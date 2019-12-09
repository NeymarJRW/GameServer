<template>
  <div class="recommend">
    <Button class="addbtn" type="primary" @click="addflag = true">添加游戏</Button>

    <Table class="table" :loading="tableloading" stripe border :columns="columns" :data="pagedata"></Table>
    <Page
      style="text-align:center;margin-top:10px"
      :total="total"
      :page-size="pagesize"
      @on-change="pagechange"
    />
    <!-- <Poptip trigger="hover" placement="right" >
        <img style="width:50px" src="http://img4.imgtn.bdimg.com/it/u=1485081754,2164381578&fm=26&gp=0.jpg" alt="">
        <div class="api" slot="content">
          <img style="width:200px" src="http://img4.imgtn.bdimg.com/it/u=1485081754,2164381578&fm=26&gp=0.jpg" alt="">

        </div>
    </Poptip>-->

    <!-- 添加游戏 -->
    <Modal v-model="addflag" width="600">
      <p slot="header" style="text-align:center">
        <span>添加游戏</span>
      </p>
      <div class="addgame">
        名称:
        <Input v-model="name" placeholder="请输入游戏名称..." style="width: 400px" />
      </div>
      <div class="addgame">
        bundle:
        <Input v-model="bundle" placeholder="请输入游戏标识..." style="width: 400px" />
      </div>
      <div class="addgame">
        版本:
        <Input v-model="version" placeholder="请输入游戏版本..." style="width: 400px" />
      </div>
      <div class="addgame">
        平台:
        <Select v-model="platform" style="width:400px">
          <Option v-for="item in platformarr" :value="item.platform" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="addgame">
        <Upload
          style="margin:0 40px"
          :before-upload="handleUpload"
          type="drag"
          action="//jsonplaceholder.typicode.com/posts/"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击此处上传你的头像</p>
          </div>
          <img :src="uploadsrc" class="upload_image" alt />
        </Upload>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="addGame">添加</Button>
      </div>
    </Modal>

    <!-- 修改游戏 -->
    <Modal v-model="editflag" width="600">
      <p slot="header" style="text-align:center">
        <span>修改游戏</span>
      </p>
      <div class="addgame">
        名称:
        <Input v-model="name" placeholder="请输入游戏名称..." style="width: 400px" />
      </div>
      <div class="addgame">
        bundle:
        <Input v-model="bundle" placeholder="请输入游戏标识..." style="width: 400px" />
      </div>
      <div class="addgame">
        版本:
        <Input v-model="version" placeholder="请输入游戏版本..." style="width: 400px" />
      </div>
      <div class="addgame">
        平台:
        <Select v-model="platform" style="width:400px">
          <Option v-for="item in platformarr" :value="item.platform" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="addgame">
        <Upload
          style="margin:0 40px"
          :before-upload="handleUpload"
          type="drag"
          action="//jsonplaceholder.typicode.com/posts/"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击此处上传你的头像</p>
          </div>
          <img :src="uploadsrc" class="upload_image" alt />
        </Upload>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="editGame">修改</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  gameRecommend,
  platformRecommend,
  recomGameadd,
  pinjieUrl,
  recomGameedit
} from "@/api/index.js";
import { Msg } from "@/api/data.js";
import { log } from "util";
export default {
  data() {
    return {
      editflag: false,
      addflag: false,
      uploadsrc: "",

      id: "",
      name: "",
      bundle: "",
      version: "",
      icon: null,
      platform: "",

      platformarr: [],
      columns: [
        {
          title: "ID",
          key: "id",
          width: 80
        },
        {
          title: "图像",
          key: "icon",
          width: 80,
          render: (h, params) => {
            return h("div", [
              h("Avatar", {
                props: {
                  shape: "square",
                  // src: params.row.icon
                  src: pinjieUrl + params.row.icon
                }
              })
            ]);
          }
        },
        {
          title: "名称",
          key: "name",
          width: 150
        },
        {
          title: "版本",
          key: "version",
          width: 150
        },
        {
          title: "Bundle",
          key: "bundle"
        },
        {
          title: "平台",
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
                      console.log(params.row);
                      this.id = params.row.id;
                      this.name = params.row.name;
                      this.bundle = params.row.bundle;
                      this.version = params.row.version;
                      this.uploadsrc = pinjieUrl + params.row.icon;
                      // this.icon = params.row.icon;
                      this.platform = params.row.platform;
                    }
                  }
                },
                "修改"
              )
            ]);
          }
        }
      ],
      gamedata: [], //所有游戏
      total: 0, //一共几条数据
      pagesize: 5, //一页几条数据
      tableloading: false,
      pagedata: []
    };
  },
  watch: {
    editflag(val) {


      if (!val) {
        this.id = "";
        this.name = "";
        this.bundle = "";
        this.version = "";
        this.icon = null;
        this.platform = "";
        this.uploadsrc="";
      }
    },
    addflag(val) {


      if (!val) {
        this.id = "";
        this.name = "";
        this.bundle = "";
        this.version = "";
        this.icon = null;
        this.platform = "";
        this.uploadsrc="";

      }
    }
  },
  mounted() {
    this.getdata();
  },
  methods: {
    getdata() {

      this.tableloading = true;
      gameRecommend().then(res => {
        this.tableloading = false;
        this.total = res.msg.length;
        this.gamedata = res.msg;
        this.pagedata = this.gamedata.slice(0, this.pagesize);
      });
      platformRecommend().then(res => {
        // console.log(res);
        this.platformarr = res.msg;
      });
    },
    pagechange(index) {
      var _start = (index - 1) * this.pagesize;
      var _end = index * this.pagesize;
      this.pagedata = this.gamedata.slice(_start, _end);
    },
    handleUpload(file) {
      var self = this;
      // console.log(file);
      var reader = new FileReader(),
        img = new Image();
      reader.readAsDataURL(file);
      reader.onload = function() {
        // console.log(this.result);
        self.uploadsrc = this.result;
      };
      this.icon = file;
    },
    editGame() {
      if (
        this.bundle.length > 0 &&
        this.name.length > 0 &&
        this.version.length > 0 &&
        this.platform.length > 0
      ) {
        let data = new FormData();
        data.append("id", this.id);
        data.append("bundle", this.bundle);
        data.append("name", this.name);
        data.append("version", this.version);
        data.append("platform", this.platform);
        if (this.icon) {
          data.append("icon", this.icon);
        }
        const option = {
          method: "post",
          body: data
        };
        fetch(recomGameedit, option)
          .then(res => res.json())
          .then(resJson => {
            if (resJson.state === "1") {
              this.editflag = false;
              this.$Message.success(resJson.msg);
              this.getdata();
            } else {
              this.$Message.error(resJson.msg);
            }
          });
      } else {
        this.$Message.error("修改失败");
      }
    },
    addGame() {
      if (
        this.bundle.length > 0 &&
        this.name.length > 0 &&
        this.version.length > 0 &&
        this.platform.length > 0 &&
        this.icon
      ) {
        let data = new FormData();
        data.append("bundle", this.bundle);
        data.append("name", this.name);
        data.append("version", this.version);
        data.append("platform", this.platform);
        data.append("icon", this.icon);
        const option = {
          method: "post",
          body: data
        };
        fetch(recomGameadd, option)
          .then(res => res.json())
          .then(resJson => {
            if (resJson.state === "1") {
              this.addflag = false;
              this.$Message.success(resJson.msg);
              this.getdata();
            } else {
              this.$Message.error(resJson.msg);
            }
          });
      } else {
        this.$Message.error("添加失败");
      }
    }
  }
};
</script>

<style scoped>
.recommend {
  width: 100%;
  height: 100%;
  padding: 20px;
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
</style>
