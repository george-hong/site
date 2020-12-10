<template>
    <div class="setting-page">
        <div class="w">
            <dictionary />
        </div>
    </div>
</template>

<script>
    import { stateNameSpace } from '@nameSpace/storeNameSpace';
    import { getUserBaseInfo } from '@request';
    import dictionary from './dictionary/dictionary.vue';

    export default {
        name: 'settingPage',
        components: {
            dictionary
        },
        data () {
            return {
                currentTab: 'myArticle',        // 当前选择的tab
                userInfo: {}                    // 当前展示的用户信息
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

</style>