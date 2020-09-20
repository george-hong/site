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
                        size="small"
                        @click="goArticleEdit"
                        type="primary"
                        class="article-edit-button"
                    >
                        写文章
                    </el-button>
                    <el-button
                        v-if="!userInfo"
                        type="text"
                        @click="login"
                    >
                        登录/注册
                    </el-button>
                    <el-popover
                        v-else
                        trigger="hover"
                        popper-class="button-popper"
                    >
                        <div
                            class="avatar-container"
                            slot="reference"
                            @click="goPersonCenter"
                        >
                            <img
                                :src="userInfo.avatar"
                                :alt="userInfo.userName"
                            />
                        </div>
                        <div class="user-hover-button-box">
                            <el-button
                                class="popper-button"
                                size="small"
                                @click="goPersonCenter"
                            >
                                个人中心
                            </el-button>
                            <el-button
                                class="popper-button"
                                size="small"
                                @click="logout"
                            >
                                退出登录
                            </el-button>
                        </div>
                    </el-popover>
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
                this.$router.push({ name: 'root' });
            },
            tryGetUserInfoFromLocalStorage() {
                const localUserInfo = localStorage.getItem(storageNameSpace.userInfo);
                const tokenExpiresTime = parseInt(localStorage.getItem(storageNameSpace.tokenExpiresTime));
                // 如果token已过期，删除用户信息
                if (tokenExpiresTime < Date.now()) {
                    localStorage.removeItem(storageNameSpace.userInfo);
                    localStorage.removeItem(storageNameSpace.token);
                    localStorage.removeItem(storageNameSpace.tokenExpiresTime);
                    this.message.info({
                        title: '已自动登出',
                        message: '您的登录信息已失效，请重新登录。'
                    });
                    this.$router.push({ name: 'root' });
                    return; //
                }
                try {
                    const userInfo = JSON.parse(localUserInfo);
                    this.$store.commit(commitNameSpace.saveUserInfo, userInfo);
                } catch (err) {
                    // 读取失败
                    // 读取本地用户信息异常.清空用户信息并退出到首页
                    // localStorage.removeItem(storageNameSpace.userInfo);
                    // this.$store.commit(commitNameSpace.saveUserInfo, null);
                    // this.message.info({
                    //     title: '已自动登出',
                    //     message: '您的登录信息已失效，请重新登录。'
                    // });
                    // this.$router.push({ name: 'root' });
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
            },
            // 判断是否登录后跳转到文章编辑页面
            goArticleEdit () {
                if (this.userInfo) this.$router.push({ name: 'articleEdit' });
                else this.login();
            },
            // 跳转到个人中心页面
            goPersonCenter () {
                this.$router.push({ name: 'personCenterDetail' });
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
                    .avatar-container {
                        width: 32px;
                        height: 32px;
                        box-sizing: border-box;
                        overflow: hidden;
                        border-radius: 2px;
                        img {
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
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
        .article-edit-button {
            margin-right: 10px;
        }
    }
    .button-popper {
        padding: 0;
        .user-hover-button-box {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            .popper-button {
                width: 100%;
                margin: 0;
                border: none;
            }
        }
    }
</style>