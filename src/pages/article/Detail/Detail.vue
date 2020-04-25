<template>
    <div class="w article-detail">
        <p>{{articleDetail.title}}</p>
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
        p {
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