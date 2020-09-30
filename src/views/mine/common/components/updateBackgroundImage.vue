<template>
    <el-dialog
        width="500px"
        :visible.sync="isShowModal"
        title="修改背景图"
        custom-class="modify-header-modal"
        destroy-on-close
        :show-close="false"
        :close-on-click-modal="false"
    >
        <choose-then-crop-image
            ref="chooseThenCropImage"
            :crop-options="cropOptions"
        />
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
    import { stateNameSpace } from '@nameSpace/storeNameSpace';
    import chooseThenCropImage from './chooseThenCropImage.vue';

    export default {
        name: 'updateBackgroundImage',
        components: {
            chooseThenCropImage
        },
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
                cropOptions: {
                    info: true, // 裁剪框的大小信息
                    outputSize: 1, // 裁剪生成图片的质量
                    outputType: 'jpeg', // 裁剪生成图片的格式
                    canScale: true, // 图片是否允许滚轮缩放
                    autoCrop: true, // 是否默认生成截图框
                    autoCropWidth: '1000', // 默认生成截图框宽度
                    autoCropHeight: '250', // 默认生成截图框高度
                    fixedBox: true, // 固定截图框大小 不允许改变
                    fixed: true, // 是否开启截图框宽高固定比例
                    fixedNumber: [4, 1], // 截图框的宽高比例
                    full: true, // 是否输出原图比例的截图
                    canMoveBox: true, // 截图框能否拖动
                    original: true, // 上传图片按照原始比例渲染
                    centerBox: true, // 截图框是否被限制在图片里面
                    infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
                },
            };
        },
        methods: {
            // 下一步/确认
            confirm () {
                this.$refs.chooseThenCropImage
                    .nextStep()
                    .then(blobData => {
                        this.saveBackgroundImage(blobData);
                    })
                    .catch(error => {
                        this.$message.error(error);
                    });
            },
            // 取消
            cancel () {
                this.isShowModal = false;
            },
            // 保存头像
            saveBackgroundImage (blobData) {
                if (this.isUploading) return;
                this.isUploading = true;
                const formData = new FormData();
                formData.append('file', blobData, `${Date.now()}.jpg`);
                formData.append('path', 'backgroundImage');
                formData.append('type', 'backgroundImage');
                formData.append('uploaderId', this.userInfo.userId);
                api.updateUserImage(formData)
                    .then(result => {
                        if (result) {
                            this.$emit('updatedBackgroundImage', result);
                            this.message.success({ title: '成功', message: '个人背景图已修改' });
                            this.isShowModal = false;
                        }
                    })
                    .catch(err => {
                        console.log('err', err);
                    })
                    .finally(() => {
                        this.isUploading = false;
                    });
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
</style>