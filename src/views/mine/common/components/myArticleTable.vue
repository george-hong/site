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
            <el-table-column
                property="status"
                label="状态"
            />
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
                    <i class="el-icon-unlock" />
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
    import { getArticleList } from '@request';
    import { stateNameSpace } from '@nameSpace/storeNameSpace';

    export default {
        name: 'myArticleTable',
        props: {
            userInfo: {
                type: Object
            }
        },
        data() {
            return {
                pageConfig: {
                    page: 1,
                    pageSize: 10,
                    total: 0
                },
                articleList: [],        // 文章列表
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
                    authorId: this.userInfo.id
                };
                console.log('params', params)
                getArticleList(params)
                    .then(result => {
                        console.log('my', result)
                        const { content, total } = result;
                        this.articleList = content;
                        this.pageConfig.total = total;
                    })
            },
            // 跳转到文章编辑
            linkToEditArticle (articleInfo) {
                this.$router.push({
                    name: 'articleEdit',
                    query: {
                        id: articleInfo.id
                    }
                })
            },
            onPageChange (page) {
                this.getMyArticleList({ page });
            }
        },
        created() {

        },
        watch: {
            'userInfo.id'(value) {
                console.log('id', value)
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