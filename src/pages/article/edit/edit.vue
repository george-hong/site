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
        <!--    工具箱    -->
        <article-util />
    </div>
</template>

<script>
    import { mavonEditor } from "mavon-editor";
    import { mapState } from 'vuex';
    import request from '@request';
    import "mavon-editor/dist/css/index.css";
    export default {
        components: {
            mavonEditor
        },
        data() {
            return {
                isSubmitting: false, // 是否正在提交
                isSubmitted: false,  // 是否提交完成
                content: '',
                form: {
                    title: '',
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
            releaseArticle(isValied) {
                this.$refs.form.validate(isValied => {
                    if (this.isSubmitting || this.isSubmitted) return;
                    const tipTitle = '表单验证未通过';
                    const { userInfo, content } = this; 
                    if (!isValied) return this.message.warning({ title: tipTitle, message: '请重新检查' });
                    if (!content) return this.message.warning({ title: tipTitle, message: '文章内容不能为空' });
                    if (!userInfo) return this.message.warning({ title: '请先登录', message: '登录后才能发表文章' });
                    this.isSubmitting = true;
                    const requestParams = {
                        title: this.form.title,
                        content: this.content,
                        author: userInfo.userName,
                        authorId: userInfo.userId,
                    };
                    this.isLoading = true;
                    request.editArticle(requestParams)
                        .then(result => {
                            console.log(result);
                            this.isSubmitted = true;
                            this.onSubmitSuccess(result);
                        })
                        .catch(err => {
                            console.log(err);
                            
                        })
                        .finally(() => {
                            this.isSubmitting = false;
                        })
                });
            },
            onSubmitSuccess(result) {
                // 成功后给出提示并跳转到详情页
                const { id } = result;
                this.message.success({ title: '上传成功' });
                this.$router.push({
                    name: 'articleDetail',
                    params: { id },
                });
            }
        },
        mounted() {

        },
        computed: {
            ...mapState(['userInfo'])
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
        /deep/ .v-note-wrapper {
            border: none;
            z-index: 8;
        }
    }
</style>