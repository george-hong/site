<template>
    <div class="search-page">
        <div class="w">
            search
        </div>
    </div>
</template>

<script>
    import { search } from '@request';
    export default {
        name: 'search-page',
        data() {
            return {
                keyword: '',    // 搜索关键字
            }
        },
        methods: {
            search () {
                const requestParams = {
                    keyword: this.keyword
                };
                search(requestParams)
                    .then(result => {
                        console.log('search result', result)
                    })
                    .catch(error => {
                        console.log('search error', error)
                    });
            }
        },
        created () {
            const { keyword } = this.$route.query;
            if (keyword !== undefined) {
                this.keyword = keyword;
                this.search();
            }
        }
    }
</script>

<style scoped>

</style>