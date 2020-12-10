<template>
    <div class="dictionary-list-component">
        <el-input
            placeholder="请输入搜索内容"
            prefix-icon="el-icon-search"
        />
        <ul class="dictionary-list">
            <li
                v-for="(dictionaryInfo, dictionaryIndex) in dictionaryList"
                :key="dictionaryInfo.id"
            >
                <p class="one-line-text">{{ dictionaryInfo.name }}</p>
                <div class="icon-button">
                    <i class="el-icon-edit-outline" />
                    <i class="el-icon-delete" />
                </div>
            </li>
        </ul>
        <el-button
            size="mini"
            @click="showModifyDictionaryModal"
        >
            <span>添加字典</span>
        </el-button>
        <modify-dictionary-modal
            :visible.sync="isShowModifyDictionaryModal"
            :data="dictionaryInfoEditing"
            @onChange="onChangeDictionaryList"
        />
    </div>
</template>

<script>
    import modifyDictionaryModal from './modifyDictionaryModal.vue';
    import { queryDictionaryList } from '@request';

    const initPageConfig = {
        page: 1,
        pageSize: 10
    };

    export default {
        name: 'dictionary-list-component',
        components: {
            modifyDictionaryModal
        },
        data () {
            return {
                isShowModifyDictionaryModal: false,         // 是否打开字典编辑弹窗
                dictionaryInfoEditing: null,                // 当前正在编辑的字典信息
                pageConfig: {                               // 分页配置
                    ...initPageConfig
                },
                keyword: '',                                // 搜索关键字
                dictionaryList: [],                         // 字典列表
            };
        },
        methods: {
            showModifyDictionaryModal() {
                this.isShowModifyDictionaryModal = true;
            },
            // 查询字典列表
            queryDictionaryList(isReset) {
                this.pageConfig = isReset ? { ...initPageConfig } : this.pageConfig;
                const { page, pageSize } = this.pageConfig;
                const requestParams = {
                    page,
                    pageSize,
                    keyword: this.keyword
                };
                queryDictionaryList(requestParams)
                    .then(result => {
                        const { content, total } = result;
                        this.dictionaryList = isReset ? content : this.dictionaryList.concat(content);
                    });
            },
            // 修改字典后需要重新获取列表
            onChangeDictionaryList(changeInfo) {
                this.queryDictionaryList(true);
            }
        },
        computed: {

        },
        created () {
            this.queryDictionaryList();
        }
    }
</script>

<style lang="scss" scoped>
    .dictionary-list-component {
        .dictionary-list {
            margin-top: 10px;
            >li {
                position: relative;
                padding-right: 50px;
                padding-left: 10px;
                height: 40px;
                line-height: 40px;
                .icon-button {
                    position: absolute;
                    right: 10px;
                    top: 0;
                }
            }
        }
    }
</style>