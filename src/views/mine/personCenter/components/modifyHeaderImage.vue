<template>
    <el-dialog
        :visible.sync="isShowModal"
    >
        更换头像
    </el-dialog>
</template>

<script>
    export default {
        name: 'modifyHeaderImage',
        props: {
            visible: {              // 是否显示更换头像弹窗
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                isShowModal: this.visible
            };
        },
        watch: {
            visible (newValue) {
                this.isShowModal = newValue;
            },
            isShowModal (newValue) {
                this.$emit('update:visible', newValue);
            }
        }
    }
</script>

<style scoped>

</style>