<template>
    <div class="upload-then-crop-image-component">
        <el-upload
            v-show="currentStep === 0"
            :class="`inner-upload ${uploadClass}`"
            action=""
            drag
            :auto-upload="false"
            :show-file-list="false"
            :on-change="changeUpload"
        >
            <i class="el-icon-upload" />
            <div class="el-upload__text">点击上传</div>
            <div class="el-upload__tip">支持绝大多数图片格式，单张图片最大支持{{maxSize}}MB</div>
        </el-upload>
        <div
            :class="`cropper-content ${cropClass}`"
            v-show="currentStep === 1"
        >
            <vue-cropper
                ref="cropper"
                :img="imageUrl"
                :outputSize="cropParams.size"
                :outputType="cropParams.outputType"
                :info="cropParams.info"
                :full="cropParams.full"
                :canMoveBox="cropParams.canMoveBox"
                :original="cropParams.original"
                :autoCrop="cropParams.autoCrop"
                :fixed="cropParams.fixed"
                :fixedNumber="cropParams.fixedNumber"
                :centerBox="cropParams.centerBox"
                :infoTrue="cropParams.infoTrue"
                :fixedBox="cropParams.fixedBox"
                :autoCropWidth="cropParams.autoCropWidth"
                :autoCropHeight="cropParams.autoCropHeight"
            />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'chooseThenCropImage',        // 上传并裁剪图片组件
        props: {
            maxSize: {                      // 允许上传的文件大小 默认 3M
                type: Number,
                default: 3
            },
            uploadClass: {                  // 上传组件类名
                type: String,
                default: ''
            },
            cropClass: {                    // 裁剪组件类名
                type: String,
                default: ''
            },
            cropOptions: {                  // 裁剪组件选项
                type: Object,
                default: () => ({})
            }

        },
        data () {
            return {
                currentStep: 0,             // 当前操作步骤 0 上传 1 裁剪
                imageUrl: '',               // 临时存储的图片地址
                cropDefaultOptions: {       // 裁剪组件默认选项
                    info: true,             // 裁剪框的大小信息
                    outputSize: 1,          // 裁剪生成图片的质量
                    outputType: 'jpeg',     // 裁剪生成图片的格式
                    canScale: true,         // 图片是否允许滚轮缩放
                    autoCrop: true,         // 是否默认生成截图框
                    autoCropWidth: '200',   // 默认生成截图框宽度
                    autoCropHeight: '200',  // 默认生成截图框高度
                    fixedBox: true,         // 固定截图框大小 不允许改变
                    fixed: true,            // 是否开启截图框宽高固定比例
                    fixedNumber: [1, 1],    // 截图框的宽高比例
                    full: false,            // 是否输出原图比例的截图
                    canMoveBox: true,       // 截图框能否拖动
                    original: false,        // 上传图片按照原始比例渲染
                    centerBox: true,        // 截图框是否被限制在图片里面
                    infoTrue: false         // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
                }
            }
        },
        methods: {
            // 上传图片后执行
            changeUpload(file) {
                const isLimitSize = file.size / 1024 / 1024 <= this.maxSize;
                if (!isLimitSize) return this.$message.error(`上传文件大小不能超过${this.maxSize}MB!`);
                // 上传成功后将图片地址赋值给裁剪框显示图片
                const localUrl = URL.createObjectURL(file.raw);
                this.imageUrl = localUrl;
                this.currentStep = 1;
            },
            // 获取裁剪后的图片结果 供外部组件调用
            nextStep () {
                return new Promise((resolve, reject) => {
                    if (this.currentStep === 0) return reject('请先选择图片');
                    try {
                        this.$refs.cropper.getCropBlob(blobData => {
                            resolve(blobData);
                        });
                    } catch (error) {
                        reject(error);
                    };
                })
            },
            // 重置组件
            resetComponent () {
                this.imageUrl = '';
                this.currentStep = 0;
            }
        },
        computed: {
            cropParams () {
                return {
                    ...this.cropDefaultOptions,
                    ...this.cropOptions
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .upload-then-crop-image-component {
        .inner-upload {
            width: 100%;
            /deep/ .el-upload {
                width: 100%;
                .el-upload-dragger {
                    width: 100%;
                }
            }
        }
        .cropper-content {
            width: auto;
            height: 300px;
        }
    }
</style>