<template>
    <div class="my-files-component">
        <div class="filter-area">
            <div class="filter-item">
                <span>筛选条件</span>
                <el-select
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
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
                </el-date-picker>
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
                <el-button
                    type="primary"
                    @click="filterPhoto"
                >
                    过滤
                </el-button>
            </div>
        </div>
        <div
            class="album-block"
            v-if="fileList.length"
        >
            <ul class="album-container">
                <li
                    v-for="(fileInfo, fileIndex) in fileList"
                    :key="fileInfo.id"
                >
                    <el-image
                        :src="fileInfo.url"
                        fit="scale-down"
                        @click="previewImage(fileIndex)"
                        lazy
                    >
                        <div
                            slot="error"
                            class="image-error flex-content-xy-center"
                        >
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                </li>
            </ul>
        </div>
        <empty v-show="!fileList.length"/>
        <viewer
            v-if="fileList.length"
            class="viewer"
            :images="imageList"
            ref="viewer"
        >
            <img v-for="src in imageList" :src="src" :key="src">
        </viewer>
    </div>
</template>

<script>
    import dayjs from 'dayjs';
    import api, { queryDictionaryFieldList } from '@request';
    import { stateNameSpace } from '@nameSpace/storeNameSpace';
    import storageNameSpace from '@nameSpace/storageNameSpace';

    const filterOptions = [
        { label: '上传时间', value: 'createTime' },
        { label: '更新时间', value: 'updateTime' },
        { label: '文件标签', value: 'tags' },
    ];

    export default {
        name: 'myFile',
        data () {
            return {
                filterOptions: { ...filterOptions },
                filterType: filterOptions[0].value,
                timeRange: [],
                tags: [],
                fileList: [],
                tagCategoryList: [],                        // 图片分类标签
            }
        },
        created () {
            this.getAlbumCategory();
            this.getFileList();
        },
        methods: {
            getFileList (params) {
                const requestParams = {
                    uploaderId: this.userInfo.userId,
                    type: 'articleImage',
                    ...params
                };
                api.getUploadFilesInfo(requestParams)
                    .then(result => {
                        const { content } = result;
                        if (content) this.fileList = content;
                        this.fileList.forEach(fileInfo => {
                            fileInfo.createTime = dayjs(fileInfo.createTime).format('YYYY-MM-DD HH:mm:ss');
                        });
                    })
                    .catch(error => {
                        console.log(`文件信息获取异常:${error}`);
                    });
            },
            // 预览图片
            previewImage (imageIndex) {
                this.$refs.viewer.$viewer.view(imageIndex);
            },
            // 获取用户相册分类字典
            getAlbumCategory() {
                const localUserInfo = this.getLocalUserInfo();
                if (!localUserInfo || !(localUserInfo.albumDicId >= 0)) return this.message.info({ message: '您尚未绑定图片分类字典' });
                const { albumDicId } = localUserInfo;
                const requestParams = {
                    page: 1,
                    pageSize: 99999,
                    dicId: albumDicId
                }
                queryDictionaryFieldList(requestParams)
                    .then(result => {
                        const { content } = result;
                        this.tagCategoryList = content;
                    })
            },
            getLocalUserInfo() {
                let localUserInfo = localStorage.getItem(storageNameSpace.userInfo);
                if (!localUserInfo) {
                    this.message.info({ message: '未获取到用户信息,请重新登录' });
                    return null;
                }
                return JSON.parse(localUserInfo);
            },
            // 过滤图片
            filterPhoto() {
                const { filterType, tags, timeRange } = this;
                const requestParams = {
                    filterType,
                    filterValue: JSON.stringify(filterType === 'tags' ? tags : timeRange.map(time => time ? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : ''))
                };
                this.getFileList(requestParams);
            }
        },
        computed: {
            userInfo () {
                return this.$store.state[stateNameSpace.userInfo];
            },
            imageList () {
                return this.fileList.map(fileInfo => fileInfo.url);
            }
        }
    }
</script>

<style scoped lang="scss">
    .my-files-component {
        .filter-area {
            display: flex;
            flex-wrap: wrap;
            .filter-item {
                margin: 0 10px 10px 0;
            }
        }
        .album-block {
            .album-title {
                margin: 10px;
            }
            .album-container {
                display: flex;
                flex-wrap: wrap;
                margin-left: -10px;
                > li {
                    box-sizing: border-box;
                    width: 33.333%;
                    height: 300px;
                    padding-left: 10px;
                    margin-bottom: 10px;
                    /deep/ .image-error {
                        height: 200px;
                        width: 200px;
                        background: #f5f7fa;
                        i {
                            font-size: 22px;
                        }
                    }
                }
            }
        }
        .viewer {
            display: none;
        }
    }
</style>