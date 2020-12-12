<template>
    <div class="dictionary-table-component">
        <div
            v-if="dictionaryInfo"
            class="dictionary-info"
        >
            <span>{{ dictionaryInfo.name }}</span>
            <span>{{ dictionaryInfo.sign }}</span>
            <div v-if="dictionaryInfo.description">
                <span>字典描述</span>
                <span>{{ dictionaryInfo.description }}</span>
            </div>
            <el-button
                size="mini"
                round
                @click="showAddFieldModal"
            >
                添加字段
            </el-button>
        </div>
        <el-table
            :data="fieldList"
        >
            <el-table-column
                property="fieldName"
                label="字段名称"
            />
            <el-table-column
                property="fieldCode"
                label="字段标识"
            />
            <el-table-column
                property="fieldExtraCode"
                label="字段拓展标识"
            />
            <el-table-column
                property="remark"
                label="备注"
            />
            <el-table-column
                width="100px"
                label="操作"
            >
                <template slot-scope="scope">
                    <i
                        class="el-icon-edit-outline"
                        title="编辑"
                        @click="startModifyField(scope.row)"
                    />
                    <el-popconfirm
                        popper-class="delete-dictionary-pop-confirm"
                        confirm-button-text='确认'
                        icon="el-icon-info"
                        icon-color="red"
                        title="是否确认删除字段？"
                        @onConfirm="deleteDictionaryField(scope.row)"
                    >
                        <i
                            slot="reference"
                            class="el-icon-delete"
                        />
                    </el-popconfirm>
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
        <modifyFieldModal
            :visible.sync="isShowModifyFieldModal"
            :data="chosenField"
            :dictionaryInfo="dictionaryInfo"
            @onChange="onUpdateField"
        />
    </div>
</template>

<script>
    import modifyFieldModal from './modifyFieldModal.vue';
    import { queryDictionaryFieldList, deleteDictionaryField } from '@request';

    const initPageConfig = {
        page: 1,
        pageSize: 10,
        total: 0
    };

    export default {
        name: 'my-article-table',
        components: {
            modifyFieldModal
        },
        props: {
            dictionaryInfo: {
                type: Object,
                default: null
            }
        },
        data () {
            return {
                pageConfig: {
                    ...initPageConfig
                },
                isSubmitting: false,                // 是否正在提交
                fieldList: [],                      // 文章列表
                isShowModifyFieldModal: false,      // 是否显示修改字段弹窗
                chosenField: null,
            }
        },
        methods: {
            showAddFieldModal() {
                this.chosenField = null;
                this.isShowModifyFieldModal = true;
            },
            startModifyField(fieldInfo) {
                this.chosenField = fieldInfo;
                this.isShowModifyFieldModal = true;
            },
            // 获取字典字段列表
            getFieldList (pageConfig) {
                console.log(' this.dictionaryInfo',  this.dictionaryInfo)
                const config = {
                    ...this.pageConfig,
                    ...pageConfig
                };
                const { page, pageSize } = config;
                const params = {
                    dicId: this.dictionaryInfo.id,
                    page,
                    pageSize,
                    status: 'on'
                };
                queryDictionaryFieldList(params)
                    .then(result => {
                        const { content, total } = result;
                        this.fieldList = content;
                        this.pageConfig.total = total;
                        this.pageConfig.page = config.page;
                        this.pageConfig.pageSize = config.pageSize;
                    });
            },
            onPageChange (page) {
                this.getFieldList({ page });
            },
            transformArticleStatus (code) {
                const codeTransfer = {
                    on: '在线',
                    off: '离线'
                };
                return codeTransfer[code] || '--';
            },
            // 更新字段信息后执行，刷新列表
            onUpdateField(updateInfo) {
                const { type } = updateInfo;
                let pageConfig = { ...this.pageConfig };
                if (type === 'add') pageConfig = { ...initPageConfig }
                this.getFieldList(pageConfig);
            },
            // 删除字段
            deleteDictionaryField(fieldInfo) {
                const requestParams = {
                    id: fieldInfo.id
                }
                deleteDictionaryField(requestParams)
                    .then(result => {
                        this.message.success({ message: '字段删除成功' });
                        this.getFieldList({ ...initPageConfig });
                    });
            }
        },
        created () {

        },
        watch: {
            dictionaryInfo: {
                deep: true,
                handler(newValue) {
                    this.getFieldList(initPageConfig);
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .dictionary-table-component {
        i {
            cursor: pointer;
        }

        .pagination {
            display: flex;
            justify-content: flex-end;
        }
        .dictionary-info {
            position: relative;
            padding: 10px 100px 0 0;
            > span {
                line-height: 30px;
                &:first-child {
                    display: inline-block;
                    font-weight: 600;
                    font-size: 16px;
                    margin-right: 10px;
                }
            }
            > button {
                position: absolute;
                right: 5px;
                top: 5px;
            }
        }
    }
</style>