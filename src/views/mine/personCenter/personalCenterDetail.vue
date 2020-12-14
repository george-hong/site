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
                    label="我的文章"
                    name="myArticle"
                >
                    <my-article-table :userInfo="userInfo" />
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
    import MyArticleTable from '../common/components/myArticleTable.vue';

    export default {
        name: 'personCenterPage',
        components: {
            MyArticleTable,
            myFiles
        },
        data () {
            return {
                currentTab: 'myArticle',        // 当前选择的tab
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
                const requestParams = {
                    account
                };
                getUserBaseInfo(requestParams)
                    .then(result => {
                        if (result && result.accountInfo) this.userInfo = result.accountInfo;
                    })
            }
        },
        computed: {
            isAccountOwner () {
                const localUserInfo = this.$store.state[stateNameSpace.userInfo] || {};
                return localUserInfo.userId === this.userInfo.userId;
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