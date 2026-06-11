<template>
  <aside>
    创建和编辑页面无法被 keep-alive 缓存，因为 keep-alive 的 include 目前不支持根据路由缓存，
    所以当前是基于组件名称来缓存的。如果想要实现类似的缓存效果，可以使用 localStorage 等浏览器缓存方案，
    或者不使用 keep-alive include 直接缓存所有页面。详见
    <a
      href="https://panjiachen.github.io/vue-element-admin-site/guide/essentials/tags-view.html"
      target="_blank"
    >文档</a>
  </aside>
</template>

