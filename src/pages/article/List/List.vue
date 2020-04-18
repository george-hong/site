<template>
    <div class="w article-list-box">
        <h2>全部文章</h2>
        <el-row :gutter="20">
            <el-col :xs="24"
                    :sm="16">
                <article-list></article-list>
            </el-col>
            <el-col :xs="24"
                    :sm="8">
                <!-- <article-list></article-list> -->
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {

    }
</script>

<style lang="scss" scoped>

</style>