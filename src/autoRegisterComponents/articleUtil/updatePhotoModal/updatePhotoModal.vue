<template>
    <el-dialog
        center
        custom-class="update-image-modal"
        title="更新图片信息"
        :visible="isShow"
        destroy-on-close
        :show-close="false"
        append-to-body
    >
        <el-form
            :model="formData"
            :rules="rules"
            ref="formRef"
            class="update-image-form"
            labelWidth="80px"
        >
            <el-form-item
                label="图片名称"
                prop="fileName"
            >
                <el-input
                    v-model="formData.fileName"
                    :maxLength="fieldMaxLength"
                />
            </el-form-item>
            <el-form-item
                label="图片标签"
                prop="tags"
            >
                <el-select
                    v-model="formData.tags"
                    multiple
                    collapse-tags
                    placeholder="请选择图片标签"
                >
                    <el-option
                        v-for="categoryInfo in category"
                        :key="categoryInfo.id"
                        :value="categoryInfo.fieldCode"
                        :label="categoryInfo.fieldName"
                    />
                </el-select>
            </el-form-item>
        </el-form>
        <div
            class="footer flex-content-x-center"
            slot="footer"
        >
            <el-button
                @click="isShow = false"
            >
                取消
            </el-button>
            <el-button
                type="primary"
                @click="validateThenSubmitForm"
            >
                确认
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { updatePhoto, queryDictionaryFieldList } from '@request';
    import storageNameSpace from '@nameSpace/storageNameSpace';
    const initFormData = {
        fileName: '',                   // 图片名称
        tags: [],                       // 图片分类
    };

    export default {
        name: 'update-photo-modal',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object,
                default: null
            },
            category: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                fieldMaxLength: 30,
                isShow: this.visible,           // 是否展示弹窗
                formData: { ...initFormData },  // 表单信息
                rules: {
                    name: [
                        { required: true, message: '请输入图片名称' },
                        { pattern: this.utils.regExp.letterChineseNumberUnderLine, message: '图片名称只能使用中文、字母、数字、下划线' }
                    ]
                },
            }
        },
        methods: {
            // 验证后提交表单
            validateThenSubmitForm () {
                this.$refs.formRef.validate()
                    .then(result => {
                        this.requestUpdatePhoto();
                    });
            },
            requestUpdatePhoto() {
                const { fileName, tags } = this.formData
                const requestParams = this.utils.getExistFieldFromParams({
                    fileName,
                    tags: tags.join(','),
                    id: this.data.id
                });
                updatePhoto(requestParams)
                    .then(result => {
                        this.message.success({ message: '图片信息更新成功' });
                        this.isShow = false;
                        // 通知父组件修改成功
                        this.$emit('change', {
                            type: 'update',
                            result
                        });
                    });
            }
        },
        watch: {
            isShow (newValue) {
                this.$emit('update:visible', newValue);
            },
            visible (newValue) {
                if (newValue && this.data) {
                    const { tags, fileName } = this.data;
                    this.formData = {
                        ...initFormData,
                        fileName,
                        tags: (tags && tags.split(',')) || []
                    };

                } else this.formData = { ...initFormData };
                this.isShow = newValue;
            }
        }
    }
</script>

<style lang="scss">
    .update-image-modal {
        min-width: 375px;
        max-width: 450px;
        .el-dialog__body {
            padding-bottom: 0;
        }
        .update-image-form {
            padding-right: 5px;
        }
    }
</style>