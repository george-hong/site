<template>
    <div class="head-nav-box">
        <div class="header-nav">
            <el-menu
                class="w"
                mode="horizontal"
            >
                <el-menu-item
                    index="/"
                    @click="goRouter('/')"
                >
                    主页
                </el-menu-item>
                <el-menu-item
                    index="/login"
                    class="fr"
                >
                    <el-button
                        v-if="!userInfo"
                        type="text"
                        @click="login"
                    >
                        注册/登录
                    </el-button>
                    <span
                        v-else
                        @click="loginout"
                    >
                        {{userInfo.userName}}
                    </span>
                </el-menu-item>
            </el-menu>
        </div>
        <login :visible="isShowLoginWindow"></login>
    </div>
</template>

<script>
    import { commitNameSpace } from '@nameSpace/storeNameSpace';
    import { mapState } from 'vuex';
    import storageNameSpace from '@nameSpace/storageNameSpace';

    export default {
        name: 'header-nav',
        data() {
            return {

            }
        },
        methods: {
            login() {
                const instance = this;
                this.$store.commit(commitNameSpace.toggleShowLoginWindow, {
                    visible: true,
                    onSuccess() { instance.tryGetUserInfoFromLocalStorage(); },
                    onFail() { console.log('login fail') } 
                });
            },
            loginout() {
                localStorage.removeItem(storageNameSpace.userInfo);
                localStorage.removeItem(storageNameSpace.tokenInfo);
                this.$store.commit(commitNameSpace.saveUserInfo, null);
            },
            goRouter(path) {
                console.log(this.$route.path);
                const { path: currentPath } = this.$route;
                // 只有路径改变时才跳转
                if (currentPath !== path) {
                    this.$router.push(path);
                }
            },
            tryGetUserInfoFromLocalStorage() {
                const localUserInfo = localStorage.getItem(storageNameSpace.userInfo);
                const tokenExpiresTime = parseInt(localStorage.getItem(storageNameSpace.tokenExpiresTime));
                // 如果token已过期，删除用户信息
                if (tokenExpiresTime < Date.now()) {
                    localStorage.removeItem(storageNameSpace.userInfo);
                    localStorage.removeItem(storageNameSpace.token);
                    localStorage.removeItem(storageNameSpace.tokenExpiresTime);
                    return; //
                }
                try {
                    const userInfo = JSON.parse(localUserInfo);
                    this.$store.commit(commitNameSpace.saveUserInfo, userInfo);
                } catch (err) {
                    // 读取本地用户信息异常,不进行操作
                };
            }
        },
        mounted() {
            this.tryGetUserInfoFromLocalStorage();
        },
        computed: {
            isShowLoginWindow() {
                return this.$store.state.isShowLoginWindow;
            },
            ...mapState(['userInfo'])
        }
    }
</script>

<style lang="scss" scoped>
    .header-nav {
        width: 100%;
        height: 60px;
        border-bottom: 1px solid #e6e6e6;
        overflow: hidden;
        position: fixed;
        top: 0;
        left: 0;
        background: #FFF;
        z-index: 9;
        .el-menu--horizontal {
            border-bottom: 0;
        }
        .w {
            padding: 0;
        }
    }
</style>