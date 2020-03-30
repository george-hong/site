<template>
    <div class="root-container">
        <header-nav></header-nav>
        <router-view></router-view>
        <router-link to="/article/list">写作</router-link>
    </div>
</template>

<script>
    export default {
        data() {
          return {

          }
        },
    }
</script>

<style scoped lang="scss">
    .root-container {

    }
</style>