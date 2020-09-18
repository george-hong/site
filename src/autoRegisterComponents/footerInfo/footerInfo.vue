<template>
    <div class="footer-info">
        <div class="w">
            公安备案号:
            <a
                href="http://beian.miit.gov.cn"
                target="_blank"
            >
                苏ICP备17060437号-2
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'footer-info',
        data() {
            return {

            }
        },
    }
</script>

<style lang="scss" scoped>
    .footer-info {
        background: #FFF;
        height: 60px;
        border-top: 1px solid #e6e6e6;
        padding: 10px 0 10px;
        box-sizing: border-box;
        text-align: center;
    }
</style>