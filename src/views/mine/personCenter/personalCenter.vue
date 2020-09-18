<template>
    <div class="person-center-page">
        <div
            class="header-area"
            :style="{'background-image': `url(${headerBackgroundImage})`}"
        >
            <div class="w">
                <div class="left">
                    <div class="avatar-container">
                        <img :src="userInfo.headerImage" />
                    </div>
                </div>
                <div class="right">
                    <span class="name-line">
                        <span
                            v-show="!isEditUserInfo"
                            class="user-name"
                        >
                            {{userInfo.userName}}
                        </span>
                        <el-input
                            v-model="userBaseInfo.userName"
                            :max-length="15"
                            type="text"
                            v-show="isEditUserInfo"
                            ref="nameInput"
                            class="input"
                        />
                        <i
                            v-if="!isEditUserInfo"
                            class="el-icon-edit"
                            @click="startEditUserBaseInfo"
                        />
                        <i
                            v-if="isEditUserInfo"
                            class="el-icon-check"
                            @click="confirmUpdateUserBaseInfo"
                        />
                        <i
                            v-if="isEditUserInfo"
                            class="el-icon-close"
                            @click="cancelUpdateUserBaseInfo"
                        />
                    </span>
                    <el-button
                        type="primary"
                        size="small"
                        @click="showModifyHeaderImage"
                    >
                        更换头像
                    </el-button>
                    <el-button
                        type="primary"
                        size="small"
                    >
                        更换背景
                    </el-button>
                </div>
            </div>
        </div>
        <div class="w">

        </div>
        <update-avatar
            :visible.sync="isShowModifyHeaderImage"
            @updatedAvatar="onUpdateAvatar"
        />
    </div>
</template>

<script>
    import { stateNameSpace, commitNameSpace } from '@nameSpace/storeNameSpace';
    import storageNameSpace from '@nameSpace/storageNameSpace';
    import updateAvatar from './components/updateAvatar.vue';
    import api from '@request';

    export default {
        name: 'personCenterPage',
        components: {
            updateAvatar
        },
        data () {
            return {
                headerBackgroundImage: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2929358784,3767512518&fm=26&gp=0.jpg',                // 头像背景图
                isShowModifyHeaderImage: false,                 // 是否展示更换头像窗口
                isEditUserInfo: false,                          // 是否正在编辑用户基本信息
                userBaseInfo: {                                 // 用户基本信息
                    userName: ''
                }
            };
        },
        methods: {
            // 展示更换头像窗口
            showModifyHeaderImage () {
                this.isShowModifyHeaderImage = true;
            },
            // 更新头像后执行
            onUpdateAvatar (imageInfo) {
                this.updateLocalUserInfo({ url: imageInfo.url });
            },
            // 更新本地用户信息
            updateLocalUserInfo (newInfoObject) {
                return new Promise((resolve, reject) => {
                    try {
                        let localUserInfo = JSON.parse(localStorage.getItem(storageNameSpace.userInfo));
                        localUserInfo = {
                            ...localUserInfo,
                            ...newInfoObject
                        };
                        localStorage.setItem(storageNameSpace.userInfo, JSON.stringify(localUserInfo));
                        this.$store.commit(commitNameSpace.saveUserInfo, localUserInfo);
                        resolve(localUserInfo);
                    } catch (err) {
                        console.log('用户信息更新失败', err);
                        reject(err);
                    }
                });
            },
            // 开始编辑用户基本信息
            startEditUserBaseInfo () {
                this.userBaseInfo.userName = this.userInfo.userName;
                this.isEditUserInfo = true;
                this.$nextTick(() => {
                    this.$refs.nameInput.select();
                })
            },
            // 确认更新用户基本信息
            confirmUpdateUserBaseInfo () {
                if (this.userBaseInfo.userName && this.userBaseInfo.userName !== this.userInfo.userName) {
                    const requestParams = {
                        userId: this.userInfo.userId,
                        userName: this.userBaseInfo.userName
                    };
                    api.updateUserBaseInfo(requestParams)
                        .then(result => {
                            return this.updateLocalUserInfo({ userName: result.userName });
                        })
                        .then(userInfo => {
                            this.message.success({ title: '成功', message: '您的基础信息已修改' });
                        })
                        .catch(err => {

                        })
                }
                this.isEditUserInfo = false;
            },
            // 取消更新用户基本信息
            cancelUpdateUserBaseInfo () {
                this.isEditUserInfo = false;
            }
        },
        computed: {
            userInfo () {
                return this.$store.state[stateNameSpace.userInfo] || {};
            }
        },
        watch: {
            userInfo: {
                deep: true,
                handler (newValue) {
                    if (newValue) this.userBaseInfo = newValue;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .person-center-page {
        .header-area {
            background-size: 100% auto;
            .w {
                height: 200px;
                display: flex;
                .left {
                    width: 50%;
                    height: 100%;
                    display: flex;
                    padding-right: 15px;
                    justify-content: flex-end;
                    align-items: center;
                    .avatar-container {
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        border: 2px solid #FFF;
                        overflow: hidden;
                    }
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .right {
                    width: 50%;
                    height: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    padding-left: 15px;
                    align-items: center;
                    align-content: center;
                    .name-line {
                        display: block;
                        width: 100%;
                        margin-bottom: 10px;
                        span, i {
                            font-size: 20px;
                            line-height: 24px;
                            font-weight: 700;
                            color: #333;
                        }
                        i {
                            cursor: pointer;
                            &:hover {
                                color: $main-color;
                            }
                        }
                        .input {
                            width: 200px;
                            /deep/ input {
                                background: transparent;
                                border: none;
                                outline: none;
                                font-size: 20px;
                                font-weight: 700;
                                line-height: 24px;
                                height: 24px;
                                padding: 0;
                                color: #333;
                            }
                        }
                    }
                }
            }
        }
    }
</style>