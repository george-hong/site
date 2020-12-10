<template>
    <div class="dictionary-page">
        <div class="left">
            <dictionary-list />
        </div>
        <div class="right">
            <dictionary-table />
        </div>
    </div>
</template>

<script>
    import dictionaryList from './components/dictionaryList.vue';
    import dictionaryTable from './components/dictionaryTable.vue';

    export default {
        name: 'dictionary-page',
        components: {
            dictionaryList,
            dictionaryTable
        },
        data () {
            return {

            };
        },
        methods: {

        },
        computed: {

        },
        created () {

        }
    }
</script>

<style lang="scss" scoped>
    .dictionary-page {
        display: flex;
        .left {
            width: 200px;
        }
        .right {
            width: calc(100% - 200px);
            padding-left: 20px;
        }
    }
</style>