<template>
    <div class="my-files-component">
        <el-steps direction="vertical">
            <el-step
                v-for="(fileInfo, fileIndex) in fileList"
                :key="fileInfo.id"
                :title="fileInfo.createTime"
            >
                <img
                    slot="description"
                    :src="fileInfo.url"
                    @click="previewImage(fileIndex)"
                />
            </el-step>
        </el-steps>
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
        /deep/ .el-step__main {
            .el-step__description {
                padding-right: 0;
            }
        }
        img {
            max-width: 100%;
        }
    }
</style>