<template>
    <div class="article-util-component">
        <ul class="util-list">
            <li
                @click="showUploadModal"
                title="上传/查看图片"
            >
                <i class="el-icon-picture" />
            </li>
        </ul>
        <upload-image-modal
            :visible.sync="isShowUploadModal"
        />
    </div>
</template>

<script>
    export default {
        name: 'articleUtil',
        data () {
            return {
                isShowUploadModal: false,           // 是否展示上传图片工具
            }
        },
        methods: {
            // 显示上传图片工具弹窗
            showUploadModal () {
                this.isShowUploadModal = true;
            }
        }
    }
</script>

<style scoped lang="scss">
    .article-util-component {
        position: fixed;
        z-index: 9;
        left: 50px;
        top: 300px;
        box-shadow: 0 0 5px 2px #ddd;
        .util-list {
            width: 40px;
            > li {
                width: 100%;
                padding: 5px;
                cursor: pointer;
                i {
                    font-size: 30px;
                    line-height: 30px;
                }
            }
        }
    }
</style>