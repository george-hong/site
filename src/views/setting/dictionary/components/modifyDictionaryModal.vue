<template>
    <el-dialog
        center
        custom-class="modify-dictionary-modal"
        :title="data ? '编辑字典' : '新增字典'"
        :visible="isShow"
        destroy-on-close
        :show-close="false"
    >
        <el-form
            :model="formData"
            :rules="rules"
            ref="formRef"
            class="modify-dictionary-form"
            labelWidth="80px"
        >
            <el-form-item
                label="字典名称"
                prop="name"
            >
                <el-input
                    v-model="formData.name"
                    :maxLength="fieldMaxLength"
                />
            </el-form-item>
            <el-form-item
                label="字典标识"
                prop="sign"
            >
                <el-input
                    v-model="formData.sign"
                    :maxLength="fieldMaxLength"
                    :disabled="!!data"
                />
            </el-form-item>
            <el-form-item
                label="是否公开"
                prop="isPublic"
            >
                <el-select
                    v-model="formData.isPublic"
                >
                    <el-option
                        label="公开"
                        value="1"
                    />
                    <el-option
                        label="不公开"
                        value="0"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                label="字典描述"
                prop="description"
                :maxLength="remarkMaxLength"
            >
                <el-input v-model="formData.description" />
            </el-form-item>
        </el-form>
        <div
            class="footer flex-content-x-center"
            slot="footer"
        >
            <el-button
                @click="isShow = false"
                :disabled="isLoading"
            >
                取消
            </el-button>
            <el-button
                type="primary"
                @click="validateThenSubmitForm"
                :loading="isLoading"
            >
                确认
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { createDictionary, updateDictionary } from '@request';

    const initFormData = {
        name: '',                   // 字典名称
        sign: '',                   // 字典标识
        description: '',            // 字典描述
        isPublic: '1',              // 是否公开
    };

    export default {
        name: 'modify-dictionary-modal',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object,
                default: null
            }
        },
        data () {
            return {
                fieldMaxLength: 30,
                remarkMaxLength: 100,
                isShow: this.visible,           // 是否展示弹窗
                formData: { ...initFormData },  // 表单信息
                isLoading: false,               // 是否正在加载
                rules: {
                    name: [
                        { required: true, message: '请输入字典名称' },
                        { pattern: this.utils.regExp.letterOrChineseAndNotStartWithNumber, message: '字典名称只能使用中文、字母、数字，且不能以数字开头' },
                    ],
                    sign: [
                        { required: true, message: '请输入字典标识' },
                        { pattern: this.utils.regExp.LetterNumberUnderline, message: '字典标识只能使用字母、数字、下划线' },
                    ],
                    isPublic: [
                        { required: true, message: '请选择是否公开' },
                    ]
                },
            }
        },
        methods: {
            // 验证后提交表单
            validateThenSubmitForm () {
                this.$refs.formRef.validate()
                    .then(result => {
                        if (this.data) this.requestUpdateDictionary();
                        else this.requestCreateDictionary();
                    });
            },
            requestCreateDictionary () {
                const requestParams = {
                    ...this.formData
                };
                this.isLoading = true;
                createDictionary(requestParams)
                    .then(result => {
                        this.message.success({ message: '字典新增成功' });
                        this.isShow = false;
                        // 通知父组件修改成功
                        this.$emit('onChange', {
                            type: 'modify',
                            result
                        });
                    })
                    .finally(() => {
                        this.isLoading = false;
                    })
            },
            requestUpdateDictionary() {
                const { name, description, isPublic } = this.formData
                const requestParams = {
                    name,
                    description,
                    isPublic,
                    id: this.data.id
                };
                this.isLoading = true;
                updateDictionary(requestParams)
                    .then(result => {
                        this.message.success({ message: '字典编辑成功' });
                        this.isShow = false;
                        // 通知父组件修改成功
                        this.$emit('onChange', {
                            type: 'add',
                            result
                        });
                    })
                .finally(() => {
                    this.isLoading = false;
                });
            }
        },
        watch: {
            isShow (newValue) {
                this.$emit('update:visible', newValue);
            },
            visible (newValue) {
                if (newValue && this.data) {
                    this.formData = {
                        ...initFormData,
                        ...this.data
                    }
                } else this.formData = { ...initFormData };
                this.isShow = newValue;
            }
        }
    }
</script>

<style lang="scss">
    .modify-dictionary-modal {
        min-width: 375px;
        max-width: 450px;
        .el-dialog__body {
            padding-bottom: 0;
        }
        .modify-dictionary-form {
            padding-right: 5px;
        }
        .el-select {
            width: 100%;
        }
    }
</style>