<template>
    <div class="header-nav">
        <el-menu
            class="w"
            mode="horizontal"
        >
            <el-menu-item index="1">主页</el-menu-item>
            <el-menu-item
                index="/login"
                class="fr"
            >
                <el-button
                    type="text"
                    @click="login"
                >
                    注册/登录
                </el-button>
                <login :visible="isShowLoginWindow"></login>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    import { commitNames } from '@storeFields';

    export default {
        name: 'header-nav',
        data() {
            return {

            }
        },
        methods: {
            login() {
                this.$store.commit(commitNames.toggleShowLoginWindow, { visible: true, onSuccess() { console.log('login ok'); }, onFail() { console.log('login fail') } });
            }
        },
        mounted() {

        },
        computed: {
            isShowLoginWindow() {
                return this.$store.state.isShowLoginWindow;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header-nav {
        height: 60px;
        border-bottom: 1px solid #e6e6e6;
        overflow: hidden;
        .el-menu--horizontal {
            border-bottom: 0;
        }
    }
</style>