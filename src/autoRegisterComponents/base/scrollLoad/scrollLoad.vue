<template>
    <div
        :class="`scroll-load-component ${customClass}`"
        @scroll="onScroll"
        ref="boxRef"
    >
        <slot />
    <div class="scroll-load-component-footer">
        <div
            v-show="!isFinish"
            class="scroll-load-component-footer-loading"
        >
            <span>{{ loadText }}</span>
        </div>
        <div
            v-show="isFinish && finishText"
            class="scroll-load-component-footer-loading"
        >
            <span>{{ finishText }}</span>
        </div>
    </div>
    </div>

</template>

<script>
    export default {
        name: 'scroll-load',
        props: {
            customClass: {
                type: String,
                default: ''
            },
            isFinish: {
                type: Boolean,
                default: false
            },
            loadText: {
                type: String,
                default: '加载中...'
            },
            finishText: {
                type: String,
                default: '没有更多了'
            },
            scrollDistance: {
                type: Number,
                default: 40
            },
            load: {
                type: Function
            }
        },
        data() {
            return {
                isLoading: false,
            }
        },
        methods: {
            onScroll() {
                if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                }
                this.timer = setTimeout(() => {
                    this.checkIsNeedLoad();
                }, 200);
            },
            checkIsNeedLoad() {
                const { scrollDistance, load, onLoad, isFinish } = this;
                if (this.isLoading || isFinish) return false;
                const childrenHeight = this.getChildrenHeight();
                const boxHeight = this.$refs.boxRef.getBoundingClientRect().height;
                const boxScrollTop = this.$refs.boxRef.scrollTop;
                if ((childrenHeight - (boxHeight + boxScrollTop)) <= scrollDistance) {
                    load()
                        .then(result => {
                            this.isLoading = false;
                            onLoad && onLoad(result);
                        })
                        .catch(error => {
                            this.isLoading = false;
                        });
                    return true;
                }
                return false;
            },
            getChildrenHeight() {
                let height = 0;
                const children = this.$refs.boxRef.children;
                [...children].forEach(childNode => {
                    height += childNode.getBoundingClientRect().height;
                });
                return height;
            }
        },
        mounted() {
            this.onScroll();
        },
        beforeDestroy() {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        }
    }
</script>

<style scoped lang="scss">
    .scroll-load-component {
        max-height: 100%;
        overflow-y: auto;
        .scroll-load-component-footer {
            .scroll-load-component-footer-loading, .scroll-load-component-footer-finish {
                padding: 10px 0;
                text-align: center;
                span {
                    line-height: 20px;
                    color: #ACB2CC;
                }
            }
        }
    }
</style>