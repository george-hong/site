<template>
    <el-dialog
        :visible.sync="isShowModal"
        append-to-body
        title="上传/查看图片"
        custom-class="upload-image-modal-component"
    >
        <el-tabs
            v-model="activeTab"
            type="card"
        >
            <el-tab-pane
                label="上传图片"
                name="upload"
            >
                <el-upload
                    class="upload-image"
                    drag
                    action=""
                    :http-request="onUpload"
                    :show-file-list="false"
                    multiple
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane
                label="查看图片"
                name="review"
            >
                <div class="file-list-container">
                    <ul
                        class="file-list"
                        v-if="uploadFileInfo && uploadFileInfo.length"
                    >
                        <li
                            v-for="fileInfo in uploadFileInfo"
                            :key="fileInfo.id"
                        >
                            <img :src="fileInfo.url" :alt="fileInfo.fileName">
                            <p>{{fileInfo.fileName}}</p>
                        </li>
                    </ul>
                    <empty
                        v-else
                        custom-class="empty"
                        tip="暂未上传文件"
                    />
                </div>
            </el-tab-pane>
        </el-tabs>

    </el-dialog>
</template>

<script>
    import api from '@request';
    import {mapState} from "vuex";

    export default {
        name: 'uploadImageModal',
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                activeTab: 'upload',                    // 当前激活的标签页
                uploadFileInfo: [],                     // 已上传的文件信息
                isShowModal: this.visible               // 是否展示弹窗
            };
        },
        methods: {
            // 自定义上传事件
            onUpload (event) {
                const formData = new FormData()
                formData.append('file', event.file)
                formData.append('path', 'article');
                formData.append('uploaderId', this.userInfo.userId);
                api.upload(formData)
                    .then(result => {
                        console.log('result', result);
                        this.message.success({ title: '提示', message: '上传成功' });
                        this.getUploadFilesInfo();
                    })
                    .catch(err => {
                        console.log('err', err);
                    });
            },
            // 获取当前用户上传的文件信息
            getUploadFilesInfo () {
                const requestParams = {
                    uploaderId: this.userInfo.userId
                }
                api.getUploadFilesInfo(requestParams)
                    .then(result => {
                        const { content } = result;
                        if (content && content.length) this.uploadFileInfo = content;
                    })
                    .catch(error => {
                        console.log(`文件信息获取异常:${error}`);
                    });
            },
            // 重置工具状态
            resetComponent () {
                this.activeTab = 'upload';
                this.uploadFileInfo = [];
            }
        },
        computed: {
            ...mapState(['userInfo'])
        },
        watch: {
            activeTab (newValue) {
                // 如果标签页切换到查看页面时仍没有上传文件信息，重新调用接口获取上传文件信息
                if (newValue === 'review' && !this.uploadFileInfo.length) this.getUploadFilesInfo();
            },
            // 父级更新显示状态同步到子级
            visible (newValue) {
                this.isShowModal = newValue;
            },
            // 子级更新显示状态通知到父级
            isShowModal (newValue) {
                this.$emit('update:visible', newValue);
                // 关闭上传工具时重置工具状态
                if (!newValue) this.resetComponent();
            }
        }
    }
</script>

<style scope lang="scss">
    .upload-image-modal-component {
        max-width: 550px;
        .el-dialog__body {
            padding-top: 0;
        }
        .el-upload {
            width: 100%;
        }
        .upload-image {
            .el-upload {
                width: 100%;
                .el-upload-dragger {
                    width: 100%;
                }
            }
        }
        .file-list-container {
            max-height: 400px;
            overflow: auto;
            .file-list {
                > li {
                    margin-bottom: 20px;
                    img {
                        max-width: 100%;
                    }
                    p {
                        text-align: center;
                    }
                }
            }
        }
        .empty {
            padding: 100px 0 !important;
        }
        @media screen and (min-width: 1599px) {
            .file-list-container {
                max-height: 600px;
            }
        }
    }
</style>