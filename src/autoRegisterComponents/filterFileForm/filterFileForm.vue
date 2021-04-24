<template>
    <div class="filter-area">
        <div class="filter-item">
            <span>筛选条件</span>
            <el-select
                class="type-condition"
                v-model="filterType"
            >
                <el-option
                    v-for="option in filterOptions"
                    :label="option.label"
                    :value="option.value"
                    :key="option.value"
                />
            </el-select>
        </div>
        <div
            v-show="filterType !== 'tags'"
            class="filter-item"
        >
            <span>时间范围</span>
            <el-date-picker
                v-model="timeRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
            />
        </div>
        <div
            v-show="filterType === 'tags'"
            class="filter-item"
        >
            <span>文件标签</span>
            <el-select
                v-model="tags"
                multiple
                collapse-tags
                placeholder="请选择图片标签"
            >
                <el-option
                    v-for="categoryInfo in tagCategoryList"
                    :key="categoryInfo.id"
                    :value="categoryInfo.fieldCode"
                    :label="categoryInfo.fieldName"
                />
            </el-select>
        </div>
        <div>
            <span style="visibility: hidden">-</span>
            <el-button
                type="primary"
                @click="changeCondition"
            >
                过滤
            </el-button>
        </div>
    </div>
</template>

<script>
    import storageNameSpace from '@nameSpace/storageNameSpace';
    import { queryDictionaryFieldList } from '@request';
    import dayjs from 'dayjs';

    const filterOptions = [
        { label: '上传时间', value: 'createTime' },
        { label: '更新时间', value: 'updateTime' },
        { label: '文件标签', value: 'tags' },
    ];

    export default {
        name: 'filter-file-form',
        data() {
            const currentTime = new Date();
            const startTime = currentTime.getTime() - (3600000 * 24 * 7);

            return {
                filterOptions: { ...filterOptions },
                filterType: filterOptions[0].value,
                timeRange: [startTime, new Date()],
                tagCategoryList: [],                        // 图片分类标签
                tags: [],
            }
        },
        methods: {
            // 获取用户相册分类字典
            getAlbumCategory() {
                const localUserInfo = this.getLocalUserInfo();
                if (!localUserInfo || !(localUserInfo.albumDicId >= 0)) return this.message.info({ message: '您尚未绑定图片分类字典' });
                const { albumDicId } = localUserInfo;
                const requestParams = {
                    page: 1,
                    pageSize: 99999,
                    dicId: albumDicId
                };
                queryDictionaryFieldList(requestParams)
                    .then(result => {
                        const { content } = result;
                        this.tagCategoryList = content;
                    });
            },
            getLocalUserInfo() {
                let localUserInfo = localStorage.getItem(storageNameSpace.userInfo);
                if (!localUserInfo) {
                    this.message.info({ message: '未获取到用户信息,请重新登录' });
                    return null;
                }
                return JSON.parse(localUserInfo);
            },
            changeCondition () {
                const condition = this.getCondition();
                this.$emit('change', condition);
            },
            // 获取参数
            getCondition() {
                const { filterType, tags, timeRange } = this;
                const startTimePart = '00:00:00';
                const endTimePart = '23:59:59';
                const timeValue =  timeRange.map((time, index) => {
                    return time ? `${dayjs(time).format('YYYY-MM-DD')} ${index ? endTimePart : startTimePart}` : '';
                });
                const condition = {
                    filterType,
                    filterValue: JSON.stringify(filterType === 'tags' ? tags : timeValue)
                };
                return condition;
            }
        },
        created() {
            this.getAlbumCategory();
            const condition = this.getCondition();
            this.$emit('init', condition);
        }
    }
</script>

<style scoped lang="scss">
    .filter-area {
        display: flex;
        flex-wrap: wrap;
        align-items: end;
        .filter-item {
            display: flex;
            align-items: center;
            margin: 0 10px 10px 20px;
            span {
                display: block;
                width: 70px;
            }
            /deep/ .el-input {
                margin-left: 13px;
            }
            /deep/ .el-select__tags {
                left: 14px;
            }
            .el-date-editor.el-range-editor {
                width: 280px;
            }
        }
    }
</style>