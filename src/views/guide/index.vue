<template>
  <div class="app-container">
    <aside>
      引导页对第一次进入项目的人很有用，可以简单介绍项目的各项功能。本示例基于
      <a href="https://github.com/kamranahmedse/driver.js" target="_blank">driver.js</a>
    </aside>
    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">
      打开引导
    </el-button>
  </div>
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'

export default {
  name: 'Guide',
  data() {
    return {
      driver: null
    }
  },
  mounted() {
    this.driver = new Driver({
      doneBtnText: '完成',
      closeBtnText: '关闭',
      nextBtnText: '下一步',
      prevBtnText: '上一步',
      onHighlighted: () => {
        // 引导期间导航栏不能裁切高亮元素，且需要提升层级
        const navbar = document.querySelector('.navbar')
        if (navbar) {
          navbar.style.overflow = 'visible'
          navbar.style.zIndex = '100005'
        }
      },
      onReset: () => {
        // 引导结束后恢复导航栏
        const navbar = document.querySelector('.navbar')
        if (navbar) {
          navbar.style.overflow = 'hidden'
          navbar.style.zIndex = ''
        }
      }
    })
  },
  methods: {
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    }
  }
}
</script>
