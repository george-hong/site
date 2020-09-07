<template>
    <div class="head-nav-box">
        <div class="header-nav">
            <ul class="w menu-list">
                <li>
                    <router-link to="/">主页</router-link>
                </li>
                <li
                    index="/login"
                    class="fr"
                >
                    <div :class="['search-area', 'background-gray', isSearchAreaActive ? 'active' : '']">
                        <input
                            @focus="focusSearchArea"
                            @blur="blurSearchArea"
                            @keyup.enter="onSearch"
                            v-model="searchValue"
                            type="text"
                            placeholder="搜索文章"
                        />
                        <i
                            class="el-icon-search"
                            @click="onSearch"
                        />
                    </div>
                    <el-button
                      v-if="!userInfo"
                      type="text"
                      @click="goSign"
                    >
                        注册
                    </el-button>
                    <el-button
                        v-if="!userInfo"
                        type="text"
                        @click="login"
                    >
                        登录
                    </el-button>
                    <span
                        v-else
                        @click="logout"
                    >
                        {{userInfo.userName}}
                    </span>
                </li>
            </ul>
        </div>
        <login :visible="isShowLoginWindow"></login>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { commitNameSpace } from '@nameSpace/storeNameSpace';
    import storageNameSpace from '@nameSpace/storageNameSpace';

    export default {
        name: 'header-nav',
        data() {
            return {
                searchValue: '',
                isSearchAreaActive: false,
            }
        },
        methods: {
            // 搜索框获取焦点
            focusSearchArea() {
                this.isSearchAreaActive = true;
            },
            // 搜索框失去焦点
            blurSearchArea() {
                this.isSearchAreaActive = false;
            },
            // 跳转登录页
            goSign() {
                this.$router.push('/sign');
            },
            // 登录
            login() {
                const instance = this;
                this.$store.commit(commitNameSpace.toggleShowLoginWindow, {
                    visible: true,
                    onSuccess() { instance.tryGetUserInfoFromLocalStorage(); },
                    onFail() { console.log('login fail') } 
                });
            },
            // 登出
            logout() {
                localStorage.removeItem(storageNameSpace.userInfo);
                localStorage.removeItem(storageNameSpace.tokenInfo);
                this.$store.commit(commitNameSpace.saveUserInfo, null);
            },
            // goRouter(path) {
            //     const { path: currentPath } = this.$route;
            //     // 只有路径改变时才跳转
            //     if (currentPath !== path) {
            //         this.$router.push(path);
            //     }
            // },
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
            },
            // 搜索框搜索
            onSearch() {
                // 仅当有值才执行搜索操作
                if (this.searchValue) {
                    // 变更值并确认后更新store中的搜索值以触发搜索
                    this.$store.commit(commitNameSpace.updateSearchKeyWord, this.searchValue);
                    if (this.$route.path !== '/search') {
                        this.$router.push({
                            path: '/search',
                            query: {
                                keyword: this.searchValue
                            }
                        });
                    }
                }
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
        .menu-list {
            height: 100%;
            li {
                float: left;
                line-height: 60px;
                padding: 0 10px;
                height: 100%;
                &:last-child {
                    display: flex;
                    align-items: center;
                }
            }
        }
        .w {
            padding: 0;
        }
        .search-area {
            display: flex;
            width: 200px;
            height: 32px;
            padding: 0 10px;
            border-radius: 16px;
            border: 1px solid #e6e6e6;
            transition: .3s border-color;
            margin-right: 15px;
            &.active {
                border-color: $main-color;
            }
            > input, i {
                line-height: 30px;
            }
            input {
                border: none;
                outline: none;
                background: none;
                width: 160px;
                padding-left: 10px;
            }
            i {
                display: inline-block;
                cursor: pointer;
                flex: 1;
                text-align: center;
                &:hover {
                    color: $main-color;
                }
            }
        }
    }
</style>