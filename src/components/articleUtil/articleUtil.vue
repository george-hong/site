<template>
    <div class="article-util-component">
        工具箱
        <upload-image-modal

        />
    </div>
</template>

<script>
    export default {
        name: 'articleUtil',
    }
</script>

<style scoped lang="scss">
    .article-util-component {
        position: fixed;
        z-index: 9;
        left: 50px;
        top: 300px;
        box-shadow: 0 0 5px 2px #ddd;
    }
</style>