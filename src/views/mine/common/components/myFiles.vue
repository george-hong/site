<template>
    <div class="my-files-component">
        <div class="album-block">
<!--            <p class="album-title">标题区域</p>-->
            <ul class="album-container">
                <li
                    v-for="(fileInfo, fileIndex) in fileList"
                    :key="fileInfo.id"
                >
                    <img
                        :src="fileInfo.url"
                        @click="previewImage(fileIndex)"
                    >
                </li>
            </ul>
        </div>
        <viewer
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
                fileList: []
            }
        },
        created () {
            this.getFileList();
        },
        methods: {
            getFileList () {
                const requestParams = {
                    uploaderId: this.userInfo.userId,
                    type: 'articleImage'
                }
                api.getUploadFilesInfo(requestParams)
                    .then(result => {
                        const { content } = result;
                        if (content && content.length) this.fileList = content;
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
                    img {
                        max-width: 100%;
                        max-height: 100%;
                    }
                }
            }
        }
        img {
            max-width: 100%;
        }
        .viewer {
            display: none;
        }
    }
</style>