<template>
    <div class="w article-detail">
        <h2 class="article-title">{{articleDetail.title}}</h2>
        <p v-if="articleCategory">
            <span>文章分类:</span>
            <span>{{ articleCategory }}</span>
        </p>
        <p>
            <span>{{articleDetail.author}}</span>
            <span>发布于:</span>
            <span>{{articleDetail.createTimeString}}</span>
        </p>
        <mavon-editor v-model="articleDetail.content"
                      :toolbarsFlag="false"
                      :subfield="false"
                      :boxShadow="false"
                      :shortCut="false"
                      previewBackground="#FFF"
                      defaultOpen="preview"></mavon-editor>
    </div>
</template>

<script>
    import request, { queryDictionaryFieldList } from '@request';
    import format from '@format';
    import dayjs from 'dayjs';
    import { mavonEditor } from "mavon-editor";
    import "mavon-editor/dist/css/index.css";

    export default {
        components: {
            mavonEditor
        },
        data() {
            return {
                pageState: '',
                articleCategoryOptions: [],     // 文章分类选项
                articleDetail: {
                    title: '',
                    content: '',
                    author: '',
                    createTimeString: '',
                    category: ''
                }
            };
        },
        methods: {
            getArticleDetail() {
                const { id } = this.$route.params;
                const requestParams = {
                    id,
                };
                request.queryArticle(requestParams)
                    .then(result => {
                        // 更新时间格式
                        const { createTime } = result;
                        if (createTime) {
                            result.createTimeString = dayjs(createTime).format(format.dateTimeFormat);
                        }
                        Object.assign(this.articleDetail, result)
                    })
                    .catch(err => {
                        this.pageState = 'err';
                    });
            },
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
        computed: {
            articleCategory() {
                const { articleCategoryOptions, articleDetail: { category } } = this;
                if (!articleCategoryOptions.length || !category) return;
                let str = ''
                category.split(',').forEach(categoryKey => {
                    const matchItem = articleCategoryOptions.find(option => option.fieldCode === categoryKey);
                    if (matchItem) str += matchItem.fieldName;
                });
                return str;
            }
        },
        created() {
            this.getArticleDetail();
            this.getArticleCategory();
        }
    }
</script>

<style lang="scss" scoped>
    .article-detail {
        .article-title, p {
            margin-bottom: 20px;
        }
        /deep/ .v-note-op {
            display: none;
        }
        /deep/ .v-note-wrapper .v-note-panel .v-note-show .v-show-content {
            padding: 0;
        }
        /deep/ .v-note-wrapper {
            border: none;
            z-index: 8;
        }
    }
</style>