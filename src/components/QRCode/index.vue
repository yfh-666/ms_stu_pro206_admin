<template>
    <div style="height: 100%;" :id="id" :ref="id" class='qrCode'></div>
  </template>
  <script>
  import QRCode from 'qrcodejs2'
  export default {
    name:'qrCode',
    data() {
      return {
        qrcode: ''
      }
    },
    props: {
      id: {
        type: String,
        required: true
      },
      text: {  // 后端返回的二维码地址
        type: [String,Number,Array],
        default: process.env.VUE_APP_BASE_API+'/login'
      },
      width: {
        type: String,
        default: '128'
      },
      height: {
        type: String,
        default: '128'
      },
      colorDark: {
        type: String,
        default: '#000000'
      },
      colorLight: {
        type: String,
        default: '#ffffff'
      }
    },
    watch: {
      text(newText) {
        this.createQrcode()
      }
    },
    mounted() {
      this.createQrcode()
    },
    methods: {
      createQrcode() {
        if(this.qrcode) {  // 有新的二维码地址了，先把之前的清除掉
          this.$refs[this.id].innerHTML = ''
        }
        this.qrcode = new QRCode(this.$refs[this.id], {
          text: this.text, //页面地址 ,如果页面需要参数传递请注意哈希模式#
          width: this.width, // 二维码宽度 （不支持100%）
          height: this.height, // 二维码高度 （不支持100%）
          colorDark: this.colorDark,
          colorLight: this.colorLight,
          correctLevel: QRCode.CorrectLevel.H,
        })
      },
      
    }
  }
  </script>
  