<template>
    <div
        class="article-util-component"
        v-draggable
    >
        <ul class="util-list">
            <li>
                <i
                    class="el-icon-rank"
                    title="按住拖拽工具栏"
                />
            </li>
            <li
                @mousedown.stop=""
                @mouseup.stop=""
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
    import draggable from '../../directives/draggable';

    export default {
        name: 'articleUtil',
        directives: {
            draggable
        },
        data () {
            return {
                isShowUploadModal: false,           // 是否展示上传图片工具
            }
        },
        methods: {
            // 显示上传图片工具弹窗
            showUploadModal (event) {
                this.isShowUploadModal = true;
            }
        }
    }
</script>

<style scoped lang="scss">
    .article-util-component {
        background: #FFF;
        position: fixed;
        z-index: 9;
        left: 50px;
        top: 300px;
        box-shadow: 0 0 5px 2px #ddd;
        .util-list {
            width: 40px;
            > li {
                &:first-child {
                    cursor: move;
                }
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