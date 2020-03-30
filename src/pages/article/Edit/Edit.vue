<template>
    <div class="w article-edit clearfix">
        <el-form
            ref="form"
            label-width="80px"
            :model="form"
            :rules="rules"
        >
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-row :gutter="10">
                <el-col :xs="24" :sm="12">
                    <el-form-item label="发布时间">
                        <el-date-picker
                            v-model="form.createTime"
                            type="datetime"
                            placeholder="选择发布时间"
                            style="width: 100%"
                            disabled
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="更新时间">
                        <el-date-picker
                            v-model="form.updateTime"
                            type="datetime"
                            placeholder="选择更新时间"
                            style="width: 100%"
                            disabled
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <p class="content-title">文章内容</p>
        <mavon-editor
            v-model="content"
        ></mavon-editor>
        <el-button
            type="primary"
            class="fr"
            @click="releaseArticle"
        >
            <i class="el-icon-upload el-icon--right"></i>
            发布
        </el-button>
    </div>
</template>

<script>
    import { mavonEditor } from "mavon-editor";
    import "mavon-editor/dist/css/index.css";
    export default {
        components: {
            mavonEditor
        },
        data() {
            return {
                content: '',
                form: {
                    title: '',
                    createTime: new Date(),
                    updateTime: new Date(),
                },
                rules: {
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' },
                        { min: 3, max: 30, message: '标题长度应在3-30之间', trigger: 'blur' },
                    ]
                }
            }
        },
        methods: {
            showNotice(message, title) {
                this.$notify({
                    title: title || '表单验证未通过',
                    message: message || '请重新检查',
                    duration: 3000,
                    type: 'warning',
                });
            },
            releaseArticle(isValied) {
                this.$refs.form.validate(isValied => {
                    if (!isValied) return this.showNotice();
                    if (!this.content) return this.showNotice('文章内容不能为空');
                    console.log('ok');
                });
            }
        },
        mounted() {

        }
    }
</script>

<style lang="scss" scoped>
    .article-edit {
        padding: 20px 0;
        .content-title {
            line-height: 40px;
            padding-left: 10px;
        }
        .markdown-body {
            min-height: 600px;
            margin-bottom: 20px;
        }
    }
</style>