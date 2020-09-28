<template>
    <div class="person-center-page">

            <div class="w no-padding">
                <div
                    class="header-area"
                    :style="{'background-image': `url(${userInfo.backgroundImage})`}"
                >
                    <div class="header-button-area">
                        <el-button
                            type="primary"
                            size="small"
                            @click="showModifyBackground"
                            icon="el-icon-picture"
                            title="更换背景"
                        />
                    </div>
                </div>
            </div>

        <div class="w edit-area">
            <ul class="edit-info-list">
                <li>
                    <div class="left">
                        <span>头像</span>
                    </div>
                    <div class="right">
                        <div class="avatar-container">
                            <img
                                :src="userInfo.avatar"
                                :alt="userInfo.userName"
                                title="修改头像"
                                @click="showModifyAvatar"
                            />
                        </div>
                    </div>
                </li>
                <li>
                    <div class="left">
                        <span>昵称</span>
                    </div>
                    <div class="right">
                        <el-input
                            v-model="userBaseInfo.userName"
                        />
                    </div>
                </li>
                <li>
                    <div class="left">
                        <span>简介</span>
                    </div>
                    <div class="right">
                        <el-input
                            type="textarea"
                            placeholder="简单描述自己"
                            :maxlength="50"
                            v-model="userBaseInfo.introduction"
                        />
                    </div>
                </li>
            </ul>
            <div class="footer-button-area">
                <el-button>
                    返回
                </el-button>
                <el-button
                    type="primary"
                    @click="confirmUpdateUserBaseInfo"
                    :loading="isSubmitting"
                >
                    保存
                </el-button>
            </div>
        </div>
        <update-avatar
            :visible.sync="isShowUpdateAvatar"
            @updatedAvatar="getUserBaseInfo"
        />
        <update-background-image
            :visible.sync="isShowUpdateBackgroundImage"
            @updatedBackgroundImage="getUserBaseInfo"
        />
    </div>
</template>

<script>
    import { stateNameSpace, commitNameSpace } from '@nameSpace/storeNameSpace';
    import storageNameSpace from '@nameSpace/storageNameSpace';
    import updateAvatar from '../common/components/updateAvatar.vue';
    import updateBackgroundImage from '../common/components/updateBackgroundImage.vue';
    import { getUserBaseInfo, updateUserBaseInfo } from '@request';

    export default {
        name: 'personCenterPage',
        components: {
            updateAvatar,
            updateBackgroundImage
        },
        data () {
            return {
                isSubmitting: false,                            // 是否正在提交信息
                isShowUpdateAvatar: false,                      // 是否展示更换头像窗口
                isShowUpdateBackgroundImage: false,             // 是否展示更换背景窗口
                userBaseInfo: {                                 // 用户基本信息
                    userName: '',                               // 修改用的用户名称
                    introduction: ''                            // 修改用的用户简介
                },
                userInfo: {}                                    // 服务器存储的用户信息
            };
        },
        methods: {
            // 展示更换头像窗口
            showModifyAvatar () {
                this.isShowUpdateAvatar = true;
            },
            // 展示更换背景窗口
            showModifyBackground () {
                this.isShowUpdateBackgroundImage = true;
            },
            // 确认更新用户基本信息
            confirmUpdateUserBaseInfo () {
                if (this.isSubmitting) return;
                if (!this.userBaseInfo.userName) return this.$messge.info('请输入昵称');
                this.isSubmitting = true;
                console.log(this.userBaseInfo, this.userInfo, this.userBaseInfo === this.userInfo)
                const requestParams = {
                    userId: this.userInfo.id,
                    userName: this.userBaseInfo.userName,
                    introduction: this.userBaseInfo.introduction
                };
                updateUserBaseInfo(requestParams)
                    .then(result => {
                        return this.getUserBaseInfo();
                    })
                    .then(userInfo => {
                        this.message.success({ title: '成功', message: '您的基础信息已修改' });
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        this.isSubmitting = false;
                    })
            },
            // 获取用户基本信息
            getUserBaseInfo () {
                return new Promise((resolve, reject) => {
                    const { account } = this.$route.query;
                    console.log('account', account)
                    const requestParams = {
                        account
                    };
                    getUserBaseInfo(requestParams)
                        .then(result => {
                            if (result && result.accountInfo) {
                                this.userInfo = result.accountInfo;
                                resolve();
                            } else reject(new Error('未获取到信息'));
                        })
                        .catch(error => reject(error));
                });
            },
        },
        created () {
            this.getUserBaseInfo()
                .then(() => {
                    this.userBaseInfo = JSON.parse(JSON.stringify(this.userInfo));
                })
        }
    };
</script>

<style lang="scss" scoped>
    @import '../common/style/personCenter.scss';
    .person-center-page {
        .edit-area {
            .edit-info-list {
                margin-bottom: 20px;
                > li {
                    display: flex;
                    padding: 10px 0;
                    align-items: center;
                    &:not(:last-child) {
                        border-bottom: 1px solid $border-color;
                    }
                    span, input, textarea {
                        font-size: 16px;
                    }
                    /deep/ input, /deep/ textarea {
                        max-width: 300px;
                    }
                    .left {
                        width: 80px;
                        text-align: right;
                        span {
                            color: #999;
                        }
                    }
                    .right {
                        width: calc(100% - 80px);
                        box-sizing: border-box;
                        padding-left: 10px;
                    }
                }
            }
            .avatar-container img {
                cursor: pointer;
            }
        }
    }
</style>