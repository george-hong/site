<template>
    <div class="my-article-table-component">
        <el-table
            :data="articleList"
        >
            <el-table-column
                property="title"
                label="标题"
            >
                <template slot-scope="scope">
                    <router-link :to="`/article/detail/${scope.row.id}`">{{ scope.row.title }}</router-link>
                </template>
            </el-table-column>
            <el-table-column
                property="createTime"
                label="发布时间"
            >
                <span slot-scope="scope">{{ scope.row.createTime | dayTime }}</span>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span>{{ transformArticleStatus(scope.row.status) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                width="100px"
                label="操作"
            >
                <template slot-scope="scope">
                    <i
                        class="el-icon-edit-outline"
                        title="编辑"
                        @click="linkToEditArticle(scope)"
                    />
                    <i
                        :class="scope.row.status === 'on' ? 'el-icon-lock' : 'el-icon-unlock'"
                        :title="scope.row.status === 'on' ? '下线' : '上线'"
                        @click="changeArticleStatus(scope.row)"
                    />
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                :current-page.sync="pageConfig.page"
                :page-size="pageConfig.pageSize"
                :total="pageConfig.total"
                layout="prev, pager, next"
                @current-change="onPageChange"
                hide-on-single-page
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import { getArticleList, changeArticleStatus } from '@request';

    export default {
        name: 'myArticleTable',
        props: {
            userInfo: {
                type: Object
            }
        },
        data () {
            return {
                pageConfig: {
                    page: 1,
                    pageSize: 10,
                    total: 0
                },
                articleList: [],        // 文章列表
                isSubmitting: false     // 是否正在提交
            }
        },
        methods: {
            // 获取用户文章列表
            getMyArticleList (pageConfig) {
                const config = {
                    ...this.pageConfig,
                    ...pageConfig
                };
                const { page, pageSize } = config;
                const params = {
                    page,
                    pageSize,
                    authorId: this.userInfo.userId
                };
                getArticleList(params)
                    .then(result => {
                        const { content, total } = result;
                        this.articleList = content;
                        this.pageConfig.total = total;
                    })
            },
            // 跳转到文章编辑
            linkToEditArticle (scope) {
                this.$router.push({
                    name: 'articleEdit',
                    query: {
                        id: scope.row.id
                    }
                })
            },
            onPageChange (page) {
                this.getMyArticleList({ page });
            },
            transformArticleStatus (code) {
                const codeTransfer = {
                    on: '在线',
                    off: '离线'
                };
                return codeTransfer[code] || '--';
            },
            // 变更文章状态
            changeArticleStatus (articleInfo) {
                if (this.isSubmitting) return;
                this.isSubmitting = true;
                const requestParams = {
                    id: articleInfo.id,
                    status: articleInfo.status === 'on' ? 'off' : 'on'
                };
                changeArticleStatus(requestParams)
                    .then(result => {
                        this.message.success({ message: '状态更新成功' });
                        this.getMyArticleList();
                    })
                    .finally(() => {
                        this.isSubmitting = false;
                    });
            }
        },
        created () {

        },
        watch: {
            'userInfo.userId' (value) {
                if (value >= 0) this.getMyArticleList();
            }
        }
    }
</script>

<style scoped lang="scss">
    .my-article-table-component {
        i {
            cursor: pointer;
        }

        .pagination {
            display: flex;
            justify-content: flex-end;
        }
    }
</style>