<template>
  <div class="w home-page">
    <article-list once></article-list>
    <router-link to="/article/edit">写文章</router-link>
    <router-link to="/system/dictionaryManage">字典</router-link>
  </div>
</template>

<script>
  import request from '@request';

  export default {
    name: 'home-page',
    methods: {
      getInfo() {
        request.testRequest().then(result => {
          console.log('test result');
          console.log(result);
        })
        .catch(err => {
          console.log('test err');
          console.log(err)
        })
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>