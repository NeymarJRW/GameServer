<template>
  <div class="recommend">
    <img
      class="erweima"
      src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1573195367472&di=bceec95e129b034b431ca62b2356c8c2&imgtype=0&src=http%3A%2F%2Fpic34.nipic.com%2F20131030%2F2455348_194508648000_2.jpg"
      alt
    />

    <div class="select">
      <Dropdown style="margin-left: 20px;">
        <Button type="primary" style="width:100px">
          {{selectplatname.length>0 ? selectplatname :'选择平台'}}
          <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list" class="xialai">
          <DropdownItem v-for="item in platformarr">
            <span @click="selectPlat(item.platform,item.name )">{{item.name }}</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <!-- <Select v-model="selectplatname" style="width:200px" @click="selectPlat(item.platform)">
        <Option v-for="item in platformarr" :value="item.platform" :key="item.id" >{{ item.name }}</Option>
      </Select>-->
      <Button class="addbtn" type="primary" @click="getallgame">全部游戏</Button>
      <Button class="addbtn" type="primary" @click="addflag = true , platformflag=false">添加推荐游戏</Button>
    </div>

    <Table class="table" :loading="tableloading" stripe border :columns="columns" :data="pagedata"></Table>
    <Page
      :current.sync="pageindex"
      style="text-align:center;margin-top:10px"
      :total="total"
      :page-size="pagesize"
      @on-change="pagechange"
    />

    <!-- 添加游戏 -->
    <Modal v-model="addflag" width="800">
      <p slot="header" style="text-align:center">
        <span>添加推荐游戏</span>
      </p>
      <div class="addgame">
        选择游戏:
        <Select v-model="re_game_id" style="width:500px" @on-change="selectGame">
          <Option
            v-for="item in gamearr"
            :value=" parseInt(item.id) "
            :key="item.id"
          >{{ item.name }}</Option>
        </Select>
      </div>
      <div class="addgame">
        选择平台:
        <Select
          :disabled="platformflag"
          v-model="platform"
          style="width:500px"
          @on-change="selectPlatform"
        >
          <Option v-for="item in platformarr" :value="item.platform" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="addgame" v-show="infocontent">
        应用商店地址:
        <Input v-model="store_url" placeholder="应用商店地址和落地页地址请至少填写一个..." style="width: 500px" />
      </div>
      <div class="addgame" v-show="infocontent">
        落地页地址:
        <Input v-model="url" placeholder="应用商店地址和落地页地址请至少填写一个..." style="width: 500px" />
      </div>
      <div class="addgame" v-show="!infocontent">
        平台唯一标识:
        <Input v-model="appid" placeholder="请输入平台唯一标识..." style="width: 500px" />
      </div>
      <div class="addgame" v-show="!infocontent">
        <Upload
          style="margin:0 40px"
          :on-success="handleUpload"
          type="drag"
          :action="uploadqrcodeurl"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击此处上传二维码图片</p>
          </div>
        </Upload>
        <p>二维码地址:{{ qrcode_url.length>0 ? pinjieUrl+qrcode_url : ''}}</p>
      </div>

      <div class="addgame">
        指定游戏推荐:
        <Select v-model="game_id" style="width:500px">
          <Option
            v-for="item in zhidinggamearr"
            :value="parseInt(item.id)"
            :key="item.id"
          >{{ item.name }}</Option>
        </Select>
        <p style="color:#D1D1D1">*不选默认为全部推荐</p>
      </div>
      <div class="addgame">
        游戏排序:
        <Input v-model="sort" placeholder="默认为0,输入整数为推荐顺序" style="width: 500px" />
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="addRecomGame">添加</Button>
      </div>
    </Modal>

    <!-- 修改游戏 -->
    <Modal v-model="editflag" width="800">
      <p slot="header" style="text-align:center">
        <span>修改推荐游戏</span>
      </p>
      <div class="addgame">
        选择游戏:
        <Select v-model=" re_game_id" style="width:500px" @on-change="selectGame">
          <Option
            v-for="item in gamearr"
            :value=" parseInt(item.id) "
            :key="item.id"
          >{{ item.name }}</Option>
        </Select>
      </div>
      <div class="addgame">
        选择平台:
        <Select disabled v-model="platform" style="width:500px" @on-change="selectPlatform">
          <Option v-for="item in platformarr" :value="item.platform" :key="item.id">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="addgame" v-show="infocontent">
        应用商店地址:
        <Input v-model="store_url" placeholder="应用商店地址和落地页地址请至少填写一个..." style="width: 500px" />
      </div>
      <div class="addgame" v-show="infocontent">
        落地页地址:
        <Input v-model="url" placeholder="应用商店地址和落地页地址请至少填写一个..." style="width: 500px" />
      </div>
      <div class="addgame" v-show="!infocontent">
        平台唯一标识:
        <Input v-model="appid" placeholder="请输入平台唯一标识..." style="width: 500px" />
      </div>
      <div class="addgame" v-show="!infocontent">
        <Upload
          style="margin:0 40px"
          :on-success="handleUpload"
          type="drag"
          :action="uploadqrcodeurl"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击此处上传新的二维码图片</p>
          </div>
        </Upload>
        <p>二维码地址:{{ pinjieUrl+qrcode_url}}</p>
      </div>

      <div class="addgame">
        指定游戏推荐:
        <Select v-model="game_id" style="width:500px">
          <Option
            v-for="item in zhidinggamearr"
            :value="parseInt(item.id)"
            :key="item.id"
          >{{ item.name }}</Option>
        </Select>
        <p style="color:#D1D1D1">*不选默认为全部推荐</p>
      </div>
      <div class="addgame">
        游戏排序:
        <Input v-model="sort" placeholder="默认为0,输入整数为推荐顺序" style="width: 500px" />
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="editRecomGame">修改</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  recomRecommend,
  recomGameadd,
  gameRecommend,
  platformRecommend,
  addrecomRecommend,
  uploadqrcodeurl,
  editrecomRecommend,
  pinjieUrl,
  deleterecomRecommend
} from "@/api/index.js";

export default {
  data() {
    return {
      addflag: false,
      editflag: false,
      platformflag: false,
      selectplatname: "",
      pageindex: 1,
      uploadsrc: "",
      name: "",
      bundle: "",
      version: "",
      icon: null,
      columns: [
        {
          title: "ID",
          key: "id",
          width: 80
        },
        {
          title: "图像",
          key: "re_icon",
          width: 80,
          render: (h, params) => {
            return h("div", [
              h("Avatar", {
                props: {
                  shape: "square",
                  // src: params.row.icon
                  src: pinjieUrl + params.row.re_icon
                }
              })
            ]);
          }
        },
        {
          title: "推荐游戏名称",
          key: "re_game_name",
          width: 120
        },
        {
          title: "平台",
          key: "platform", //platform_name
          width: 150,
          render: (h, params) => {
            return h("div", [
              h("p", params.row.platform + "(" + params.row.platform_name + ")")
            ]);
          }
        },
        //  {
        //   title: "推荐游戏ID",
        //   key: "re_game_id",
        //   width: 100
        // },

        {
          title: "指定游戏推荐名称",
          key: "game_name",
          // width:150,
          render: (h, params) => {
            return h("div", [
              h("p", params.row.game_id == 0 ? "全部" : params.row.game_name)
            ]);
          }
        },
        {
          title: "推荐游戏信息",
          key: "re_info",
          width: 250,
          render: (h, params) => {
            if (
              params.row.platform == "4399" ||
              params.row.platform == "myapp" ||
              params.row.platform == "oppo" ||
              params.row.platform == "android"
            ) {
              return h("div", [
                h("p", "应用商店地址:" + params.row.re_info["store_url"]),
                h("p", "落地页地址:" + params.row.re_info["url"])
              ]);
            } else {
              //二维码
              return h("div", [
                h("img", {
                  attrs: {
                    style: "width: 50px;height:50px;margin:5px",
                    src: pinjieUrl + params.row.re_info["qrcode_url"]
                  },
                  on: {
                    // click: () => {console.log('ffff')},
                    mouseover: () => {
                      document.querySelector(".erweima").style.display =
                        "block";
                      document.querySelector(".erweima").src =
                        pinjieUrl + params.row.re_info["qrcode_url"];
                    },
                    mouseleave: () => {
                      document.querySelector(".erweima").style.display = "none";
                    }
                  }
                }),
                h("p", "平台标识:" + params.row.re_info["appid"])
              ]);
            }
          }
        },
        {
          title: "操作",
          key: "action",
          width: 150,
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
                      //修改推荐游戏参数
                      this.re_id = params.row.id;
                      this.platform = params.row.platform;
                      this.re_game_id = parseInt(params.row.re_game_id);
                      this.game_id = params.row.game_id;
                      this.zhidinggamearr = this.gamearr.filter(
                        item => item.id != this.re_game_id
                      );
                      var arr = [{ name: "全部", id: 0 }];
                      this.zhidinggamearr = arr.concat(this.zhidinggamearr);
                      if (
                        params.row.platform == "4399" ||
                        params.row.platform == "myapp" ||
                        params.row.platform == "oppo" ||
                        params.row.platform == "android"
                      ) {
                        this.infocontent = true;
                        this.store_url = params.row.re_info["store_url"];
                        this.url = params.row.re_info["url"];
                      } else {
                        this.infocontent = false;
                        this.appid = params.row.re_info["appid"];
                        this.qrcode_url = params.row.re_info["qrcode_url"];
                      }
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      // this.show(params.index);
                      this.$Modal.confirm({
                        title: "提示",
                        content:
                          "<p>你确定要删除吗?</p>",
                        onOk: () => {
                          this.deleteRecomGame(params.row.id);
                        },
                        onCancel: () => {
                          // this.$Message.info("Clicked cancel");
                        }
                      });
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
        // {
        //   title: "操作",
        //   key: "action",
        //   // width: 200,
        //   align: "center",
        //   render: (h, params) => {
        //     return h("div", [
        //       h(
        //         "Button",
        //         {
        //           props: {
        //             type: "primary",
        //             size: "small"
        //           },
        //           style: {
        //             marginRight: "5px"
        //           },
        //           on: {
        //             click: () => {
        //               this.editflag = true;
        //               //修改推荐游戏参数
        //               // platform: null
        //               this.re_id = params.row.id;
        //               this.platform = params.row.platform;
        //               // this.platform = "4399";
        //               this.re_game_id = parseInt(params.row.re_game_id);
        //               this.game_id = params.row.game_id;
        //               this.zhidinggamearr = this.gamearr.filter(
        //                 item => item.id != this.re_game_id
        //               );
        //               var arr = [{ name: "全部", id: 0 }];
        //               this.zhidinggamearr = arr.concat(this.zhidinggamearr);

        //               if (
        //                 params.row.platform == "4399" ||
        //                 params.row.platform == "myapp" ||
        //                 params.row.platform == "oppo" ||
        //                 params.row.platform == "android"
        //               ) {
        //                 this.infocontent = true;
        //                 this.store_url = params.row.re_info["store_url"];
        //                 this.url = params.row.re_info["url"];
        //               } else {
        //                 this.infocontent = false;
        //                 this.appid = params.row.re_info["appid"];
        //                 this.qrcode_url = params.row.re_info["qrcode_url"];
        //               }
        //             }
        //           }
        //         },
        //         "修改"
        //       )
        //     ]);
        //   }
        // }
      ],
      gamedata: [], //所有游戏
      total: 0, //一共几条数据
      pagesize: 10, //一页几条数据
      tableloading: false,
      pagedata: [],
      allgamedata: [],
      allpagedata: [],
      gamearr: [], //获取所有游戏信息
      platformarr: [], //获取所有平台信息
      zhidinggamearr: [], //指定推荐游戏信息
      infocontent: true,
      //修改推荐游戏参数
      re_id: null, //平台id
      platform: null,
      re_game_id: null,
      info: [],
      game_id: null,
      sort: null,
      store_url: "",
      url: "",
      appid: "",
      qrcode_url: "",
      uploadqrcodeurl: "",
      pinjieUrl: ""
    };
  },
  watch: {
    editflag(val) {
      if (!val) {
        this.platform = null;
        this.re_game_id = null;
        this.info = [];
        this.game_id = null;
        this.store_url = "";
        this.url = "";
        this.appid = "";
        this.qrcode_url = "";
        this.zhidinggamearr = [];
        this.infocontent = true;
        this.sort = null;
      }
    },
    addflag(val) {
      this.infocontent = true;
      if (!val) {
        this.platform = null;
        this.re_game_id = null;
        this.info = [];
        this.game_id = null;
        this.store_url = "";
        this.url = "";
        this.appid = "";
        this.qrcode_url = "";
        this.zhidinggamearr = [];
        this.sort = null;
      }
    }
  },
  mounted() {
    this.getdata();
    this.uploadqrcodeurl = uploadqrcodeurl;
    this.pinjieUrl = pinjieUrl;
  },
  methods: {
    getpage(data) {
      this.pageindex = 1;
      this.total = data.length;
      this.allgamedata = data;
      this.pagedata = this.allgamedata.slice(0, this.pagesize);
    },
    getdata() {
      this.selectplatname = "";

      this.tableloading = true;
      recomRecommend().then(res => {
        this.tableloading = false;
        this.allpagedata = res.msg;
        this.getpage(res.msg);
      });
      gameRecommend().then(res => {
        this.gamearr = res.msg;
      });
      platformRecommend().then(res => {
        this.platformarr = res.msg;
      });
    },

    pagechange(index) {
      var _start = (index - 1) * this.pagesize;
      var _end = index * this.pagesize;
      this.pagedata = this.allgamedata.slice(_start, _end);
    },
    handleUpload(res) {
      if (res.state == "1") {
        this.qrcode_url = res.msg;
      } else {
        this.$Message.error(res.msg);
      }
    },
    selectGame(id) {
      this.gamearr.map(item => {
        if (item.id == id) {
          this.platform = item.platform;
          if (
            this.platform == "4399" ||
            this.platform == "myapp" ||
            this.platform == "oppo" ||
            this.platform == "android"
          ) {
            this.infocontent = true;
          } else {
            this.infocontent = false;
          }
          return;
        }
      });
      this.platformflag = true;
      this.zhidinggamearr = this.gamearr.filter(item => item.id != id);
      var arr = [{ name: "全部", id: 0 }];
      this.zhidinggamearr = arr.concat(this.zhidinggamearr);
    },
    selectPlatform(name) {
      if (
        name == "4399" ||
        name == "myapp" ||
        name == "oppo" ||
        name == "android"
      ) {
        this.infocontent = true;
      } else {
        this.infocontent = false;
      }
    },
    selectPlat(platform, name) {
      this.selectplatname = name;
      this.getpage(
        this.allpagedata.filter(item => {
          return item.platform == platform;
        })
      );
    },
    getallgame() {
      this.selectplatname = "";

      this.getpage(this.allpagedata);
      // this.selectplatname=null;
    },
    addRecomGame() {
      if (this.platform && this.re_game_id) {
        if (this.infocontent) {
          // 应用宝 4399 oppo andriod
          if (this.store_url.length || this.url.length) {
            this.info = [{ store_url: this.store_url }, { url: this.url }];
            addrecomRecommend({
              platform: this.platform,
              re_game_id: this.re_game_id,
              info: this.info,
              game_id: this.game_id ? this.game_id : 0,
              sort: this.sort ? this.sort : 0
            }).then(res => {
              if (res.state == 1) {
                this.$Message.success(res.msg);
                this.getdata();
                this.addflag = false;
              } else {
                this.$Message.error(res.msg);
              }
            });
          } else {
            this.$Message.error("信息不完整");
          }
        } else {
          //voio xiaomi
          if (this.appid.length > 0 && this.qrcode_url.length > 0) {
            this.info = [
              { appid: this.appid },
              { qrcode_url: this.qrcode_url }
            ];
            addrecomRecommend({
              platform: this.platform,
              re_game_id: this.re_game_id,
              info: this.info,
              game_id: this.game_id ? this.game_id : 0,
              sort: this.sort ? this.sort : 0
            }).then(res => {
              if (res.state == 1) {
                this.$Message.success(res.msg);
                this.getdata();
                this.addflag = false;
              } else {
                this.$Message.error(res.msg);
              }
            });
          } else {
            this.$Message.error("信息不完整");
          }
        }
      } else {
        this.$Message.error("信息不完整");
      }
    },
    editRecomGame() {
      if (this.platform && this.re_game_id) {
        if (this.infocontent) {
          // 应用宝 4399 oppo andriod
          if (this.store_url.length || this.url.length) {
            this.info = [{ store_url: this.store_url }, { url: this.url }];
            editrecomRecommend({
              re_id: parseInt(this.re_id),
              platform: this.platform,
              re_game_id: this.re_game_id,
              info: this.info,
              game_id: this.game_id ? this.game_id : 0,
              sort: this.sort ? this.sort : 0
            }).then(res => {
              if (res.state == 1) {
                this.$Message.success(res.msg);
                this.getdata();
                this.editflag = false;
              } else {
                this.$Message.error(res.msg);
              }
            });
          } else {
            this.$Message.error("信息不完整");
          }
        } else {
          //voio xiaomi
          if (this.appid.length > 0 && this.qrcode_url.length > 0) {
            this.info = [
              { appid: this.appid },
              { qrcode_url: this.qrcode_url }
            ];
            editrecomRecommend({
              re_id: parseInt(this.re_id),
              platform: this.platform,
              re_game_id: this.re_game_id,
              info: this.info,
              game_id: this.game_id ? this.game_id : 0,
              sort: this.sort ? this.sort : 0
            }).then(res => {
              if (res.state == 1) {
                this.$Message.success(res.msg);
                this.getdata();
                this.editflag = false;
              } else {
                this.$Message.error(res.msg);
              }
            });
          } else {
            this.$Message.error("信息不完整");
          }
        }
      } else {
        this.$Message.error("信息不完整");
      }
    },
    deleteRecomGame(id) {
      // console.log(id)
      deleterecomRecommend({ re_id: id }).then(res => {
        if(res.state=="0"){
          this.$Message.success(res.msg);
          this.getdata();
        }else{
          this.$Message.error(res.msg);
        }
      });
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
  /* margin-bottom: 10px; */
  margin-left: 10px;
}
.erweima {
  width: 200px;
  height: 200px;
  position: absolute;
  right: 10px;
  z-index: 10;
  display: none;
}
.select {
  display: flex;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
