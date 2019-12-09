<template>
  <div id="app">
    <div class="top">
      <p>cicigirl后台</p>
      <ul>
        <li>欢迎你:{{loginName}}</li>
        <li @click="password = true;">修改密码</li>
        <li @click="loginout">退出登录</li>
        <li>
          <Button type="primary" style="width:100px" @click="clear = true ,clear_value =[]">清空缓存</Button>
        </li>
      </ul>
    </div>
    <Modal v-model="clear" width="480" height="600" style="width:400px">
      <p slot="header" style="color:#2d8cf0;text-align:center">
        <span>清空客服端缓存</span>
      </p>
      <Select v-model="clear_value">
        <Option v-for="(item,index) in clearcon" :value="item.value" :key="index">{{item.content}}</Option>
      </Select>
      <div slot="footer">
        <Button
          v-if="clear_value.length !== 0"
          ref="btn_edit"
          class="btn_edit"
          type="primary"
          size="large"
          style="display: block;"
          long
          :loading="modal_loading"
          @click="clearbtn"
        >确认</Button>
      </div>
    </Modal>
    <Modal v-model="password" footer-hide>
      <Card>
        <div class="change">
          <span>
            <i style="color:red">*</i> 旧密码:
          </span>
          <i-input
            v-model="oldWord"
            type="password"
            class="inp"
            icon="ios-clock-outline"
            placeholder="请输入..."
            @keyup.enter.native='changePassword'
          ></i-input>
          <span>
            <i style="color:red">*</i> 新密码:
          </span>
          <i-input
            v-model="newWord"
            type="password"
            class="inp"
            icon="ios-clock-outline"
            placeholder="请输入..."
            @keyup.enter.native='changePassword'
          ></i-input>
          <span>
            <i style="color:red">*</i> 确认密码:
          </span>
          <i-input
            v-model="sureWord"
            type="password"
            class="inp"
            icon="ios-clock-outline"
            placeholder="请输入..."
            @keyup.enter.native='changePassword'
          ></i-input>
          <i-button class="btn" type="primary" style="width:21%" @click="changePassword">修改</i-button>
          <i-button class="btn" style="width:21%" @click="oldWord='',newWord='',sureWord=''">重置</i-button>
        </div>
      </Card>
    </Modal>
    <Menu theme="dark" accordion class="menu" @on-select="route" :open-names="['1']" v-if="isPc">
      <Submenu name="1">
        <template slot="title">
          <i class="fas fa-tasks"></i>
          管理区
        </template>
        <MenuItem v-for="item in tasks" :name="item.path" :key="item.title">
          <i :class="item.icon"></i>
          {{item.title}}
        </MenuItem>
      </Submenu>
    </Menu>
    <main class="main" ref="main" style="background:#f0f2f5;">
      <router-view/>
    </main>
  </div>
</template>

<script>
import device from "@/util/device";
import { loginOut, clear,changeWord } from "@/api/index";
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      oldWord: "",
      newWord: "",
      sureWord: "",
      clear: false,
      modal_loading: false,
      clear_value: [],
      clearcon: [
        {
          value: "index",
          content: "首页缓存"
        },
        {
          value: "recommend",
          content: "游戏推荐"
        },
        {
          value: "news",
          content: "最新界面"
        },
        {
          value: "hot",
          content: "最热界面"
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
      ],
      loginName: "",
      tasks: [
        {
          title: "分类管理",
          icon: "fas fa-shopping-bag",
          path: "/marilyn"
        },
        {
          title: "标签管理",
          icon: "fas fa-shopping-bag",
          path: "/tag"
        },
        {
          title: "游戏管理",
          icon: "fas fa-shopping-bag",
          path: "/games"
        },
        {
          title: "待处理游戏",
          icon: "fas fa-shopping-bag",
          path: "/Pending"
        }
      ],
      isPc: true,
      password: false
    };
  },

  mounted() {},
  methods: {
    clearbtn() {
      clear({ key: this.clear_value }).then(res => {
        if(this.newWord){
          alert('4444')
        }
        // console.log(this.clear_value)
        if (res.state == 1) {
          this.$message({
            message: res.msg,
            type: "success"
          });
        } else {
          this.$message.error(res.msg);
        }
      });
      this.clear = false;
    },
    route(i) {
      this.$router.push({ path: i });
    },
    loginout() {
      loginOut().then(res => {
        this.$router.push({ name: "login" });
        // localStorage.setItem("isLogin", "0");
      });
    },
    changePassword() {
        var word={
          password:this.oldWord,
          passwordNew:this.newWord,
        }
      if(!this.oldWord|| !this.newWord || !this.sureWord){
          this.$message.error('不能为空')
      }else if(this.newWord!==this.sureWord){
          this.$message.error('两次新密码输入不同')
      }else if(this.oldWord == this.newWord){
          this.$message.error('新密码不能与旧密码相同')
      }else{
        changeWord(word).then(res=>{
          if(res.state==0){
            this.$message.error(res.msg)
          }else{
            this.$message.success('修改成功')
          }
        })
      }
    }
  },
  mounted() {
    this.loginName = localStorage.getItem("loginName");
  }
};
</script>

<style>
.change {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.change .inp {
  width: 80%;
  margin: 10px 5px;
}
.change .btn {
  width: 40%;
  margin-top: 10px;
  margin-right: 10px;
}
.change span {
  width: 15%;
  font-size: 13px;
}
.top {
  width: 100%;
  height: 2.666667rem /* 100/37.5 */ /* 50/37.5 */;
  background: #001529;
  position: absolute;
  top: 0;
  z-index: 999;
}
.top p {
  display: inline;
  height: 2.666667rem;
  line-height: 2.666667rem;
  padding-left: 30px;
  color: #fff;
  font-size: 22px;
}
.top ul {
  float: right;
  padding-right: 1.333333rem; /* 50/37.5 */
}
.top ul li {
  color: white;
  float: left;
  line-height: 2.666667rem /* 100/37.5 */;
  padding: 0 0.533333rem; /* 20/37.5 */
}
.top ul li:hover {
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
}

.main {
  padding-top: 2.666667rem; /* 100/37.5 */
}
.marilyn_des::-webkit-scrollbar {
  width: 0;
  display: none;
}
/* 自定义字号 */
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
  content: "12px";
  font-size: 12px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
  content: "14px";
  font-size: 14px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
  content: "16px";
  font-size: 16px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
  content: "18px";
  font-size: 18px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
  content: "20px";
  font-size: 20px;
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="22px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="22px"]::before {
  content: "22px";
  font-size: 22px;
}

/* 自定义字体 */
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimSun"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimSun"]::before {
  content: "宋体";
  font-family: "SimSun";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimHei"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimHei"]::before {
  content: "黑体";
  font-family: "SimHei";
}

.ql-snow
  .ql-picker.ql-font
  .ql-picker-label[data-value="Microsoft-YaHei"]::before,
.ql-snow
  .ql-picker.ql-font
  .ql-picker-item[data-value="Microsoft-YaHei"]::before {
  content: "微软雅黑";
  font-family: "Microsoft YaHei";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="KaiTi"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="KaiTi"]::before {
  content: "楷体";
  font-family: "KaiTi";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="FangSong"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="FangSong"]::before {
  content: "仿宋";
  font-family: "FangSong";
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="Arial"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="Arial"]::before {
  content: "Arial";
  font-family: "Arial";
}

.ql-font-SimSun {
  font-family: "SimSun";
}

.ql-font-SimHei {
  font-family: "SimHei";
}

.ql-font-Microsoft-YaHei {
  font-family: "Microsoft YaHei";
}

.ql-font-KaiTi {
  font-family: "KaiTi";
}

.ql-font-FangSong {
  font-family: "FangSong";
}

.ql-font-Arial {
  font-family: "Arial";
}

.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title {
  background: #001529 !important;
}

.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item {
  background: #000c18;
}
</style>

<style lang="stylus">
* {
  margin: 0;
  padding: 0;
  list-style: none;
  font-style: none;
  text-decoration: none;
  box-sizing: border-box;
  cursor: default;
}

html, body, #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  height: 100%;
  width: 100%;
  font-size: inherit !important;
}

input, textarea {
  border: none;
  background: rgba(0, 0, 0, 0);
}

textarea {
  resize: none !important;
  overflow: hidden !important;
}

input:focus, textarea:focus, button:focus {
  outline: none;
}

.noselect {
  user-select: none;
}

#app {
  display: flex;
}

.menu {
  height: 100%;
  background: #001529 !important;
  user-select: none;
  padding-top: 2.666667rem /* 100/37.5 */ !important;
}

main {
  width: calc(100% - 240px);
  overflow-y: scroll;
}

.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}

// 针对一些公共样式的整体修改
.container {
  position: relative;
}

.core {
  position: absolute;
  height: 100%;
  width: 100%;
  background: #f0f2f5;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.marilyn_tab {
  display: flex;
  flex-wrap: wrap;
}

.marilyn_card {
  width: 320px;
  margin: 4px;
}

.marilyn_name {
  margin-top: 10px;
}

.marilyn_upload {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.marilyn_margin {
  margin-top: 10px;
}

.marilyn_tools {
  display: flex;
  justify-content: space-between;
}

.marilyn_img {
  height: 100px;
  width: 100px;
}

.marilyn_des {
  text-align: left;
  white-space: nowrap;
  overflow-y: scroll;
  margin: 4px 0;
}

.marilyn_up_card {
  .ivu-upload {
    display: flex;
    justify-content: center;
  }
}

.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
}
</style>


