<template>
    <div class="header-nav">
        <el-menu class="w" mode="horizontal">
            <el-menu-item index="1">处理中心</el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    export default {
        name: 'header-nav'
    }
</script>

<style lang="scss" scoped>
    .header-nav {
        border-bottom: 1px solid #e6e6e6;
        .el-menu--horizontal {
            border-bottom: 0;
        }
    }
</style>