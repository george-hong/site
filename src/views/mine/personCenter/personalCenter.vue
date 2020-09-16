<template>
    <div class="person-center-page">
        <div
            class="header-area"
            :style="{'background-image': `url(${headerBackgroundImage})`}"
        >
            <div class="w">
                <div class="left">
                    <img :src="userInfo.headerImage" />
                </div>
                <div class="right">
                    <span class="user-name">{{userInfo.userName}}</span>
                    <el-button
                        type="primary"
                        size="small"
                    >
                        更改昵称
                    </el-button>
                    <el-button
                        type="primary"
                        size="small"
                        @click="showModifyHeaderImage"
                    >
                        更换头像
                    </el-button>
                </div>
            </div>
        </div>
        <div class="w">

        </div>
        <modify-header-image :visible="isShowModifyHeaderImage"/>
    </div>
</template>

<script>
    import { stateNameSpace } from '@nameSpace/storeNameSpace';
    import modifyHeaderImage from './components/modifyHeaderImage.vue';

    export default {
        name: 'personCenterPage',
        components: {
            modifyHeaderImage
        },
        data () {
            return {
                headerBackgroundImage: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2929358784,3767512518&fm=26&gp=0.jpg',                // 头像背景图
                isShowModifyHeaderImage: false,                 // 是否展示更换头像窗口
            };
        },
        methods: {
            // 展示更换头像窗口
            showModifyHeaderImage () {
                this.isShowModifyHeaderImage = true;
            }
        },
        computed: {
            userInfo () {
                return this.$store.state[stateNameSpace.userInfo] || {};
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
                    img {
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        border: 2px solid #FFF;
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
                    .user-name {
                        display: block;
                        width: 100%;
                        font-size: 20px;
                        line-height: 24px;
                        font-weight: 700;
                        color: #333;
                        margin-bottom: 10px;
                    }
                }
            }
        }
    }
</style>