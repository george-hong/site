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
            <el-form-item label="文章分类" prop="category">
                <el-select
                    v-model="form.category"
                    placeholder="请选择文章分类"
                    collapse-tagsnpm
                    multiple
                >
                    <el-option
                        v-for="categoryOption in articleCategoryOptions"
                        :key="categoryOption.id"
                        :value="categoryOption.fieldCode"
                    >
                        {{ categoryOption.fieldName }}
                    </el-option>
                </el-select>
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
    import { stateNameSpace } from '@nameSpace/storeNameSpace';
    import { editArticle, queryArticle, queryDictionaryFieldList } from '@request';
    import "mavon-editor/dist/css/index.css";
    export default {
        components: {
            mavonEditor
        },
        data() {
            return {
                isEdit: this.$route.query.id !== undefined,
                isSubmitting: false, // 是否正在提交
                isSubmitted: false,  // 是否提交完成
                content: '',
                articleCategoryOptions: [],    // 文章分类选项
                form: {
                    title: '',       // 文章标题
                    category: '',    // 文章分类
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
            releaseArticle(isValidated) {
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
                        category: this.form.category.join(','),
                        content: this.content,
                        author: userInfo.userName
                    };
                    if (this.isEdit) requestParams.id = this.$route.query.id,
                    this.isLoading = true;
                    editArticle(requestParams)
                        .then(result => {
                            this.onSubmitSuccess(result);
                        })
                        .finally(() => {
                            this.isSubmitting = false;
                        });
                });
            },
            onSubmitSuccess(result) {
                if (result) {
                    this.isSubmitted = true;
                    // 成功后给出提示并跳转到详情页
                    const { id } = result;
                    this.message.success({ title: '上传成功' });
                    this.$router.push({
                        name: 'articleDetail',
                        params: { id },
                    });
                }
            },
            // 获取编辑文章的信息
            getArticleInfo() {
                const { id } = this.$route.query;
                if (id !== undefined) {
                    const requestParams = {
                        id,
                    };
                    queryArticle(requestParams)
                        .then(result => {
                            if (result) this.updatePageInfo(result);
                            else {
                                this.message.info({ title: '提示', message: '文章不存在' });
                                this.$router.push({ name: 'articleEdit' });
                            }
                        });
                } else {
                    this.content = '';
                    this.form.title = '';
                }
            },
            // 获取文章信息后更新页面信息
            updatePageInfo(articleInfo) {
                const { title, content, authorId } = articleInfo;
                // 如果不是作者给出提示并跳转页面
                if (authorId !== this.userInfo.userId) {
                    this.message.info({ title: '提示', message: '您不是文章作者，已跳转到新增文章页面' });
                    return this.$router.push({ name: 'articleEdit' });
                }
                this.content = content;
                this.form.title = title;
            },
            // 获取文章分类字典
            getArticleCategory() {
                const requestParams = {
                    page: 1,
                    pageSize: 99999,
                    dicId: 2,       // 文章分类固定id
                };
                queryDictionaryFieldList(requestParams)
                    .then(result => {
                        this.articleCategoryOptions = result.content;
                    });
            }
        },
        created() {
            this.getArticleInfo();
            this.getArticleCategory();
        },
        computed: {
            userInfo () {
                return this.$store.state[stateNameSpace.userInfo];
            }
        },
        watch: {
            // 文章id变更获取最新文章信息
            '$route.query.id'() {
                this.getArticleInfo();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .article-edit {
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