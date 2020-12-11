<template>
  <div class="w home-page">
    <article-list once></article-list>
  </div>
</template>

<script>
  import request from '@request';

  export default {
    name: 'home-page',
    methods: {
      getInfo() {
        request.testRequest().then(result => {

        })
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>