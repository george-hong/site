<template>
    <div class="person-center-page">

            <div class="w no-padding">
                <div
                    class="header-area"
                    :style="{'background-image': `url(${userBaseInfo.backgroundImage})`}"
                >
                    <div class="left">
                        <div class="avatar-container">
                            <img :src="userInfo.avatar" />
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
                            @click="showModifyAvatar"
                        >
                            更换头像
                        </el-button>
                        <el-button
                            type="primary"
                            size="small"
                            @click="showModifyBackground"
                        >
                            更换背景
                        </el-button>
                    </div>
                </div>
            </div>

        <div class="w">

        </div>
        <update-avatar
            :visible.sync="isShowUpdateAvatar"
            @updatedAvatar="onUpdateAvatar"
        />
        <update-background-image
            :visible.sync="isShowUpdateBackgroundImage"
            @updatedBackgroundImage="onUpdateBackgroundImage"
        />
    </div>
</template>

<script>
    import { stateNameSpace, commitNameSpace } from '@nameSpace/storeNameSpace';
    import storageNameSpace from '@nameSpace/storageNameSpace';
    import updateAvatar from './components/updateAvatar.vue';
    import updateBackgroundImage from './components/updateBackgroundImage.vue';
    import api from '@request';

    export default {
        name: 'personCenterPage',
        components: {
            updateAvatar,
            updateBackgroundImage
        },
        data () {
            return {
                isShowUpdateAvatar: false,                      // 是否展示更换头像窗口
                isShowUpdateBackgroundImage: false,             // 是否展示更换背景窗口
                isEditUserInfo: false,                          // 是否正在编辑用户基本信息
                userBaseInfo: {                                 // 用户基本信息
                    userName: '',                               // 修改用的用户名称
                    backgroundImage: ''                         // 修改用的背景图
                }
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
            // 更新头像后执行
            onUpdateAvatar (imageInfo) {
                this.updateLocalUserInfo({ avatar: imageInfo.url });
            },
            // 更新背景后执行
            onUpdateBackgroundImage (imageInfo) {
                console.log('update image')
                this.userBaseInfo.backgroundImage = imageInfo.url;
                this.updateLocalUserInfo({ backgroundImage: imageInfo.url });
            },
            // 开始编辑用户基本信息
            startEditUserBaseInfo () {
                this.userBaseInfo.userName = this.userInfo.userName;
                this.isEditUserInfo = true;
                // 等待选择框展示后选中选择框的内容
                this.$nextTick(() => {
                    this.$refs.nameInput.select();
                });
            },
            // 确认更新用户基本信息
            confirmUpdateUserBaseInfo () {
                console.log(this.userBaseInfo, this.userInfo, this.userBaseInfo === this.userInfo)
                if (this.userBaseInfo.userName && (this.userBaseInfo.userName !== this.userInfo.userName)) {
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
                        //
                        this.$store.commit(commitNameSpace.saveUserInfo, JSON.parse(JSON.stringify(localUserInfo)));
                        resolve(localUserInfo);
                    } catch (err) {
                        console.log('用户信息更新失败', err);
                        reject(err);
                    }
                });
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
            userInfo (newValue) {
                if (newValue && newValue.backgroundImage) this.userBaseInfo.backgroundImage = newValue.backgroundImage;
            }
        },
    }
</script>

<style lang="scss" scoped>
    .person-center-page {
        .w {
            .header-area {
                height: 200px;
                display: flex;
                background-size: 100% auto;
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