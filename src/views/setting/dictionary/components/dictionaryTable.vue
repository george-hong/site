<template>
    <div class="dictionary-table-component">
        <div class="first-line">
            <span class="dictionary-title">字典标题</span>
            <el-button
                size="mini"
                round
            >
                新增字段
            </el-button>
        </div>
        <div class="second-line">
            <span>字典描述</span>
            <span>具体描述内容</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'dictionary-table-component',
        components: {

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
    .dictionary-table-component {
        .first-line {
            position: relative;
            padding-right: 100px;
            .dictionary-title {
                line-height: 30px;
                font-weight: 600;
            }
            button {
                position: absolute;
                right: 0;
            }
        }
        .second-line {
            span {
                &:first-child {
                    display: inline-block;
                    margin-right: 10px;
                    color: #999999;
                }
            }
        }
    }
</style>