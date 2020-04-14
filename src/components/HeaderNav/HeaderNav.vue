<template>
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
                <login :visible="isShowLoginWindow"></login>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    import { commitNames } from '@storeFields';
    import { mapState } from 'vuex';

    export default {
        name: 'header-nav',
        data() {
            return {

            }
        },
        methods: {
            login() {
                const instance = this;
                this.$store.commit(commitNames.toggleShowLoginWindow, {
                    visible: true,
                    onSuccess() { instance.checkUserInfo(); },
                    onFail() { console.log('login fail') } 
                });
            },
            loginout() {
                localStorage.removeItem('userInfo');
                localStorage.removeItem('token');
                this.$store.commit(commitNames.saveUserInfo, null);
            },
            goRouter(path) {
                this.$router.push(path);
            },
            checkUserInfo() {
                const localUserInfo = localStorage.getItem('userInfo');
                try {
                    const userInfo = JSON.parse(localUserInfo);
                    this.$store.commit(commitNames.saveUserInfo, userInfo);
                } catch (err) {
                    // 读取本地用户信息异常,不进行操作
                };
            }
        },
        mounted() {
            this.checkUserInfo();
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
        height: 60px;
        border-bottom: 1px solid #e6e6e6;
        overflow: hidden;
        .el-menu--horizontal {
            border-bottom: 0;
        }
    }
</style>