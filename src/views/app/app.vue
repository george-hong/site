<template>
    <div class="root-container">
        <header-nav></header-nav>
        <div :class="{'main-content': true, 'show-footer': isShowFooter }">
            <router-view v-if="!isHomePage" />
            <home-page v-if="isHomePage" />
        </div>
        <footer-info v-show="isShowFooter" />
    </div>
</template>

<script>
    import { stateNameSpace } from '@nameSpace/storeNameSpace';

    export default {
        data() {
          return {

          }
        },
        computed: {
            isHomePage() {
                const { path } = this.$route;
                return path === '/';
            },
            isShowFooter() {
                return this.$store.state[stateNameSpace.isShowFooter];
            }
        }
    }
</script>

<style scope lang="scss">
    .root-container {
        height: 100%;
        .main-content {
            padding: 60px 0 0;
            min-height: 100%;
            &.show-footer {
                padding: 60px 0 60px;
                margin-bottom: -60px;
            }
        }
    }
</style>