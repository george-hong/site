<template>
    <div class="w article-list-box">
        <h2>全部文章</h2>
        <article-list :page="page"></article-list>
    </div>
</template>

<script>
    export default {
        name: 'article-list-page',
        data() {
            return {
                page: Number(this.$route.params.page) || 1,
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>