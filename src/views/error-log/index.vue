<template>
  <div class="errPage-container">
    <ErrorA />
    <ErrorB />
    <h3>请点击右上角的 bug 图标查看错误日志</h3>
    <aside>
      现在管理系统基本都是 SPA 形式，它增强了用户体验，但也增加了页面出现问题的可能性，一个小小的疏忽都可能导致整个页面崩溃。幸运的是 Vue 提供了捕获异常的方式，可以在这里处理错误或上报异常。
      <a target="_blank" class="link-type" href="https://panjiachen.github.io/vue-element-admin-site/guide/advanced/error.html">
        相关文档
      </a>
    </aside>
    <a href="#">
      <img src="https://wpimg.wallstcn.com/360e4842-4db5-42d0-b078-f9a84a825546.gif">
    </a>
  </div>
</template>

<script>
import ErrorA from './components/ErrorTestA'
import ErrorB from './components/ErrorTestB'

export default {
  name: 'ErrorLog',
  components: { ErrorA, ErrorB }
}
</script>

<style scoped>
  .errPage-container {
    padding: 30px;
  }
</style>
