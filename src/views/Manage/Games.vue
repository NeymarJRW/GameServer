<template>
  <div class="container">
    <Spin size="large" fix v-if="spinShow"></Spin>

    <!-- 全部游戏 -->
    <Button type="primary" @click="allgame" style="margin-left: 20px;">全部游戏</Button>

    <!-- 选择分类 -->
    <Dropdown style="margin-left: 20px;">
      <Button type="primary" style="width:100px">
        {{showtype.length>0 ? showtype :'选择分类'}}
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list" class="xialai">
        <DropdownItem v-for="item in gametype">
          <span @click="selecttype(item)">{{item}}</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <!-- 选择标签 -->
    <Dropdown style="margin-left: 20px">
      <Button type="primary" style="width:100px">
        {{showtip.length>0 ? showtip :'选择标签'}}
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list" class="xialai">
        <DropdownItem v-for="item in gametip">
          <span @click="selecttip(item)">{{item}}</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <!-- 选择平台 -->
    <Dropdown style="margin-left: 20px">
      <Button type="primary" style="width:100px">
        {{showpingtai.length>0 ? showpingtai :'选择平台'}}
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list" class="xialai">
        <DropdownItem v-for="item in pigntaitip">
          <span @click="selectpigntai(item)">{{item}}</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <!-- 按游戏名搜索 -->
    <Input
      class="sousuo"
      v-model="searchvalue"
      search
      enter-button
      placeholder="按游戏名搜索"
      @on-search="search"
    />

    <div class="marilyn_tab" ref="marilyn_tab" id="totop">
      <Card class="marilyn_card marilyn_card_add" ref="#top">
        <div class="add_game_view" @click="addCard = true">
          <img src="../../images/add.png" style="height:164px;width:164px">
          <span>添加游戏</span>
        </div>
      </Card>
      <Card class="marilyn_card" v-for="i in datalist">
        <div style="text-align:center">
          <img :src="gameImgurl + i.image" class="marilyn_img">
          <p class="marilyn_des">中文名称 : {{i.name}}  </p>
          <p class="marilyn_des">英文名称 : {{i.alias}} </p>
          <p class="marilyn_des">
            游戏地址 :
            <a target="_Blank" :href="i.type=='0' ? gameImgurl + i.url : i.url">{{i.url}}</a>
          </p>
          <p class="marilyn_des">创建时间 : {{i.time}}</p>
          <p class="marilyn_des">所属分类: {{i.class.name}}</p>
          <p class="marilyn_des">
            所属标签 :
            <template v-for="v in i.label">{{v.name}},</template>
          </p>
          <p
            class="marilyn_des"
          >游戏平台 : {{(i.android==1 ? '安卓,' : '')+(i.ios==1 ? 'ios,' : '')+(i.wechat==1 ? '小程序' : '')}}</p>
          <p
            class="marilyn_des"
          >游戏类型 : {{i.type ? (i.type==0 ? '游戏' : (i.type==1 ? 'ios' : 'android' ) ) : '未定义' }}</p>

          <p class="marilyn_des">
            屏幕方向 :
            <template v-if="i.screen == 0">竖屏</template>
            <template v-else>横屏</template>
          </p>
          <p class="marilyn_des">
            是否推荐 :
            <template v-if="i.recommend == 0">不推荐</template>
            <template v-else>推荐</template>
          </p>
          <p class="marilyn_des">游戏权重 : {{i.weight}}</p>
          <p class="marilyn_des">游戏标记问题 : {{i.weight}}</p>
          <Button
            type="primary"
            style="width:100px"
            @click="markclick(i),dialogTableVisible = true"
          >标记</Button>
        </div>
        <div class="marilyn_tools">
          <i
            class="fas fa-trash-alt"
            style="cursor:pointer;color:#ed4014"
            @click="currentDelete = i.id; deleteModel = !deleteModel"
          ></i>
          <i class="far fa-edit" style="cursor:pointer" @click="editEvent(i)"></i>
        </div>
      </Card>
    </div>

    <!-- <Modal v-model="clear" width="480" height="600" style="width:400px">
             <p slot="header" style="color:#2d8cf0;text-align:center">
                <span>清空缓存类型</span>
              </p>
             <Select
              v-model="clear_value"
              multiple
            >
              <Option v-for="(item,index) in clearcon" :value="item.value" :key="index">{{item.content}}</Option>
            </Select>
             <div slot="footer">
        <Button
          v-show='btnEdit'
          ref="btn_edit"
          class='btn_edit'
          type="primary"
          size="large"
          long
          :loading="modal_loading"

        >确认</Button>

      </div>
    </Modal>-->
    <!-- problemreason -->
    <Modal v-model="dialogTableVisible" width="480" height="600" style="width:400px">
      <p slot="header" style="color:#2d8cf0;text-align:center">
        <span>选择游戏问题类型</span>
      </p>
      <Select v-model="problemreason_value" multiple>
        <Option v-for="(item,index) in problemreason" :value="item.id" :key="index">{{item.content}}</Option>
      </Select>
      <div slot="footer">
        <Button
          v-show="btnEdit"
          ref="btn_edit"
          class="btn_edit"
          type="primary"
          size="large"
          long
          :loading="modal_loading"
          @click="prolome"
        >确认</Button>
      </div>
    </Modal>
    <!-- 增加 -->
    <Modal v-model="addCard" width="480" footer-hide>
      <Card class="marilyn_card addgame">
        <div style="text-align:center" class="marilyn_up_card">
          <Upload
            style="margin:0 auto"
            multiple
            type="drag"
            :action="gameUpload"
            name="file"
            :on-success="uploadSuccess"
            :show-upload-list="false"
            :format="['jpg','jpeg','png','gif']"
            :before-upload="handleUpload"
          >
            <div style="padding: 20px 0;width:200px">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>单击或拖动图片到此处上传</p>
            </div>
            <img :src="marilynNewImg" class="upload_image" alt>
          </Upload>

          <div class="marilyn_margin">
            中文名称 :
            <Input
              class="judgename_add"
              prefix="ios-game-controller-b"
              placeholder="中文游戏名称 ..."
              style="width: 200px"
              v-model="marilynName"
            />
          </div>
          <div class="marilyn_margin">
            英文名称 :
            <Input
              prefix="ios-game-controller-b-outline"
              placeholder="英文游戏名称 ..."
              style="width: 200px"
              v-model="marilynAlias"
            />
          </div>

          <div
            class="marilyn_margin"
            style="display:flex;align-items: center;justify-content:center"
          >
            所属分类 :
            <Select v-model="marilynSelect" style="width:186px;margin-left:6px;text-align: left;">
              <Option v-for="item in classList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>

          <div class="marilyn_margin">
            所属标签 :
            <Select
              v-model="marilynTag"
              multiple
              style="width:186px;margin-left:6px;text-align: left;"
            >
              <Option v-for="item in tagLists" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="marilyn_margin">
            游戏平台 :
            <Select
              v-model="pingtaivalue"
              multiple
              style="width:186px;margin-left:6px;text-align: left;"
            >
              <Option v-for="item in pingtailists" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <div class="marilyn_margin">
            游戏类型 :
            <Select v-model="marilynType" style="width:186px;margin-left:6px;text-align: left;">
              <Option v-for="item in typeLists" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>

          <div
            class="marilyn_margin"
            v-show="marilynType== '1' ? true :(marilynType== '2' ? true :false )"
          >
            所属地址 :
            <Input
              prefix="md-pricetags"
              placeholder="请输入游戏地址 ..."
              style="width: 200px"
              v-model="marilynUrl"
            />
          </div>
          <Upload
            v-show="marilynType== '0' ? true :false"
            style="margin-top:15px;margin:15px auto"
            multiple
            type="drag"
            :action="gameUpload"
            name="file"
            :on-success="uploadSuccess"
            :show-upload-list="false"
            :format="['zip']"
            :before-upload="zipUpload"
          >
            <div style="padding: 20px 0;width:200px">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>
                单击或拖动zip格式
                <br>游戏压缩包到此处上传
              </p>
              <p v-if="uploaded" style="margin-top:15px">{{uploadtitle}}</p>
            </div>
          </Upload>

          <div
            class="marilyn_margin"
            style="display:flex;align-items: center;justify-content:center"
          >
            屏幕方向 :
            <Select v-model="marilyndir" style="width:186px;margin-left:6px;text-align: left;">
              <Option
                v-for="item in directionLists"
                :value="item.value"
                :key="item.value"
              >{{ item.name }}</Option>
            </Select>
          </div>
          <div
            class="marilyn_margin"
            style="display:flex;align-items: center;justify-content:center"
          >
            是否推荐 :
            <Select v-model="marilyncom" style="width:186px;margin-left:6px;text-align: left;">
              <Option
                v-for="item in commendLists"
                :value="item.value"
                :key="item.value"
              >{{ item.name }}</Option>
            </Select>
          </div>
          <div
            class="marilyn_margin"
            style="display:flex;align-items: center;justify-content:center"
          >
            <span style="padding-right:5px">权重数值 :</span>
            <Input type="text" prefix="md-pie" style="width: 200px" v-model="marilynnum"/>
          </div>
          <div
            class="marilyn_margin"
            style="display:flex;align-items: center;justify-content:center"
          >
            <span style="padding-right:5px;color:#b3b3b3">*权重数值:1默认，正整数从大到小推荐</span>
          </div>
          <div class="marilyn_margin">
            <Button
              v-show="btnAdd"
              ref="btn_add"
              id="btn"
              type="primary"
              @click="addGame"
              style="width: 200px"
            >添加</Button>
            <Button
              v-show="!btnAdd"
              disabled
              class="btn"
              type="primary"
              @click="addGame"
              style="width: 200px"
            >添加</Button>
          </div>
        </div>
      </Card>
    </Modal>
    <!-- 删除 -->
    <Modal v-model="deleteModel" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>确认删除游戏</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="toolDelete">删除</Button>
      </div>
    </Modal>
    <!-- 修改 -->
    <Modal v-model="editModel" width="480">
      <p slot="header" style="color:#2d8cf0;text-align:center">
        <span>修改</span>
      </p>
      <div style="text-align:center">
        <div style="position:relative;display:flex;justify-content:center">
          <input type="file" class="inputfile" name="file" @change="modifyUpload" id="fileImg">
          <img
            :src="currentEdit.thumbnail ? gameImgurl + currentEdit.thumbnail : '' "
            alt
            style="width:50px;height:50px;display:block;"
            class="curtimg"
          >
        </div>
        <div>
          中文名称 : &nbsp;&nbsp;
          <Input
            class="judgename_edit"
            prefix="ios-game-controller-b"
            placeholder="游戏中文名称 ..."
            style="width:200px;margin:5px 0"
            v-model="currentEdit.name"
          />
        </div>
        <div>
          英文名称 : &nbsp;&nbsp;
          <Input
            prefix="ios-game-controller-b-outline"
            placeholder="游戏英文名称 ..."
            style="width:200px;margin:5px 0"
            v-model="currentEdit.alias"
          />
        </div>

        <div>
          所属分类 :
          <Select
            prefix="logo-buffer"
            v-model="classId"
            placeholder="所属游戏分类 ..."
            style="width:200px;text-align: left;margin-left:6px;margin-bottom:5px;margin-top:5px"
          >
            <Option v-for="item in classList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </div>
        <div>
          所属标签 :
          <Select
            v-model="labelId"
            multiple
            style="width:200px;margin-left:6px;text-align: left;margin-top:5px"
          >
            <Option v-for="item in tagLists" :value="item.id" :key="item.name">{{ item.name }}</Option>
          </Select>
        </div>
        <div>
          游戏平台 :
          <Select
            v-model="editPTvalue"
            multiple
            style="width:200px;margin-left:6px;text-align: left;margin-top:5px"
          >
            <Option
              v-for="item in editpingtaivalue"
              :value="item.name"
              :key="item.name"
            >{{ item.name }}</Option>
          </Select>
        </div>

        <div>
          游戏类型 :
          <Select
            v-model="typeId"
            style="width:200px;margin-left:6px;text-align: left;margin-top:5px"
          >
            <Option v-for="item in typeLists" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </div>

        <div v-show="typeId== '1' ? true :(typeId== '2' ? true :false) ">
          所属地址 : &nbsp;&nbsp;
          <Input
            prefix="md-pricetags"
            placeholder="所属游戏地址 ..."
            style="width:200px;margin:5px 0"
            v-model="currentEdit.url"
          />
        </div>
        <Upload
          v-show="typeId== '0' ? true :false"
          style="margin:15px auto;width:200px"
          multiple
          type="drag"
          :action="gameUpload"
          name="file"
          :on-success="uploadSuccess"
          :show-upload-list="false"
          :format="['zip']"
          :before-upload="zipUpload"
        >
          <div style="padding: 20px 0;width:200px">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>
              单击或拖动zip格式
              <br>游戏压缩包到此处上传
            </p>
            <p v-if="uploaded" style="margin-top:15px">{{uploadtitle}}</p>
          </div>
        </Upload>
        <div>
          屏幕方向 :
          <Select
            v-model="currentEdit.screen"
            style="width:200px;margin-left:6px;text-align: left;margin-top:5px"
          >
            <Option
              v-for="item in directionLists"
              :value="item.value"
              :key="item.value"
            >{{ item.name }}</Option>
          </Select>
        </div>
        <div>
          是否推荐 :
          <Select
            v-model="currentEdit.recommend"
            style="width:200px;margin-left:6px;text-align: left;margin-top:5px"
          >
            <Option
              v-for="item in commendLists"
              :value="item.value"
              :key="item.value"
            >{{ item.name }}</Option>
          </Select>
        </div>
        <div>
          权重数值 :
          <Input
            type="text"
            prefix="md-pie"
            style="width:200px;margin-left:6px;text-align: left;margin-top:5px"
            v-model="currentEdit.weight"
          />
          <p style="font-size:12px;color:#b3b3b3;padding-left:50px">*1默认，正整数从大到小推荐</p>
        </div>
      </div>
      <div slot="footer">
        <Button
          v-show="btnEdit"
          ref="btn_edit"
          id="btn_edit"
          type="primary"
          size="large"
          long
          :loading="modal_loading"
          @click="toolEdit"
        >确认</Button>
        <Button
          v-show="!btnEdit"
          disabled
          ref="btn_edit"
          type="primary"
          size="large"
          long
          :loading="modal_loading"
          @click="toolEdit"
        >确认</Button>
      </div>
    </Modal>

    <!-- MODAL↑-->
    <Page
      :total="datacount"
      :page-size="pagesize"
      :current.sync="pageindex"
      @on-change="changepage"
      show-elevator
      class="page"
    />
  </div>
</template>

<script>
import {
  mark,
  problemReason,
  gameIndex,
  gameImgurl,
  classIndex,
  gameDelete,
  labelIndex,
  gameuploadUri,
  gameUpdate,
  zipuploadUrl,
  judgeName,
  onfocus,
  onblur,
  clear
} from "@/api/index";
import axios from "axios";
import { setInterval, clearTimeout, setTimeout } from "timers";
export default {
  data() {
    return {
      pageindex: 1,
      clear: false,
      markid: "",
      btnAdd: true,
      btnEdit: true,
      totaldatalist: [],
      datalist: [],
      datacount: 0, //一共几条游戏
      pagesize: 9, //分页
      classList: [],
      tagLists: [],
      typeLists: [
        { id: "0", name: "游戏" },
        { id: "1", name: "ios" },
        { id: "2", name: "android" }
      ],
      pingtailists: [
        { id: "2", name: "android" },
        { id: "1", name: "ios" },
        { id: "0", name: "小程序" }
      ],
      pingtaivalue: "",
      editpingtaivalue: [],
      editPTvalue: [],
      savegamearr: [], //选择后存储当前的游戏数量,联动选择
      savegameflag: true, //分类,或标签,平台其中任意一个选择时为假
      typeflag: false, //联动检索判断
      tipflag: false, //联动检索判断
      pingtaiflag: false, //联动检索判断
      connectflag: false, //联动检索判断 为true 联动开启
      connectarr: [],
      pigntaitip: ["ios", "安卓", "小程序"],
      gametype: [], //游戏分类
      showtype: "", //显示游戏分类
      gametip: [], //游戏标签
      showtip: "", //显示游戏标签
      showpingtai: "", //显示选择平台
      searchvalue: "", //搜索框的值
      file: "",
      zipfile: "",
      zipfileUrl: "",
      gameImgurl: "",
      zipuploadUrl: "",
      gameUpload: "",
      gameuploadUri: "",
      uploaded: false,
      uploadtitle: "已上传0%",
      marilynName: "",
      marilynAlias: "",
      marilynUrl: "",
      marilynTag: "",
      marilynType: "",
      marilyndir: "",
      marilyncom: "",
      marilynnum: 1,
      marilynSelect: "",
      currentDelete: "",
      deleteModel: false,
      editModel: false,
      modal_loading: false,
      currentEdit: {},
      marilynNewImg: "",
      spinShow: true,
      labelId: [],
      typeId: [],
      classId: "",
      currentImg: null,
      addCard: false,
      dialogTableVisible: false,
      formLabelWidth: "120px",
      problemreason: [],
      directionLists: [
        {
          value: "0",
          name: "竖屏"
        },
        {
          value: "1",
          name: "横屏"
        }
      ],
      commendLists: [
        {
          value: "0",
          name: "不推荐"
        },
        {
          value: "1",
          name: "推荐"
        }
      ],
      problemreason_value: [],
      clear_value: [],
      clearcon: [
        {
          value: "index",
          content: "首页"
        },
        {
          value: "recommend",
          content: "推荐"
        },
        {
          value: "news",
          content: "最新"
        },
        {
          value: "hot",
          content: "最热"
        },
        {
          value: "class",
          content: "分类推荐"
        },
        {
          value: "label",
          content: "标签推荐"
        },
        {
          value: "all",
          content: "全部缓存"
        }
      ]
    };
  },
  mounted() {
    this.problemList();
    var judgename_add = document
      .querySelector(".judgename_add")
      .querySelector("input");
    var judgename_edit = document
      .querySelector(".judgename_edit")
      .querySelector("input");

    onfocus(judgename_add, () => {
      judgename_add.style.border = "1px solid #2d8cf0";
      this.btnAdd = true;
    });
    onblur(judgename_add, () => {
      judgeName({ name: this.marilynName, type: "game" }).then(res => {
        if (res.state == 0) {
          if (this.addCard) {
            this.btnAdd = false;
            this.$Message.error("名字为空或该名字已存在");
            judgename_add.style.border = "1px solid red";
            setTimeout(() => {
              judgename_add.style.border = "1px solid #dcdee2";
            }, 2000);
          } else {
            this.btnAdd = true;
          }
        }
      });
    });
    onfocus(judgename_edit, () => {
      judgename_edit.style.border = "1px solid #2d8cf0";
      this.btnEdit = true;
    });
    onblur(judgename_edit, () => {
      this.btnEdit = true;
      judgeName({
        name: this.currentEdit.name,
        type: "game",
        id: this.currentDelete
      }).then(res => {
        if (res.state == 0) {
          if (this.editModel) {
            this.btnEdit = false;
            this.$Message.error("名字为空或该名字已存在");
            judgename_edit.style.border = "1px solid red";
            setTimeout(() => {
              judgename_edit.style.border = "1px solid #dcdee2";
            }, 2000);
          }
        }
      });
    });

    this.zipuploadUrl = zipuploadUrl;
    this.gameImgurl = gameImgurl;
    this.gameuploadUri = gameuploadUri;
    this.getData();
    classIndex().then(res => {
      if (res.state === "1") {
        this.classList = res.msg;
      }
    });
    labelIndex().then(res => {
      if (res.state === "1") {
        this.tagLists = res.msg;
      }
    });
  },

  methods: {
    markclick(i) {
      this.markid = i.id;
    },
    prolome() {
      mark({
        id: this.markid,
        tab: this.problemreason_value.join(",")
      }).then(res => {
        // console.log(res)
        if (res.msg == "标记成功！") {
          this.$message({
            message: "标记成功",
            type: "success"
          });
        } else {
          this.$message.error("标记失败");
        }
      });
      this.getData();
      this.dialogTableVisible = false;
    },
    editEvent(e) {
      //   {id:"2",name: "android" },
      //   {id:"1",name: "ios" },
      //   {id:"0",name: "小程序" }
      this.editpingtaivalue.push({ name: "android", value: e.android });
      this.editpingtaivalue.push({ name: "ios", value: e.ios });
      this.editpingtaivalue.push({ name: "wechat", value: e.wechat });
      if (e.android == 1) {
        this.editPTvalue.push("android");
      }
      if (e.ios == 1) {
        this.editPTvalue.push("ios");
      }
      if (e.wechat == 1) {
        this.editPTvalue.push("wechat");
      }

      this.labelId = [];
      this.currentEdit = e;
      this.editModel = true;
      this.typeId = e.type;
      // console.log(this.typeId);
      for (var i = 0; i < e.label.length; i++) {
        this.labelId.push(e.label[i].id);
      }
      this.classId = e.class.id;
    },
    getpage(res) {
      this.totaldatalist = res;
      this.datacount = this.totaldatalist.length;
      if (this.datacount < this.pagesize) {
        this.datalist = this.totaldatalist;
      } else {
        this.datalist = this.totaldatalist.slice(0, this.pagesize);
      }
    },
    problemList() {
      problemReason().then(res => {
        // console.log(res.msg)
        // let arr = []
        // for ( var i = 0; i <res.msg.length; i++){
        //     arr.push(res.msg[i].content)
        // }
        // console.log(arr)
        this.problemreason = res.msg;
      });
    },
    getData() {
      // this.connect()
      this.spinShow = true;
      gameIndex().then(res => {
        if (res.state === "1") {
          // console.log(res.msg)
          this.spinShow = false;
          if (res.msg == "数据为空！") {
            this.getpage("");
          } else {
            var len = res.msg.length;
            for (var i = 0; i < len; i++) {
              //获取游戏分类
              if (this.gametype.indexOf(res.msg[i].class.name) == -1) {
                this.gametype.push(res.msg[i].class.name);
              }
              var tip_len = res.msg[i].label.length;
              for (var j = 0; j < tip_len; j++) {
                if (this.gametip.indexOf(res.msg[i].label[j].name) == -1) {
                  this.gametip.push(res.msg[i].label[j].name);
                }
              }
            }
            this.getpage(res.msg);
          }
        }
      });
    },
    //判断联动
    connect() {
      this.connectarr = [this.showtype, this.showtip, this.showpingtai];
      var num = 0;
      for (var i = 0; i < 3; i++) {
        if (this.connectarr[i]) {
          num++;
        }
      }
      if (num >= 2) {
        this.connectflag = true;
      }
    },
    //获取联动数据
    connectResult() {
      // console.log(this.connectarr)
      // console.log("/////////////////////////////");
      var newarr = [];
      var that=this;
      gameIndex().then(res => {
        if (res.state === "1") {
          if (this.connectarr[0]) {
            //type
            if (newarr.length > 0) {
              newarr = newarr.filter(function(item) {
                if (item.class.name == that.connectarr[0]) {
                  return item;
                }
              });
            } else {
              newarr = res.msg.filter(function(item) {
                if (item.class.name == that.connectarr[0]) {
                  return item;
                }
              });
            }
          }
          // console.log(newarr);
          if (this.connectarr[1]) {
            //tip
            if (newarr.length > 0) {

              newarr = newarr.filter(function(item) {
                var len = item.label.length;
                if (len > 0) {
                  for (var j = 0; j < len; j++) {
                    if (item.label[j].name == that.connectarr[1]) {
                      return item;
                    }
                  }
                }
              });
            } else {
              newarr = res.msg.filter(function(item) {
                var len = item.label.length;
                if (len > 0) {
                  for (var j = 0; j < len; j++) {
                    if (item.label[j].name == that.connectarr[1]) {
                      return item;
                    }
                  }
                }
              });
            }
          }
          // console.log(newarr);

          if (this.connectarr[2]) {

            if (newarr.length > 0) {
              newarr = newarr.filter(function(item) {
                // console.log(i)
                if (that.connectarr[2]== "小程序") {
                  if (item.wechat == "1") {
                    return item;
                  }
                } else if (that.connectarr[2] == "安卓") {
                  if (item.android == "1") {
                    return item;
                  }
                } else if (that.connectarr[2] == "ios") {
                  if (item.ios == "1") {
                    return item;
                  }
                }
              });
            } else {
              newarr = res.msg.filter(function(item) {
                // console.log(i)
                if (that.connectarr[2] == "小程序") {
                  if (item.wechat == "1") {
                    return item;
                  }
                } else if (that.connectarr[2] == "安卓") {
                  if (item.android == "1") {
                    return item;
                  }
                } else if (that.connectarr[2] == "ios") {
                  if (item.ios == "1") {
                    return item;
                  }
                }
              });
            }
          }
          // console.log(newarr);

          this.getpage(newarr);
        }
      });
    },
    //全部游戏列表
    allgame() {
      this.searchvalue=''
      this.pageindex = 1;
      gameIndex().then(res => {
        this.showtype = "";
        this.showtip = "";
        this.showpingtai = "";
        this.connect();
        this.connectflag = false;
        if (res.state === "1") {
          this.getpage(res.msg);
          this.spinShow = false;
        }
      });
    },
    //选择平台
    selectpigntai(i) {
      this.pageindex = 1;
      this.showpingtai = i;
      this.connect();
      // this.showtype = [];
      // this.showtip = [];
      if (this.connectflag) {
        this.connectResult();
      } else {
        gameIndex().then(res => {
          if (res.state === "1") {
            var newarr = res.msg.filter(function(item) {
              // console.log(i)
              if (i == "小程序") {
                if (item.wechat == "1") {
                  return item;
                }
              } else if (i == "安卓") {
                if (item.android == "1") {
                  return item;
                }
              } else if (i == "ios") {
                if (item.ios == "1") {
                  return item;
                }
              }
            });
            this.getpage(newarr);
          }
        });
      }
    },
    //选择分类
    selecttype(i) {
      this.pageindex = 1;
      // this.showtip = [];
      this.showtype = i;
      this.connect();
      // this.showpingtai=[]
      if (this.connectflag) {
        this.connectResult();
      } else {
        gameIndex().then(res => {
          if (res.state === "1") {
            var newarr = res.msg.filter(function(item) {
              if (item.class.name == i) {
                return item;
              }
            });
            this.getpage(newarr);
          }
        });
      }
    },
    //选择标签
    selecttip(i) {
      this.pageindex = 1;
      // this.showtype = [];
      this.showtip = i;
      this.connect();
      // this.showpingtai=[]
      if (this.connectflag) {
        this.connectResult();
      } else {
        gameIndex().then(res => {
          if (res.state === "1") {
            var newarr = res.msg.filter(function(item) {
              var len = item.label.length;
              if (len > 0) {
                for (var j = 0; j < len; j++) {
                  if (item.label[j].name == i) {
                    return item;
                  }
                }
              }
            });
            this.getpage(newarr);
            // this.savegamearr = newarr;
          }
        });
      }
    },

    //搜索
    search(val) {
      this.pageindex = 1;
      if (val) {
        gameIndex().then(res => {
          if (res.state === "1") {
            var newarr = res.msg.filter(function(item) {
              if (
                item.name.indexOf(val) == 0 &&
                item.name.length == val.length
              ) {
                return item;
              }
            });
            if (newarr.length > 0) {
                this.showtype = "";
                this.showtip = "";
                this.showpingtai = "";
                this.connect();
                this.connectflag = false;
              this.getpage(newarr);
            } else {
              this.$Message.warning("没有找到匹配结果");
            }
          }
        });
      } else {
        this.$Message.warning("请输入搜索内容");
      }
    },
    changepage(index) {
      var _start = (index - 1) * this.pagesize;
      var _end = index * this.pagesize;
      this.datalist = this.totaldatalist.slice(_start, _end);
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      this.$refs.marilyn_tab.scrollTop;
    },
    uploadSuccess(res, file) {},
    handleUpload(file) {
      var self = this;
      // console.log(file);
      var reader = new FileReader(),
        img = new Image();
      reader.readAsDataURL(file);
      reader.onload = function() {
        // console.log(this.result);
        self.marilynNewImg = this.result;
      };
      this.file = file;
    },
    zipUpload(file) {
      this.zipfileUrl = "";
      var btn = document.querySelector("#btn");
      var btn_edit = document.querySelector("#btn_edit");
      // console.log(btn)
      // console.log(btn_edit)

      btn.disabled = true;
      btn_edit.disabled = true;
      var a = 0;
      var jindu = setInterval(() => {
        a++;
        this.uploadtitle = "已上传" + a + "%";
        if (this.zipfileUrl) {
          this.uploadtitle = "上传完成";
          btn.disabled = false;
          btn_edit.disabled = false;

          clearTimeout(jindu);
        }
        if (a == 99) {
          clearTimeout(jindu);
          var newtime = setInterval(() => {
            this.uploadtitle = "已上传99%";
            if (this.zipfileUrl) {
              this.uploadtitle = "上传完成";
              btn.disabled = false;
              btn_edit.disabled = false;
              clearTimeout(newtime);
            }
          }, 100);
        }
      }, 700);

      if (file.type.indexOf("zip") > -1) {
        this.uploaded = true;
        this.zipfile = file;
        let data = new FormData();
        const option = {
          method: "post",
          body: data
        };
        data.append("file", this.zipfile);
        fetch(zipuploadUrl, option)
          .then(res => res.json())
          .then(resJson => {
            if (resJson.state === "1") {
              this.zipfileUrl = resJson.msg;
              //  console.log('上传 '+ this.zipfileUrl)
            }
          });
      }
    },
    modifyUpload(e) {
      var self = this;
      this.currentImg = e.currentTarget.files[0];
      var reader = new FileReader(),
        img = new Image();
      reader.readAsDataURL(this.currentImg);
      reader.onload = function(e) {
        // self.marilynAddImg = e.target.result
        document.querySelector(".curtimg").src = e.target.result;
      };
    },
    addGame() {
      let data = new FormData();

      // console.log(this.pingtaivalue);
      //   {id:"2",name: "android" },
      //   {id:"1",name: "ios" },
      //   {id:"0",name: "小程序" }
      if (this.pingtaivalue.length > 0) {
        //android
        if (this.pingtaivalue.indexOf("2") > -1) {
          data.append("android", "1");
        } else {
          data.append("android", "0");
        }
        //ios
        if (this.pingtaivalue.indexOf("1") > -1) {
          data.append("ios", "1");
        } else {
          data.append("ios", "0");
        }
        //小程序
        if (this.pingtaivalue.indexOf("0") > -1) {
          data.append("wechat", "1");
        } else {
          data.append("wechat", "0");
        }
      }
      if (this.marilynType == "0") {
        this.marilynUrl = this.zipfileUrl;
      }
      data.append("file", this.file);
      data.append("name", this.marilynName);
      data.append("alias", this.marilynAlias);
      data.append("url", this.marilynUrl);
      data.append("cId", this.marilynSelect);
      if (this.marilynTag) {
        data.append("label", this.marilynTag.join(","));
      }
      data.append("type", this.marilynType);
      data.append("screen", this.marilyndir);
      data.append("recommend", this.marilyncom);
      data.append("weight", this.marilynnum);
      const option = {
        method: "post",
        body: data
      };
      fetch(gameuploadUri, option)
        .then(res => res.json())
        .then(resJson => {
          if (resJson.state === "1") {
            this.$Message.success(resJson.msg);
            this.file = "";
            this.marilynName = "";
            this.marilynAlias = "";
            this.marilynUrl = "";
            this.marilynSelect = "";
            this.marilynTag = "";
            this.marilynNewImg = "";
            this.getData();
            this.addCard = false;
          } else {
            this.$Message.error(resJson.msg);
          }
        });
    },
    toolDelete() {
      gameDelete({
        id: this.currentDelete
      }).then(res => {
        if (res.state === "1") {
          this.deleteModel = false;
          this.$Message.success(res.msg);
          this.getData();
        } else {
          this.$Message.error(res.msg);
        }
      });
    },
    toolEdit() {
      let data = new FormData();
      //   {id:"2",name: "android" },
      //   {id:"1",name: "ios" },
      //   {id:"0",name: "小程序" }
      if (this.editPTvalue.indexOf("android") > -1) {
        data.append("android", "1");
      } else {
        data.append("android", "0");
      }
      if (this.editPTvalue.indexOf("ios") > -1) {
        data.append("ios", "1");
      } else {
        data.append("ios", "0");
      }
      if (this.editPTvalue.indexOf("wechat") > -1) {
        data.append("wechat", "1");
      } else {
        data.append("wechat", "0");
      }
      if (this.currentImg) {
        data.append("file", this.currentImg);
      }
      data.append("id", this.currentEdit.id);
      data.append("name", this.currentEdit.name);
      data.append("alias", this.currentEdit.alias);
      data.append("cId", this.classId);
      data.append("label", this.labelId.join(","));
      data.append("type", this.typeId);
      data.append("url", this.currentEdit.url);
      data.append("recommend", this.currentEdit.recommend);
      data.append("screen", this.currentEdit.screen);
      data.append("weight", this.currentEdit.weight);
      const option = {
        method: "post",
        body: data
      };
      fetch(gameUpdate, option)
        .then(res => res.json())
        .then(resJson => {
          if (resJson.state === "1") {
            this.editModel = false;
            this.$Message.success(resJson.msg);
            this.getData();
          } else {
            this.$Message.error(resJson.msg);
          }
        });
    }
  },
  watch: {
    marilynType(value) {
      if (value != 0) {
        document.querySelector(".btn").disabled = false;
      } else {
        if (this.uploadtitle != "上传完成") {
          document.querySelector(".btn").disabled = true;
        }
      }
    },
    addCard(value) {
      this.btnAdd = true;
    },
    editModel(value) {
      this.btnEdit = true;
      if (!value) {
        this.editPTvalue = [];
        this.editpingtaivalue = [];
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.container {
  padding-top: 20px;
}

.marilyn_tab {
  padding-bottom: 5.333333rem; /* 200/37.5 */
  margin-top: 20px;
}

.marilyn_card_add {
  display: flex;
  align-items: center;
  justify-content: center;
}

.addgame {
  width: 100%;
}

.add_game_view {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.marilyn_tools {
  margin-top: 20px;
}

.upload_image {
  position: absolute;
  top: 0;
  height: 100%;
}

.inputfile {
  height: 164px;
  width: 164px;
  position: absolute;
  top: 0;
  opacity: 0;
}

.curtimg {
  height: 164px;
  width: 164px;
}

.page {
  text-align: center;
  width: calc(100% - 16rem /* 600/37.5 */);
  padding: 0.8rem /* 30/37.5 */ /* 20/37.5 */ 0;
  background: rgb(240, 242, 245);
  position: fixed;
  bottom: 0;
}

.xialai span {
  display: block;
  width: 100%;
  height: 100%;
}

.sousuo {
  position: absolute;
  top: 20px;
  width: 200px;
  left: 480px;
}
</style>

