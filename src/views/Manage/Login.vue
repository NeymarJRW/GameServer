<template>
<div class="content" ref="content">

  <div class="main">
    <p>cicigirl后台</p>

   <Form ref="formItem" :model="formItem" :rules="formItem" >
        <FormItem prop="name">
            <Col span="24">
            <Input  type="text"  v-model="formItem.name" @keyup.enter.native='handleSubmit()' placeholder="请输入账号">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
             </Col>
        </FormItem>
        <FormItem prop="password">
          <Col span="24">
            <Input  type="password"  v-model="formItem.password" @keyup.enter.native='handleSubmit()'  placeholder="请输入密码">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>

            </Input>
          </Col>
        </FormItem>
        <FormItem prop="Code">
            <Col span="14">
                <Input  type="text" v-model="formItem.code" @keyup.enter.native='handleSubmit()' placeholder="请输入验证码">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
               </Input>
            </Col>

            <Col span="2" offset="1">
                <img ref="imgs" :src="yanzhengcode" alt="" @click="refresh">
            </Col>
        </FormItem>
        <FormItem style="text-align:center">
          <Button  long type="primary" @click='handleSubmit'>登录</Button>
        </FormItem>
    </Form>

  </div>

</div>

</template>
<script>
import { login , judgeLogin,yanzhengcode,onfocus} from '@/api/index'
export default {
        data () {
            return {
              yanzhengPic:'',
                formItem: {
                    name: '',
                    password: '',
                    code:''
                },
                yanzhengcode:''
            }
        },
        methods: {
            refresh(){
           this.$refs.imgs.src=this.yanzhengcode
            },
            handleSubmit() {
              localStorage.setItem('loginName',this.formItem.name);
              var that=this;
               login(this.formItem).then(res=>{
                if(res.state==1){
                  this.$Message.success('登录成功');
                  setTimeout(function(){
                    that.$router.push({name:'marilyn'})
                  },700)
                }else{
                  this.$Message.error('登录失败');
                  this.formItem.code=''
                  this.$refs.imgs.src=this.yanzhengcode
                }
              })
            },
        },
        mounted(){
          this.$router.push({path:'/recomGame'})

          // this.yanzhengcode=yanzhengcode;
          // judgeLogin().then(res=>{
          //   if(res.state==1){
          //       this.$router.push({name:'marilyn'})
          //   }
          // })
        }
    }
</script>
<style lang="stylus" scoped>
.content{
  height 100%
  width 100%
  background #293038
  display flex
  justify-content center
  align-items center
}
.content .main{
  padding 3%
  background #293038
  transform translate(0,0)
}
.content .main p{
  color #fff
  text-align center
  font-size: 25px;
  padding-bottom: 10px;
}
.huoqu{
  padding 40px

}
</style>



