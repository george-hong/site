<template>
    <div class="my-files-component">
        <filter-file-form
            @init="filterPhoto"
            @change="filterPhoto"
        />
        <div
            class="album-block"
            v-if="fileList.length"
        >
            <ul class="album-container">
                <li
                    v-for="(fileInfo, fileIndex) in fileList"
                    :key="fileInfo.id"
                >
                    <el-image
                        :src="fileInfo.url"
                        :style="{width: '100%', height: '100%'}"
                        fit="contain"
                        @click="previewImage(fileIndex)"
                        lazy
                    >
                        <div
                            slot="error"
                            class="image-error flex-content-xy-center"
                        >
                            <i class="el-icon-picture-outline" />
                        </div>
                        <div
                            slot="placeholder"
                            class="image-error flex-content-xy-center"
                        >
                            <i class="el-icon-loading" />
                        </div>
                    </el-image>
                </li>
            </ul>
        </div>
        <empty v-show="!fileList.length"/>
        <viewer
            v-if="fileList.length"
            class="viewer"
            :images="imageList"
            ref="viewer"
        >
            <img v-for="src in imageList" :src="src" :key="src">
        </viewer>
    </div>
</template>

<script>
    import dayjs from 'dayjs';
    import api from '@request';
    import { stateNameSpace } from '@nameSpace/storeNameSpace';


    export default {
        name: 'myFile',
        data () {
            return {
                fileList: [],
            }
        },
        methods: {
            getFileList (params) {
                const requestParams = {
                    uploaderId: this.userInfo.userId,
                    type: 'articleImage',
                    ...params
                };
                api.getUploadFilesInfo(requestParams)
                    .then(result => {
                        const { content } = result;
                        if (content) this.fileList = content;
                        this.fileList.forEach(fileInfo => {
                            fileInfo.createTime = dayjs(fileInfo.createTime).format('YYYY-MM-DD HH:mm:ss');
                        });
                    })
                    .catch(error => {
                        console.log(`文件信息获取异常:${error}`);
                    });
            },
            // 预览图片
            previewImage (imageIndex) {
                this.$refs.viewer.$viewer.view(imageIndex);
            },
            // 过滤图片
            filterPhoto(confition) {
                this.getFileList(confition);
            },

        },
        computed: {
            userInfo () {
                return this.$store.state[stateNameSpace.userInfo];
            },
            imageList () {
                return this.fileList.map(fileInfo => fileInfo.url);
            }
        }
    }
</script>

<style scoped lang="scss">
    .my-files-component {
        .album-block {
            .album-title {
                margin: 10px;
            }
            .album-container {
                display: flex;
                flex-wrap: wrap;
                margin-left: -10px;
                > li {
                    box-sizing: border-box;
                    width: 33.333%;
                    height: 300px;
                    padding-left: 10px;
                    margin-bottom: 10px;
                    /deep/ .image-error {
                        height: 200px;
                        width: 200px;
                        background: #f5f7fa;
                        i {
                            font-size: 22px;
                        }
                    }
                }
            }
        }
        .viewer {
            display: none;
        }
    }
</style>