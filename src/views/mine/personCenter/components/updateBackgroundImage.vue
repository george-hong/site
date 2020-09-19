<template>
    <el-dialog
        width="1000px"
        :visible.sync="isShowModal"
        title="修改背景图"
        custom-class="modify-header-modal"
        destroy-on-close
        :show-close="false"
        :close-on-click-modal="false"
        @close="resetComponent"
    >
        <el-upload
            v-show="currentStep === 0"
            class="upload-demo"
            action=""
            drag
            :auto-upload="false"
            :show-file-list="false"
            :on-change="changeUpload"
        >
            <i class="el-icon-upload" />
            <div class="el-upload__text">点击上传</div>
            <div class="el-upload__tip">支持绝大多数图片格式，单张图片最大支持5MB</div>
        </el-upload>
        <div
            class="cropper-content"
            v-show="currentStep === 1"
        >
            <vue-cropper
                ref="cropper"
                :img="option.img"
                :outputSize="option.size"
                :outputType="option.outputType"
                :info="true"
                :full="option.full"
                :canMoveBox="option.canMoveBox"
                :original="option.original"
                :autoCrop="option.autoCrop"
                :fixed="option.fixed"
                :fixedNumber="option.fixedNumber"
                :centerBox="option.centerBox"
                :infoTrue="option.infoTrue"
                :fixedBox="option.fixedBox"
                :autoCropWidth="option.autoCropWidth"
                :autoCropHeight="option.autoCropHeight"
            />
        </div>
        <div
            slot="footer"
            class="footer-button"
        >
            <el-button
                @click="cancel"
                :disabled="isUploading"
            >
                取消
            </el-button>
            <el-button
                type="primary"
                :loading="isUploading"
                @click="confirm"
            >
                确认修改
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
    import api from '@request';
    import { stateNameSpace, storageNameSpace } from '@nameSpace/storeNameSpace';

    export default {
        name: 'updateBackgroundImage',
        props: {
            visible: {              // 是否显示更换头像弹窗
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                isShowModal: this.visible,          // 是否展示弹窗
                isUploading: false,                 // 是否正在上传图片
                currentStep: 0,                     // 当前操作步骤
                // 裁剪组件的基础配置option
                option: {
                    img: '', // 裁剪图片的地址
                    info: true, // 裁剪框的大小信息
                    outputSize: 1, // 裁剪生成图片的质量
                    outputType: 'jpeg', // 裁剪生成图片的格式
                    canScale: true, // 图片是否允许滚轮缩放
                    autoCrop: true, // 是否默认生成截图框
                    autoCropWidth: '1000', // 默认生成截图框宽度
                    autoCropHeight: '200', // 默认生成截图框高度
                    fixedBox: true, // 固定截图框大小 不允许改变
                    fixed: true, // 是否开启截图框宽高固定比例
                    fixedNumber: [5, 1], // 截图框的宽高比例
                    full: false, // 是否输出原图比例的截图
                    canMoveBox: true, // 截图框能否拖动
                    original: false, // 上传图片按照原始比例渲染
                    centerBox: true, // 截图框是否被限制在图片里面
                    infoTrue: false // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
                },
            };
        },
        methods: {
            // 上传按钮   限制图片大小
            changeUpload(file) {
                const isLt5M = file.size / 1024 / 1024 < 5
                if (!isLt5M) {
                    this.$message.error('上传文件大小不能超过 5MB!')
                    return false
                }
                // 上传成功后将图片地址赋值给裁剪框显示图片
                const localUrl = URL.createObjectURL(file.raw);
                this.option.img = localUrl;
                this.currentStep = 1;
            },
            // 下一步/确认
            confirm () {
                if (this.currentStep === 0) return this.$message.info('请先上传图片');
                this.$refs.cropper.getCropBlob(blobData => {
                    console.log(blobData)
                    this.saveAvatar(blobData);
                })
            },
            // 取消
            cancel () {
                this.isShowModal = false;
            },
            // 保存头像
            saveAvatar (blobData) {
                if (this.isUploading) return;
                this.isUploading = true;
                const formData = new FormData();
                formData.append('file', blobData, `${Date.now()}.jpg`);
                formData.append('path', 'backgroundImage');
                formData.append('type', 'backgroundImage');
                formData.append('uploaderId', this.userInfo.userId);
                api.updateUserImage(formData)
                    .then(result => {
                        this.$emit('updatedBackgroundImage', result);
                        this.message.success({ title: '提示', message: '修改成功' });
                        this.isShowModal = false;
                    })
                    .catch(err => {
                        console.log('err', err);
                    })
                    .finally(() => {
                        this.isUploading = false;
                    });
            },
            // 重置组件状态
            resetComponent () {
                this.currentStep = 0;
            },

        },
        watch: {
            visible (newValue) {
                this.isShowModal = newValue;
            },
            isShowModal (newValue) {
                this.$emit('update:visible', newValue);
            }
        },
        computed: {
            userInfo () {
                return this.$store.state[stateNameSpace.userInfo];
            }
        }
    }
</script>

<style scoped lang="scss">
    .modify-header-modal {
        .footer-button {
            display: flex;
            justify-content: center;
            button {
                width: 120px;
            }
        }
    }
    .cropper-content {
        width: auto;
        height: 300px;
    }
</style>