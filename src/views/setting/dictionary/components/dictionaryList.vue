<template>
    <div class="dictionary-list-component">
        <el-input
            placeholder="请输入搜索内容"
            prefix-icon="el-icon-search"
            v-model="keyword"
            @change="searchDictionaryDelay"
        />
        <scroll-load
            custom-class="dictionary-scroll-load"
            :is-finish="isNoMore"
            :load="queryDictionaryList"
        >
            <ul class="dictionary-list">
                <li
                    v-for="(dictionaryInfo, dictionaryIndex) in dictionaryList"
                    :class="{'active': selectedIndex === dictionaryIndex}"
                    :key="dictionaryInfo.id"
                >
                    <p class="one-line-text">
                        <span
                            class="dictionary-name"
                            @click="chooseDictionary(dictionaryInfo, dictionaryIndex)"
                        >
                            {{ dictionaryInfo.name }}
                        </span>
                    </p>
                    <div
                        v-if="dictionaryInfo.userId === localUserId"
                        class="icon-button"
                    >
                        <i
                            class="el-icon-edit-outline"
                            @click="startModifyDictionary(dictionaryInfo, dictionaryIndex)"
                        />
                        <el-popconfirm
                            popper-class="delete-dictionary-pop-confirm"
                            confirm-button-text='确认'
                            icon="el-icon-info"
                            icon-color="red"
                            title="是否确认删除字典？"
                            @onConfirm="deleteDictionary(dictionaryInfo)"
                        >
                            <i
                                slot="reference"
                                class="el-icon-delete"
                            />
                        </el-popconfirm>
                    </div>
                </li>
            </ul>
        </scroll-load>
        <el-button
            size="mini"
            @click="startAddDictionary"
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
    import { queryDictionaryList, deleteDictionary } from '@request';
    import storageNameSpace from '../../../../../config/nameSpace/storageNameSpace';

    const initPageConfig = {
        page: 1,
        pageSize: 15
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
                isNoMore: false,                            // 是否加载完成
                timer: null,
                isLoading: false,                           // 是否正在加载
                selectedIndex: 0,                           // 选中字典索引
                localUserId: '',                            // 本地用户id
            };
        },
        methods: {
            // 查询字典列表
            queryDictionaryList(isReset) {
                this.pageConfig.page ++;
                this.pageConfig = isReset ? { ...initPageConfig } : this.pageConfig;
                const { page, pageSize } = this.pageConfig;
                const requestParams = {
                    page,
                    pageSize,
                    keyword: this.keyword
                };
                return queryDictionaryList(requestParams)
                    .then(result => {
                        const { page, pageSize } = this.pageConfig;
                        const { content, total } = result;
                        this.dictionaryList = isReset ? content : this.dictionaryList.concat(content);
                        this.isNoMore = (page * pageSize) >= total;
                        if (isReset && content && content.length) this.chooseDictionary(content[0], 0);
                        else if (isReset && (!content || !content.length)) this.chooseDictionary(null);
                    });
            },
            // 修改字典后需要重新获取列表
            onChangeDictionaryList(changeInfo) {
                this.queryDictionaryList(true);
            },
            // 删除字典
            deleteDictionary(dictionaryInfo) {
                const requestParams = {
                    id: dictionaryInfo.id
                };
                deleteDictionary(requestParams)
                    .then(result => {
                        this.message.success({ message: '字典删除成功' });
                        this.queryDictionaryList(true);
                    })
            },
            // 开始新增字典
            startAddDictionary() {
                this.dictionaryInfoEditing = null;
                this.isShowModifyDictionaryModal = true;
            },
            // 开始编辑字典信息
            startModifyDictionary(dictionaryInfo, dictionaryIndex) {
                this.dictionaryInfoEditing = dictionaryInfo;
                this.isShowModifyDictionaryModal = true;
            },
            // 延迟搜索字典
            searchDictionaryDelay() {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }
                this.timer = setTimeout(() => {
                    this.queryDictionaryList(true);
                }, 200);
            },
            // 选中字典
            chooseDictionary(dictionary, dictionaryIndex) {
                this.selectedIndex = dictionaryIndex;
                this.$emit('choose', dictionary);
            },
            // 获取本地用户id
            getLocalUserId() {
                const localUserInfo = localStorage.getItem(storageNameSpace.userInfo);
                if (localUserInfo) {
                    this.localUserId = JSON.parse(localUserInfo).userId;
                }
            }
        },
        computed: {

        },
        created() {
            this.queryDictionaryList(true);
            this.getLocalUserId();
        },
        beforeDestroy() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dictionary-list-component {
        .dictionary-scroll-load {
            max-height: 400px;
        }
        .dictionary-list {
            margin-top: 10px;
            >li {
                &.active {
                    background: #E4E4E4;
                }
                .dictionary-name {
                    cursor: pointer;
                }
                position: relative;
                padding-right: 50px;
                padding-left: 10px;
                height: 40px;
                line-height: 40px;
                .icon-button {
                    position: absolute;
                    right: 10px;
                    top: 0;
                    i {
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>

<style lang="scss">
    .delete-dictionary-pop-confirm {
        .el-popconfirm__action {
            margin-top: 10px;
        }
    }
</style>