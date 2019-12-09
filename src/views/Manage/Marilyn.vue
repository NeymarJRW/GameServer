<template>
  <div class="container">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="marilyn_tab">
      <Card class="marilyn_card marilyn_upload">
        <div class="add_game_view" @click="addCard = true">
          <img src="../../images/add.png" style="height:150px;width:150px">
          <span style="display:block;text-align:center">添加分类</span>
        </div>
      </Card>

      <Card class="marilyn_card" v-for="i in datalist">
        <div style="text-align:center">
          <img :src="gameImgurl + i.image" class="marilyn_img">
          <h3 class="marilyn_name">{{i.name}}</h3>
          <p class="marilyn_num">英文名: {{i.alias }}</p>
          <p class="marilyn_num">游戏数量: {{i.num}}</p>
          <p class="marilyn_num">排序: {{i.order}}</p>
        </div>
        <div class="marilyn_tools">
          <i
            class="fas fa-trash-alt"
            style="cursor:pointer;color:#ed4014"
            @click="currentDelete = i.id; deleteModel = !deleteModel"
          ></i>
          <i
            class="far fa-edit"
            style="cursor:pointer"
            @click="updateImage = i.image;updateId = i.id; updateName = i.name;updateEnName =i.alias, updateOrder = i.order; editModel = !editModel"
          ></i>
        </div>
      </Card>
    </div>

    <Modal v-model="addCard" width="360" footer-hide>
      <div style="text-align:center" class="marilyn_up_card">
        <Upload
          multiple
          type="drag"
          :action="gameUpload"
          name="file"
          :on-success="uploadSuccess"
          :show-upload-list="false"
          :format="['jpg','jpeg','png','gif']"
          :before-upload="handleUpload"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>单击或拖动图片到此处上传</p>
          </div>
          <img :src="marilynimg" class="upload_image" alt>
        </Upload>
      </div>

      <div class="marilyn_margin" style="text-align:center">
        <Input
          class="judgename_add"
          prefix="ios-game-controller-b"
          placeholder="中文分类名字 ..."
          style="width: auto"
          v-model="marilynName"
        />
      </div>
      <div class="marilyn_margin" style="text-align:center">
        <Input
          prefix="ios-game-controller-b-outline"
          placeholder="英文分类名字 ..."
          style="width: auto"
          v-model="marilynEnName"
        />
      </div>
      <div class="marilyn_margin" style="text-align:center">
        <Input placeholder="排序序号 ..." style="width: auto" v-model="marilynOrder">
          <Icon type="logo-buffer" slot="prefix"/>
        </Input>
        <p style="font-size:12px;color:#b3b3b3;">*0默认，正整数从大到小排序</p>
      </div>
      <Button
        v-show="btnAdd"
        ref="btn_add"
        type="primary"
        long
        class="marilyn_margin"
        @click="addClass"
      >添加</Button>
      <Button
        v-show="!btnAdd"
        disabled
        ref="btn_add"
        type="primary"
        long
        class="marilyn_margin"
        @click="addClass"
      >添加</Button>
    </Modal>
    <Modal v-model="deleteModel" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="toolDelete">删除</Button>
      </div>
    </Modal>
    <Modal v-model="editModel" width="360">
      <p slot="header" style="color:#2d8cf0;text-align:center">
        <span>修改</span>
      </p>
      <div style="text-align:center">
        <div style="position:relative;height:164px;width:100%">
          <input type="file" class="inputfile" name="file" @change="modifyUpload" id="fileImg">
          <img :src="gameImgurl + updateImage" alt class="curtimg">
        </div>
        <div>
          中文名字 :
          <Input
            class="judgename_edit"
            prefix="logo-buffer"
            placeholder="分类名字 ..."
            style="width:auto;margin:10px 0"
            v-model="updateName"
          />
        </div>
        <div>
          英文名字 :
          <Input
            prefix="logo-buffer"
            placeholder="分类名字 ..."
            style="width:auto;margin:10px 0"
            v-model="updateEnName"
          />
        </div>
        <div>
          排&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp序 :
          <Input placeholder="排序序号 ..." style="width: auto;margin:10px 0" v-model="updateOrder">
            <Icon type="logo-buffer" slot="prefix"/>
          </Input>
          <p style="font-size:12px;color:#b3b3b3;padding-left:30px">*0默认，正整数从大到小排序</p>
        </div>
      </div>
      <div slot="footer">
        <Button
          v-show="btnEdit"
          ref="btn_edit"
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
  </div>
</template>

<script>
import {
  classIndex,
  classAdd,
  classDelete,
  classUpdate,
  gameImgurl,
  judgeName,
  onfocus,
  onblur
} from "@/api/index";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      btnAdd: true,
      btnEdit: true,
      datalist: [],
      marilynName: "",
      marilynEnName: "",
      marilynOrder: "",
      addCard: false,
      deleteModel: false,
      modal_loading: false,
      currentDelete: "",
      editState: false, // 关闭状态
      editModel: false,
      updateName: "",
      updateEnName: "",
      updateOrder: "",
      updateId: "",
      spinShow: true,
      gameUpload: "",
      marilynimg: "",
      updateImage: "",
      gameImgurl: ""
    };
  },
  mounted() {
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
      judgeName({ name: this.marilynName, type: "class" }).then(res => {
        if (res.state == 0) {
          if (this.addCard) {
            this.btnAdd = false;
            this.$Message.error("名字为空或该名字已存在");
            judgename_add.style.border = "1px solid red";
            setTimeout(() => {
              judgename_add.style.border = "1px solid #dcdee2";
            }, 2000);
          }
        }
      });
    });
    onfocus(judgename_edit, () => {
      judgename_edit.style.border = "1px solid #2d8cf0";
      this.btnEdit = true;
    });
    onblur(judgename_edit, () => {
      judgeName({
        name: this.updateName,
        type: "class",
        id: this.updateId
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

    this.gameImgurl = gameImgurl;
    this.getData();
  },
  watch: {
    $route(to, from) {},
    addCard(value) {
      this.btnAdd = true;
    },
    editModel(value){
      this.btnEdit = true;
    }
  },
  methods: {
    getData() {
      this.spinShow = true;
      classIndex().then(res => {
        if (res.state === "1") {
          this.datalist = res.msg;
          this.spinShow = false;
        }
      });
    },
    uploadSuccess(res, file) {},
    addClass() {
      if (this.marilynName.trim().length !== 0) {
        let data = new FormData();
        data.append("file", this.file);
        data.append("name", this.marilynName);
        data.append("alias", this.marilynEnName);
        data.append("order", this.marilynOrder || this.datalist.length + 1);
        const option = {
          method: "post",
          body: data
        };
        fetch(classAdd, option)
          .then(res => res.json())
          .then(resJson => {
            if (resJson.state === "1") {
              this.$Message.success(resJson.msg);
              this.getData();
              this.marilynName = "";
              this.marilynEnName = "";
              this.marilynOrder = "";
              this.addCard = false;
            } else {
              this.$Message.error(resJson.msg);
            }
          });
      } else {
        this.$Message.error("分类名称不要为空噢");
      }
    },
    toolDelete() {
      this.modal_loading = true;
      classDelete({
        id: this.currentDelete
      }).then(res => {
        this.modal_loading = false;
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
      this.modal_loading = true;
      let data = new FormData();
      if (this.currentImg) {
        data.append("file", this.currentImg);
      }
      data.append("id", this.updateId);
      data.append("name", this.updateName);
      data.append("alias", this.updateEnName);
      data.append("order", this.updateOrder);
      const option = {
        method: "post",
        body: data
      };
      fetch(classUpdate, option)
        .then(res => res.json())
        .then(resJson => {
          this.modal_loading = false;
          if (resJson.state === "1") {
            this.$Message.success(resJson.msg);
            this.updateId = "";
            this.updateName = "";
            this.updateEnName = "";
            this.updateOrder = "";
            this.getData();
            this.editModel = false;
          } else {
            this.$Message.error(resJson.msg);
          }
        });
      // classUpdate({
      //   id: this.updateId,
      //   name: this.updateName,
      //   order: this.updateOrder
      // }).then(res => {
      //   this.modal_loading = false
      //   if(res.state === "1") {
      //     this.$Message.success(res.msg)
      //     this.updateId = ""
      //     this.updateName = ""
      //     this.updateOrder = ""
      //     this.getData()
      //     this.editModel = false
      //   } else {
      //     this.$Message.error(res.msg)
      //   }
      // })
    },
    handleUpload(file) {
      var self = this;
      var reader = new FileReader(),
        img = new Image();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        self.marilynimg = e.target.result;
      };
      this.file = file;
    },
    modifyUpload(e) {
      var self = this;
      this.currentImg = e.currentTarget.files[0];
      var reader = new FileReader(),
        img = new Image();
      reader.readAsDataURL(this.currentImg);
      reader.onload = function(e) {
        document.querySelector(".curtimg").src = e.target.result;
      };
    }
  }
};
</script>

<style lang="stylus" scoped>
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
</style>


