<template>
    <div class="empty-component">
        <i class="el-icon-receiving" />
        <span>{{ tip }}</span>
    </div>
</template>

<script>
    export default {
        name: 'empty',
        props: {
            tip: {
                type: String,
                default: '没有相关内容'
            }
        }
    }
</script>

<style scoped lang="scss">
    .empty-component {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 0;
        i {
            font-size: 18px;
            display: inline-block;
            margin-right: 10px
        }
    }
</style>