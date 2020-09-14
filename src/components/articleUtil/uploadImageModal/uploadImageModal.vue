<template>
    <el-dialog
        :visible="true"
        append-to-body
        title="上传/选择图片"
        custom-class="upload-image-modal-component"
    >
        <el-upload
            class="upload-image"
            drag
            action=""
            :http-request="onUpload"
            :on-progress="onProgress"
            :file-list="fileList"
            multiple
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
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
                fileList: [],                           // 文件列表
                isShowModal: this.visible               // 是否展示弹窗
            };
        },
        methods: {
            onUpload (event) {
                // const fileData = new FormData();
                // const { file } = event;
                // fileData.append('file', file);
                const formData = new FormData()
                formData.append('file', event.file)
                formData.append('path', 'article');
                formData.append('uploaderId', this.userInfo.userId);
                api.upload(formData)
                    .then(result => {
                        console.log('result', result);
                    })
                    .catch(err => {
                        console.log('err', err);
                    });
            },
            onProgress (file) {
                console.log('file', file)
            }
        },
        computed: {
            ...mapState(['userInfo'])
        }
    }
</script>

<style scope lang="scss">
    .upload-image-modal-component {
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
    }
</style>