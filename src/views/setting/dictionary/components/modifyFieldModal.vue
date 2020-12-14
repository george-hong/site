<template>
    <el-dialog
        center
        custom-class="modify-field-modal"
        :title="data ? '编辑字段' : '添加字段'"
        :visible="isShow"
        destroy-on-close
        :show-close="false"
    >
        <el-form
            :model="formData"
            :rules="rules"
            ref="formRef"
            class="modify-field-form"
            labelWidth="80px"
        >
            <el-form-item
                label="字段名称"
                prop="fieldName"
            >
                <el-input
                    v-model="formData.fieldName"
                    :maxLength="fieldMaxLength"
                />
            </el-form-item>
            <el-form-item
                label="字段编码"
                prop="fieldCode"
                :maxLength="fieldMaxLength"
            >
                <el-input
                    v-model="formData.fieldCode"
                    :disabled="!!data"
                />
            </el-form-item>
            <el-form-item
                label="额外编码"
                prop="fieldExtraCode"
                :maxLength="fieldMaxLength"
            >
                <el-input v-model="formData.fieldExtraCode" />
            </el-form-item>
            <el-form-item
                label="权重"
                prop="weight"
                :maxLength="5"
            >
                <el-input v-model="formData.weight" />
            </el-form-item>
            <el-form-item
                label="备注"
                prop="remark"
                :maxLength="remarkMaxLength"
            >
                <el-input v-model="formData.remark" />
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
    import { createDictionaryField, updateDictionaryField } from '@request';

    const initFormData = {
        fieldName: '',                   // 字段名称
        fieldCode: '',                   // 字段编码
        fieldExtraCode: '',              // 字段额外编码
        weight: 0,                       // 权重
        remark: ''                       // 备注
    };

    export default {
        name: 'modify-dictionary-modal',
        props: {
            visible: {              // 弹窗是否可见
                type: Boolean,
                default: false
            },
            data: {                 // 字段信息
                type: Object,
                default: null
            },
            dictionaryInfo: {       // 字典信息
                type: Object,
                default: () => ({})
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
                    fieldName: [
                        { required: true, message: '请输入字段名称' },
                        { pattern: this.utils.regExp.letterOrChineseAndNotStartWithNumber, message: '字段名称只能使用中文、字母、数字，且不能以数字开头' },
                    ],
                    fieldCode: [
                        { required: true, message: '请输入字段编码' },
                        { pattern: this.utils.regExp.LetterNumberUnderline, message: '字段编码只能使用字母、数字、下划线' },
                    ],
                    weight: [
                        { required: true, message: '请输入权重' },
                        { pattern: this.utils.regExp.natureNumber, message: '权重请输入自然数' },
                    ],
                    fieldExtraCode: [
                        { pattern: this.utils.regExp.LetterNumberUnderline, message: '字段额外编码只能使用字母、数字、下划线' },
                    ],
                },
            }
        },
        methods: {
            // 验证后提交表单
            validateThenSubmitForm () {
                this.$refs.formRef.validate()
                    .then(result => {
                        if (this.data) this.requestUpdateDictionaryField();
                        else this.requestCreateDictionaryField();
                    });
            },
            requestCreateDictionaryField() {
                const requestParams = this.utils.getExistFieldFromParams({
                    dicId: this.dictionaryInfo.id,
                    ...this.formData
                });
                this.isLoading = true;
                createDictionaryField(requestParams)
                    .then(result => {
                        this.message.success({ message: '字段添加成功' });
                        this.isShow = false;
                        // 通知父组件修改成功
                        this.$emit('onChange', {
                            type: 'add',
                            result
                        });
                    })
                    .finally(() => {
                        this.isLoading = false;
                    })
            },
            requestUpdateDictionaryField() {
                const { fieldName, fieldExtraCode, weight, remark } = this.formData
                const requestParams = this.utils.getExistFieldFromParams({
                    dicId: this.dictionaryInfo.id,
                    fieldName,
                    fieldExtraCode,
                    weight,
                    remark,
                    id: this.data.id
                });
                this.isLoading = true;
                updateDictionaryField(requestParams)
                    .then(result => {
                        this.message.success({ message: '字段编辑成功' });
                        this.isShow = false;
                        // 通知父组件修改成功
                        this.$emit('onChange', {
                            type: 'modify',
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
    .modify-field-modal {
        min-width: 375px;
        max-width: 450px;
        .el-dialog__body {
            padding-bottom: 0;
        }
        .modify-field-form {
            padding-right: 5px;
        }
    }
</style>