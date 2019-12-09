<template>
  <div class="container">
    <Spin size="large" fix v-if="spinShow"></Spin>
    <div class="marilyn_tab">
      <Card class="marilyn_card marilyn_upload">
        <div class="add_game_view" @click="addCard = true">
          <img src="../../images/add.png" style="height:150px;width:150px">
          <span style="display:block;text-align:center">添加标签</span>
        </div>
       
      </Card>
      <Card class="marilyn_card" v-for="i in datalist">
        <div style="text-align:center">
          <h3 class="marilyn_name">{{i.name}}</h3>
          <img :src="gameImgurl + i.image" alt="" width="60">
          <p class="marilyn_num">英文名: {{i.alias}}</p>
          <p class="marilyn_num">游戏数量: {{i.num}}</p>
        </div>
        <div class="marilyn_tools">
          <i 
            class="fas fa-trash-alt" style="cursor:pointer;color:#ed4014" 
            @click="currentDelete = i.id; deleteModel = !deleteModel"
          ></i>
          <i 
            class="far fa-edit" style="cursor:pointer"
            @click="updateId = i.id; updateName = i.name;updateEnName = i.alias;updateImg=i.image; editModel = !editModel"
          ></i>
        </div>
      </Card>
    </div>

    <Modal v-model="addCard" width="300"  footer-hide  >
       <div class="marilyn_margin" style="text-align:center">
          <Upload 
            multiple type="drag" :action="gameUpload" name="file" 
            :on-success="uploadSuccess" :show-upload-list="false"
            :format="['jpg','jpeg','png','gif']"
            :before-upload="handleUpload"
          >
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>单击或拖动图片到此处上传</p>
            </div>
            <img :src="marilynNewImg" class="upload_image" alt="" >
          </Upload>
          <Input
            class='judgename_add'
            prefix="ios-game-controller-b" placeholder="中文标签名字 ..." style="width: auto;margin-top:15px;"
            v-model="marilynName"
          />
          <Input
            prefix="ios-game-controller-b-outline" placeholder="英文标签名字 ..." style="width: auto;margin-top:15px;"
            v-model="marilynEnName"
          />
        </div>
        <Button v-show="btnAdd" ref="btn_add" type="primary" long  class="marilyn_margin" @click="addClass">添加</Button>
        <Button  v-show="!btnAdd" disabled ref="btn_add" type="primary" long  class="marilyn_margin" @click="addClass">添加</Button>
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
        <Button type="error" size="large" long :loading="modal_loading" @click="toolDelete">
          删除
        </Button>
      </div>
    </Modal>
    <Modal v-model="editModel" width="360">
      <p slot="header" style="color:#2d8cf0;text-align:center">
        <span>修改</span>
      </p>
      <div style="text-align:center">
        <div style="position:relative;height:164px;width:100%">
          <input   type="file" class="inputfile" name="file" @change="modifyUpload" id="fileImg">
          <!-- <img :src="gameImgurl + currentEdit.thumbnail" alt="" class="curtimg"> -->
          <img :src="gameImgurl+updateImg" alt="" width="60" class="curtimg">
        </div>        
        <div>
          中文名字 : 
          <Input
          class='judgename_edit'
            prefix="ios-game-controller-b" placeholder="分类名字 ..." style="width:auto;margin:10px 0"
            v-model="updateName"
          />
        </div>
        <div>
          英文名字 : 
          <Input
             prefix="ios-game-controller-b-outline" placeholder="分类名字 ..." style="width:auto;margin:10px 0"
            v-model="updateEnName"
          />
        </div>
      </div>
      <div slot="footer">
        <Button  v-show="btnEdit" ref="btn_edit" type="primary" size="large" long :loading="modal_loading" @click="toolEdit">
          确认
        </Button>
        <Button v-show="!btnEdit" disabled ref="btn_edit" type="primary" size="large" long :loading="modal_loading" @click="toolEdit">
          确认
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { labelIndex, labelDelete, gameLabeladd, gameLabelupate ,gameUpload, gameImgurl,onfocus,onblur,judgeName} from '@/api/index'
export default {
  data() {
    return {
       btnAdd: true,
      btnEdit: true,
      datalist: [],
      marilynName: "",
      marilynEnName: "",
      currentDelete: "",
      addCard:false,
      deleteModel: false,
      editModel: false,
      modal_loading: false,
      updateId: "",
      updateName: "",
      updateEnName:"",
      updateImg:"",
      spinShow: true,
      currentImg:null,
      gameUpload: "",
      marilynNewImg:'',
      file:'',
      gameImgurl:''

    }
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
      judgeName({ name: this.marilynName, type: "label" }).then(res => {
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
        type: "label",
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


    this.gameImgurl=gameImgurl;
    this.getData()
  },
  watch:{
     addCard(value) {
      this.btnAdd = true;
    },
    editModel(value){
      this.btnEdit = true;
    }
  },
  methods: {
    getData() {
      this.spinShow = true
      labelIndex().then(res => {
        if(res.state === "1"){
          // console.log(res.msg)
          this.datalist = res.msg
          this.spinShow = false
        }
      })
    },
    addClass() {
      if(this.marilynName.trim().length !== 0) {
        let data=new FormData();
        data.append('name',this.marilynName),
        data.append('alias',this.marilynEnName),
        data.append('file',this.file)
        const option={
          method:'post',
          body:data
        }
        fetch(gameLabeladd,option)
        .then(res=>res.json())
        .then(resJson=>{
          if(resJson.state === "1") {
            this.$Message.success(resJson.msg)
            this.file = ""
            this.marilynName = ""
            this.addCard=false
            this.getData()
          } else {
            this.$Message.error(resJson.msg)
          }
          })
        }
    },
    toolDelete() {
      labelDelete({
        id: this.currentDelete
      }).then(res => {
        if(res.state === "1") {
          this.deleteModel = false
          this.$Message.success(res.msg)
          this.getData()
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    toolEdit() {
    let data=new FormData()
    if(this.currentImg){
      data.append('file',this.currentImg)
    }
    data.append('id',this.updateId)
    data.append('name',this.updateName)
    data.append('alias',this.updateEnName)
      const option = {
        method: 'post',
        body: data
      }
      fetch(gameLabelupate,option)
      .then(res=>res.json())
      .then(resJson=>{
        if(resJson.state === "1") {
          this.editModel = false
          this.$Message.success(resJson.msg)
          this.getData()
        } else {
          this.$Message.error(resJson.msg)
        }
      })
    },
    handleUpload(file) {
      var self = this
      var reader = new FileReader(), img = new Image()
      reader.readAsDataURL(file)
      reader.onload = function(e) {
        self.marilynNewImg = e.target.result
      }
      this.file = file
    },
    uploadSuccess(res, file) {
    },
    modifyUpload(e) {
      var self = this
      this.currentImg = e.currentTarget.files[0]
      var reader = new FileReader(), img = new Image()
      reader.readAsDataURL(this.currentImg)
      reader.onload = function(e) {
        // self.marilynAddImg = e.target.result
        document.querySelector('.curtimg').src = e.target.result
      }
    },
  }
}
</script>

<style lang="stylus" scoped>
.inputfile
  height 164px
  width 164px
  position absolute
  top 0
  opacity 0
.curtimg
  height 164px
  width 164px
.upload_image
  position absolute
  top 0
  left 50%
  transform translate(-50%,0)
  height 100%

.marilyn_margin{
  display:flex
  justify-content center
  align-items center
  flex-direction column
 
}
</style>

