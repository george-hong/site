<template>
    <div class="w article-detail">
        <h2 class="article-title">{{articleDetail.title}}</h2>
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
    import request from '@request';
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
                articleDetail: {
                    title: '',
                    content: '',
                    author: '',
                    createTimeString: '',
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
            }
        },
        created() {
            this.getArticleDetail();
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