<template>
    <el-dialog
        :visible.sync="isShowModal"
        append-to-body
        title="上传/查看图片"
        custom-class="upload-image-modal-component"
        @close="onClose"
    >
        <el-tabs
            v-model="activeTab"
            type="card"
        >
            <el-tab-pane
                label="上传图片"
                name="upload"
            >
                <el-form
                    ref="photoForm"
                    label-width="80px"
                    :model="photoForm"
                    :rules="photoFormRules"
                >
                    <el-form-item
                        label="图片名称"
                        prop="fileName"
                    >
                        <el-input
                            v-model="photoForm.fileName"
                            placeholder="请输入图片名称"
                            :maxLength="30"
                        />
                    </el-form-item>
                    <el-form-item
                        label="图片标签"
                        prop="tags"
                    >
                        <el-select
                            v-model="photoForm.tags"
                            multiple
                            collapse-tags
                            placeholder="请选择图片标签"
                        >
                            <el-option
                                v-for="categoryInfo in tagCategoryList"
                                :key="categoryInfo.id"
                                :value="categoryInfo.fieldCode"
                                :label="categoryInfo.fieldName"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-upload
                    class="upload-image"
                    drag
                    action=""
                    :http-request="onUpload"
                    multiple
                    :show-file-list="false"
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
                            v-for="(fileInfo, fileIndex) in uploadFileInfo"
                            :key="fileInfo.id"
                        >
                            <div class="image-container">
                                <img :src="fileInfo.url" :alt="fileInfo.fileName">
                                <div class="operate-area">
                                    <div
                                        class="left flex-content-xy-center"
                                        @click="previewImage(fileIndex)"
                                    >
                                        <i class="el-icon-zoom-in"/>
                                        <span>查看</span>
                                    </div>
                                    <div class="right">
                                        <div
                                            class="top flex-content-xy-center"
                                            @click="copyFileField(fileInfo, 'url')"
                                        >
                                            <i class="el-icon-copy-document"/>
                                            <span>复制链接</span>
                                        </div>
                                        <div
                                            class="bottom flex-content-xy-center"
                                            @click="showUpdatePhotoModal(fileInfo)"
                                        >
                                            <i class="el-icon-document-copy"/>
                                            <span>更新信息</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
        <viewer
            class="viewer"
            :images="imageList"
            ref="viewer"
        >
            <img v-for="src in imageList" :src="src" :key="src">
        </viewer>
        <update-photo-modal
            :visible.sync="isShowUpdatePhotoModal"
            :data="chosenPhoto"
            :category="tagCategoryList"
            @change="getUploadFilesInfo"
        />
    </el-dialog>
</template>

<script>
    import api, { queryDictionaryFieldList } from '@request';
    import {mapState} from "vuex";
    import storageNameSpace from '@nameSpace/storageNameSpace';

    const initPhotoForm = {
        fileName: '',
        tags: ''
    };

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
                isShowModal: this.visible,              // 是否展示弹窗
                photoForm: {                            // 图片信息
                    ...initPhotoForm
                },
                photoFormRules: {
                    fileName: [{ pattern: this.utils.regExp.letterChineseNumberUnderLine, message: '图片名称只能使用中文、字母、数字、下划线' },]
                },
                tagCategoryList: [],                    // 图片分类
                isShowUpdatePhotoModal: false,          // 是否展示更新图片弹窗
                chosenPhoto: null,                      // 当前选中图片信息
            };
        },
        methods: {
            // 自定义上传事件
            onUpload (event) {
                this.$refs.photoForm.validate()
                    .then(() => {
                        const { fileName, tags } = this.photoForm;
                        const formData = new FormData()
                        formData.append('file', event.file)
                        formData.append('path', 'article');
                        formData.append('type', 'articleImage');
                        formData.append('save', 'true');
                        if (fileName) formData.append('fileName', fileName);
                        if (tags && tags.length) formData.append('tags', tags.join(','));
                        api.upload(formData)
                            .then(result => {
                                if (result) {
                                    this.message.success({ title: '提示', message: '上传成功' });
                                    this.getUploadFilesInfo();
                                }
                            })
                    })
                    .catch(err => {
                        this.message.error({ message: '图片信息不正确，请检查' });
                    })
            },
            // 获取当前用户上传的文件信息
            getUploadFilesInfo () {
                const localUserInfo = this.getLocalUserInfo();
                if (!localUserInfo) return;
                const requestParams = {
                    uploaderId: localUserInfo.userId,
                    type: 'articleImage'
                }
                api.getUploadFilesInfo(requestParams)
                    .then(result => {
                        const { content } = result;
                        if (content && content.length) this.uploadFileInfo = content;
                    })
            },
            // 重置工具状态
            resetComponent () {
                this.activeTab = 'upload';
                this.uploadFileInfo = [];
                this.photoForm = {
                    fieldName: '',
                    tags: ''
                }
            },
            // 预览图片
            previewImage (imageIndex) {
                this.$refs.viewer.$viewer.view(imageIndex);
            },
            // 拷贝文件的某个字段到剪贴板
            copyFileField (fileInfo, field) {
                const transfer = document.createElement('input');
                document.body.appendChild(transfer);
                transfer.value = fileInfo[field];  // 这里表示想要复制的内容
                transfer.select();
                if (document.execCommand('copy')) {
                    document.execCommand('copy');
                    this.$message.info('已复制到剪贴板');
                }
                document.body.removeChild(transfer);
            },
            // 获取用户相册分类字典
            getAlbumCategory() {
                const localUserInfo = this.getLocalUserInfo();
                if (!localUserInfo) return;
                const { albumDicId } = localUserInfo;
                const requestParams = {
                    page: 1,
                    pageSize: 9999,
                    dicId: albumDicId
                }
                queryDictionaryFieldList(requestParams)
                    .then(result => {
                        const { content } = result;
                        this.tagCategoryList = content;
                    })
            },
            onClose() {
                this.isShowModal = false;
            },
            getLocalUserInfo() {
                let localUserInfo = localStorage.getItem(storageNameSpace.userInfo);
                if (!localUserInfo) {
                    this.message.info({ message: '未获取到用户信息,请重新登录' });
                    return null;
                }
                return JSON.parse(localUserInfo);
            },
            // 展示更新图片弹窗
            showUpdatePhotoModal(photoInfo) {
                this.chosenPhoto = photoInfo;
                this.isShowUpdatePhotoModal = true;
            }
        },
        computed: {
            ...mapState(['userInfo']),
            imageList () {
                return this.uploadFileInfo.map(fileInfo => fileInfo.url);
            }
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
                if (newValue) this.getAlbumCategory();
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
        .el-select {
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
                    .image-container {
                        position: relative;
                        img {
                            max-width: 100%;
                        }
                        .operate-area {
                            position: absolute;
                            display: flex;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            z-index: 2;
                            background: rgba(0, 0, 0, .5);
                            opacity: 0;
                            transition: $short-transition-time opacity;
                            color: #FFF;
                            &:hover {
                                opacity: 1;
                            }
                            .left {
                                width: 50%;
                                height: 100%;
                            }
                            .right {
                                width: 50%;
                                height: 100%;
                                display: flex;
                                flex-direction: column;
                                .top {
                                    height: 50%;
                                }
                                .bottom {
                                    height: 50%;
                                }
                            }
                            .left, .top, .bottom {
                                background: rgba(0, 0, 0, .5);
                                opacity: 0;
                                transition: $short-transition-time opacity;
                                cursor: pointer;
                                &:hover {
                                    opacity: 1;
                                }
                                i {
                                    display: inline-block;
                                    margin-right: 10px;
                                }
                            }
                        }
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
        .viewer {
            display: none;
        }
        @media screen and (min-width: 1599px) {
            .file-list-container {
                max-height: 600px;
            }
        }
    }
</style>