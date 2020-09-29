<template>
    <div class="person-center-page">
        <!-- 顶部背景栏 -->
        <div class="w no-padding">
            <div
                class="header-area"
                :style="{'background-image': `url(${userInfo.backgroundImage})`}"
            />
        </div>
        <!-- 用户信息 -->
        <div class="w base-info">
            <div class="left">
                <div class="avatar-container">
                    <img :src="userInfo.avatar" />
                </div>
            </div>
            <div class="right">
                <span class="name-line">
                    <span class="user-name">
                        {{userInfo.userName}}
                    </span>
                    <el-button
                        v-if="isAccountOwner"
                        class="fr edit-button"
                        size="small"
                        type="text"
                        @click="goEditPersonInfo"
                    >
                        <i class="el-icon-edit-outline" />
                        <span>编辑个人信息</span>
                    </el-button>
                </span>
                <span
                    class="introduction-line"
                    v-if="userInfo.introduction"
                >
                    {{userInfo.introduction}}
                </span>
            </div>
        </div>
        <div class="w">
            <el-tabs
                v-model="currentTab"
                type="card"
            >
                <el-tab-pane
                    label="我的收藏"
                    name="myCollection"
                >
                    我的收藏
                </el-tab-pane>
                <el-tab-pane
                    label="我的文件"
                    name="myFiles"
                    lazy
                >
                    <my-files />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import { stateNameSpace } from '@nameSpace/storeNameSpace';
    import { getUserBaseInfo } from '@request';
    import myFiles from '../common/components/myFiles.vue';

    export default {
        name: 'personCenterPage',
        components: {
            myFiles
        },
        data () {
            return {
                currentTab: 'myCollection',     // 当前选择的tab
                userInfo: {}                    // 当前展示的用户信息
            };
        },
        methods: {
            // 跳转编辑信息页面
            goEditPersonInfo () {
                this.$router.push({
                    name: 'personCenterEdit',
                    query: {
                        account: this.userInfo.account
                    }
                });
            },
            // 获取用户基本信息
            getUserBaseInfo () {
                const { account } = this.$route.query;
                console.log('account', account)
                const requestParams = {
                    account
                };
                getUserBaseInfo(requestParams)
                    .then(result => {
                        if (result && result.accountInfo) this.userInfo = result.accountInfo;

                    })
                    .catch(error => {
                        console.log('error', error)
                    });
            }
        },
        computed: {
            isAccountOwner () {
                const localUserInfo = this.$store.state[stateNameSpace.userInfo] || {};
                return localUserInfo.userId === this.userInfo.id;
            }
        },
        created () {
            this.getUserBaseInfo();
        }
    }
</script>

<style lang="scss" scoped>
    @import '../common/style/personCenter.scss';
    .person-center-page {
        .edit-button {
            padding: 0;
        }
        .base-info {
            display: flex;
            .left {
                width: 80px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }
            .right {
                width: calc(100% - 80px);
                min-height: 100%;
                display: flex;
                flex-wrap: wrap;
                padding-left: 15px;
                align-items: center;
                align-content: center;
                .name-line {
                    display: block;
                    width: 100%;
                    span {
                        &:first-child {
                            font-size: 20px;
                            line-height: 24px;
                            font-weight: 700;
                            color: #333;
                        }
                    }
                }
                .introduction-line {
                    margin-top: 10px;
                }
            }
        }
    }
</style>