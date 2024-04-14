User
<template>
  <div class="qr-scanner" v-if="showQRScanner" style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center;">
    <div style="text-align: center; top: 20px; position: absolute">请授予此页面摄像头权限以扫描二维码</div>
    <div style="text-align: center; position: absolute; top: 60px;">一般浏览器将会弹出个窗口，您点击同意使用摄像头即可，若无窗口弹出，还烦请自行到设置里修改权限以便此网页访问您的摄像头</div>
    <qrcode-stream @detect="onQRScanned" style="position: relative; width: 100%; display: flex; justify-content: center; align-items: center;">
      <fluent-button appearance="accent" style="position: absolute; top: 0; left: 0;" @click="scanBack">返回</fluent-button>
    </qrcode-stream>
  </div>
  <div class="container" v-show="showMainContainer">
    <div class="logo-container">
      <img src="../img/logo.jpg" alt="Logo" class="logo">
      <span class="logo-text">|&nbsp;&nbsp;&nbsp;&nbsp;{{ DashBoardText }}</span>
    </div>
    <button class="logout-btn" @click="logout">退出登录</button>
    <div class="qr-login-container">
      <img src="../img/icons8-qr-code-90.png" alt="Scan to login" class="qr-code-img" @click="handleQRClick">
    </div>
    <div class="nav-container">
      <div class="navlist" v-show="navListVisible">
        <fluent-listbox id="listbox" disabled>
          <fluent-option @click="updateNav" svalue="ac">账号信息</fluent-option>
          <fluent-option @click="updateNav" svalue="store" disabled>服务购买</fluent-option>
          <fluent-option @click="updateNav" svalue="orders" disabled>订单记录</fluent-option>
          <fluent-option @click="updateNav" svalue="decodes" disabled>解码记录</fluent-option>
          <fluent-option @click="updateNav" disabled>设备登录记录</fluent-option>
        </fluent-listbox>
      </div>
      <div class="navlist-toggle">
        <fluent-button @click="toggleNavList">{{ navListVisible ? '>' : '<' }}</fluent-button>
      </div>
    </div>
    <div class="infoshow">
      <div id="nav_ac">
        <div class="info_value">
          <div class="info_value_text">用户名：</div>
          <div class="info_value_text_value">{{ DashBoardUserData.username }}</div>
        </div>
        <div class="info_value" style="top: 150px">
          <div class="info_value_text">绑定邮箱：</div>
          <div class="info_value_text_value">{{ DashBoardUserData.email }}</div>
        </div>
        <div class="info_value" style="top: 240px">
          <div class="info_value_text">会员状态：</div>
          <div class="info_value_text_value">{{ DashBoardUserData.is_vip }}</div>
        </div>
        <div class="info_value" style="top: 330px">
          <div class="info_value_text">会员到期时间：</div>
          <div class="info_value_text_value">{{ timestampToDateStr(DashBoardUserData.viptime) }}</div>
        </div>
      </div>
      <div id="nav_store" style="display: none;">
        <div class="info_value">
          <div class="info_value_text">[会员购买] AstralPlayer会员 - 15天 ></div>
        </div>
        <div class="info_value" style="top: 150px">
          <div class="info_value_text">[会员购买] AstralPlayer会员 - 30天 ></div>
        </div>
      </div>
      <div id="nav_orders" style="display: none;">
        <div class="info_value">
          <div class="info_value_text">[普通在线支付订单] 订单 1000000917 ></div>
        </div>
      </div>
      <div id="nav_decodes" style="display: none;">
        <div class="info_value">
          <div class="info_value_text">[普通手表端解码] 解码Token 45b93c7a-207e-47ff-a02e-0dcec2e8bb96 ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as DashBoardJS from "./dashboard"
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
export default {
  data() {
    return {
      DashBoardText: "Astral Player DashBoard",
      DashBoardUserData: {},
      navListVisible: true,  // 控制navlist的显示状态
      showQRScanner: false,
      showMainContainer: true
    }
  },
  components: {
    QrcodeStream
  },
  async mounted() {
    this.DashBoardUserData = await DashBoardJS.InitDashBoardPage()
    this.adjustNavListVisibility();
  },
  methods: {
    adjustNavListVisibility() {
      // 检测屏幕宽度
      const screenWidth = window.innerWidth;
      if (screenWidth < 768) { // 假设768px为手机屏幕的最大宽度
        this.toggleNavList()
      } else {
        this.navListVisible = true; // 对于宽屏设备默认展开navlist
      }
    },
    toggleNavList() {
      this.navListVisible = !this.navListVisible;
      const navContainer = document.querySelector('.nav-container');
      const infoShow = document.querySelector('.infoshow');
      if (this.navListVisible) {
        navContainer.style.marginLeft = '10%';
        navContainer.style.width = '200px';
      } else {
        navContainer.style.marginLeft = '1%';
        navContainer.style.width = '50px'; // 只留足够的宽度来显示切换按钮
      }
    },
    updateNav() {
      setTimeout(() => {
        var selected_option = document.getElementById("listbox").getAttribute("aria-activedescendant")
        var svalue = document.getElementById(selected_option).getAttribute("svalue")
        var ac = document.getElementById("nav_ac")
        var store = document.getElementById("nav_store")
        var orders = document.getElementById("nav_orders")
        var decodes = document.getElementById("nav_decodes")
        var hide_all = () => {
          ac.style.display = "none"
          store.style.display = "none"
          orders.style.display = "none"
          decodes.style.display = "none"
        }
        switch (svalue) {
          case "ac":
            hide_all()
            ac.style.display = ""
            break;
          case "store":
            hide_all()
            store.style.display = ""
            break;
          case "orders":
            hide_all()
            orders.style.display = ""
            break;
          case "decodes":
            hide_all()
            decodes.style.display = ""
            break;
        }
      }, 100)
    },
    logout() {
      DashBoardJS.Logout()
    },
    timestampToDateStr(timestamp) {
      var date = new Date(timestamp);  // 将时间戳转换为 Date 对象
      var year = date.getFullYear();   // 获取年份
      var month = date.getMonth() + 1; // 获取月份，需要加1因为月份从0开始
      var day = date.getDate();        // 获取日

      // 保证月份和日期始终为两位数
      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;

      if (timestamp == 0) {
        return "不可用"
      }

      return year + '-' + month + '-' + day; // 拼接字符串
    },

    handleQRClick() {
      this.showMainContainer = false
      this.showQRScanner = true
    },

    scanBack() {
      this.showMainContainer = true
      this.showQRScanner = false
    },

    async onQRScanned(detectedCodes){
      console.log(detectedCodes)
      if (detectedCodes.length > 1){
        DashBoardJS.notyf.error("请确保画面中只存在一个二维码，并重新扫描")
      }
      else if(detectedCodes.length < 1){
        DashBoardJS.notyf.error("二维码扫描组件数据异常，可能是您的设备并不支持通过网页扫描二维码")
      }
      else{
        if(detectedCodes[0].rawValue != undefined && detectedCodes[0].rawValue != null){
          if(detectedCodes[0].rawValue.toString().includes("AstralPlayerQuickApp_")){
            if(await DashBoardJS.ScanQRLogin(detectedCodes[0].rawValue.toString())){
              this.scanBack()
            }
          }
          else{
            DashBoardJS.notyf.error("此二维码不是有效的AstralPlayer登录二维码")
          }
        }
        else{
          DashBoardJS.notyf.error("无法读取二维码数据")
        }
      }
    }
  }
}
</script>
<style scoped>
/* 现有的样式 */

/* 媒体查询针对小屏幕设备 */
@media (max-width: 450px) {
  .logo-text {
    font-size: 14px; /* 减小字体大小 */
  }

  .logout-btn {
    font-size: 12px; /* 减小按钮文本大小 */
    padding: 6px 12px; /* 调整按钮内边距 */
  }

  .navlist {
    width: 150px; /* 调整导航列表宽度 */
  }

  .info_value_text {
    font-size: 14px; /* 减小信息文本大小 */
  }

  .info_value_text_value {
    font-size: 14px; /* 减小值文本大小 */
  }
}
</style>
<style scoped>
@import "../css/global.css";

.container {
  display: flex;
  /* 使用 Flexbox 布局 */
  min-height: 100vh;
  align-items: center;
  overflow: hidden;
}

.logo-container {
  position: absolute;
  /* 使用绝对定位 */
  top: 0;
  /* 距离顶部 0 */
  left: 0;
  /* 距离左侧 0 */
  display: flex;
  /* 使用 Flexbox 布局 */
  align-items: center;
  /* 垂直居中对齐 */
  margin-left: 2%;
  margin-top: 2%;
  font-family: 'MiSans';
  font-weight: 600;
  font-size: 18px;
}

.logo {
  width: 50px;
  /* Logo 的宽度 */
  height: auto;
  /* 自动调整高度以保持比例 */
}

.logo-text {
  margin-left: 20px;
  /* 在 Logo 和文字之间添加一些间距 */
}

.navlist {
  flex: 0 0 auto;
  /* 不允许 navlist 伸缩 */
  width: 200px;
  /* 根据需要设置宽度 */
  align-items: center;
  margin-left: 10%;
}

.infoshow {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(240, 240, 240);
  margin-right: 10%;
  max-height: 80vh;
  min-height: 80vh;
  border-radius: 20px;
}

.info_value {
  position: absolute;
  display: grid;
  background-color: rgb(224, 224, 224);
  align-items: center;
  width: 90%;
  height: 60px;
  top: 60px;
  /* 添加这行来定位到顶部 */
  left: 5%;
  /* 添加这行来定位到左侧 */
  border-radius: 20px;
  font-family: 'MiSans';
  display: flex;
}

.info_value_text {
  position: relative;
  margin-left: 25px;
}

.info_value_text_value {
  position: relative;
}

.logout-btn:hover {
  background-color: rgb(255, 0, 0);
  border: 1.5px solid rgb(255, 0, 0);
  color: white;
}

.container {
  display: flex;
  /* 使用 Flexbox 布局 */
  min-height: 100vh;
  align-items: center;
  justify-content: space-between;
  /* 确保组件间隔开 */
}

.nav-container {
  flex-shrink: 0;
  /* 防止nav-container缩小 */
  transition: margin-left 0.3s ease;
  /* 平滑过渡margin-left变化 */
  margin-left: 10%;
  /* 初始外边距 */
}

.navlist-toggle {
  margin-left: 10%
}

.infoshow {
  flex: 1;
  /* 使infoshow填充剩余空间 */
  transition: margin 0.3s ease;
  /* 平滑过渡边距变化 */
  margin-right: 10%;
  /* 初始右边距 */
}

.logout-btn {
  position: absolute;
  top: 2%;
  right: 2%;
  background-color: transparent;
  color: black;
  border: 1.5px solid black;
  border-radius: 10px;
  padding: 8px 16px;
  font-family: 'MiSans';
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.qr-login-container {
  position: absolute;
  top: 7%; /* 调整这里的值以确保在“退出登录”按钮下方 */
  right: 2%;
}

.qr-code-img {
  width: 35px; /* 调整为合适的大小 */
  cursor: pointer; /* 添加鼠标指针效果 */
}

</style>