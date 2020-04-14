<template>
    <div class="root-container">
        <header-nav></header-nav>
        <div class="main-content">
            <router-view v-if="!isHomePage"></router-view>
            <home-page v-if="isHomePage"></home-page>
        </div>
        <footer-info></footer-info>
    </div>
</template>

<script>

    export default {
        data() {
          return {

          }
        },
        computed: {
            isHomePage() {
                const { path } = this.$route;
                return path === '/';
            }
        }
    }
</script>

<style scope lang="scss">
    .root-container {
        height: 100%;
        .main-content {
            padding: 60px 0;
            margin: -60px 0;
            min-height: 100%;
        }
    }
</style>