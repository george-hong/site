<template>
  <div class="article-list" ref="listComponent">
    <ul class="list-wrapper">
        <li v-for="article in articleList"
            :key="article.id">
          <div class="top">
            <p class="one-line-text title"
               @click="viewArticleDetail(article)">{{article.title}}</p>
            <span>{{article.updateTime | dayTime}}</span>
          </div>
          <div class="bottom">
            <span>{{article.author}}</span>
          </div>
        </li>
    </ul>
    <p v-if="isLoading"
       class="is-bottom">-- 正在加载 --</p>
    <p v-if="isNoMore && !once"
       class="is-bottom">-- 我也是有底线的 --</p>
  </div>
</template>

<script>
  import '../../common/style/common.scss';
  import request from '@request';
  import { isNumber } from '@utilMethods';

  export default {
    name: 'article-list',
    props: {
      once: { // 是否只加载一次
        type: Boolean,
        default: false,
      },
      pageSize: { // 每页数量
        type: Number,
        default: 10,
      },
      page: { // 当前页码
        type: Number,
        default: 1,
      },
      disabledLoad: { // 是否禁用加载
        type: Boolean,
        default: false,
      },
      scrollDistance: { // 触发加载事件的高度阈值
        type: Number,
        default: 100,
      }
    },
    data() {
      return {
        componentId: this.getGlobalId(), // 组件唯一id
        articleList: [],
        currentPage: this.page,
        isLoading: false, // 是否正在加载
        isNoMore: false,  // 是否沒有更多數據了
        scrollTimer: null,// 滚动定时器
        resizeTimer: null,// 调整窗口定时器
        clientHeight: 0,  // 窗口高度
      }
    },
    methods: {
      viewArticleDetail(article) {
        const { id } = article;
        this.$router.push({
          name: 'articleDetail',
          params: { id }
        });
      },
      // 循环加载数据  知道没有数据或者元素高度超过页面高度
      async loadUtillNoMoreOrHaveScroll() {
        await this.getArticleList();
        this.$nextTick(() => {
          if (!this.isNoMore && this.$refs.listComponent.offsetHeight < this.clientHeight) this.loadUtillNoMoreOrHaveScroll();
        })
      },
      async getArticleList(page) {
        this.isLoading = true;
        try {
          const listInfo = await this.requestGetArticleList(page);
          const { data: listData, total } = listInfo;
          this.isNoMore = this.checkIsNoMore(total);
          this.currentPage += 1;
          this.articleList = this.articleList.concat(listData);
        } catch (err) {
          console.log(err);

        }
        this.isLoading = false;
      },
      requestGetArticleList(page) {
        const pageIsNumber = isNumber(page);
        const pageNumber = pageIsNumber ? page : this.currentPage;
        return new Promise((resolve, reject) => {
          const requestParams = {
            page: pageNumber,
            pageSize: this.pageSize,
          };
          request.getArticleList(requestParams)
            .then(result => {
              if (pageIsNumber) this.currentPage = page;
              resolve(result);
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      // 校验是否没有更多数据了
      checkIsNoMore(total) {
        return total <= this.pageSize * this.currentPage;
      },
      // 获取元素底部距离视窗底部的距离
      getMarginToClientBottom() {
        const componentPosition = this.$refs.listComponent.getBoundingClientRect();
        return componentPosition.bottom - this.clientHeight;
      },
      // 监听页面滚动加载时间
      scrollEvent() {
        // 正在加载或者已经加载完毕了就不需要触发定时器
        if (this.isLoading || this.isNoMore) return;
        if (this.scrollTimer) {
          clearTimeout(this.scrollTimer);
        }
        this.scrollTimer = setTimeout(() => {
          const elementBottomHeight = this.getMarginToClientBottom();
          // 当距离小于阈值时触发加载事件
          if (elementBottomHeight <= this.scrollDistance) this.getArticleList();
        }, 50);
      },
      resizeEvent() {
        if (this.resizeTimer) {
          clearTimeout(this.resizeTimer);
        }
        this.resizeTimer = setTimeout(() => {
          this.clientHeight = document.documentElement.clientHeight;
        }, 50);
      },
    },
    created() {
      if (this.once) this.getArticleList();
    },
    mounted() {
      // 如果是只加载一次，不添加滚动加载事件
      if (!this.once) {
          this.resizeEvent();
          this.loadUtillNoMoreOrHaveScroll();
          window.addEventListener('resize', this.resizeEvent);
          window.addEventListener('scroll', this.scrollEvent);
      }
    },
    beforeDestroy() {
      // 如果是只加载一次,没有事件需要卸载
      if(!this.once) {
        window.removeEventListener('resize', this.resizeEvent);
        window.removeEventListener('scroll', this.scrollEvent);
      }
    },
  }
</script>

<style lang="scss" scoped>
  .article-list {
    overflow: auto;
    .list-wrapper {
      > li {
        padding: 15px 0;
        border-bottom: 1px solid rgba(0, 0, 0, .05);
        .top {
          display: flex;
          .title {
            cursor: pointer;
          }
          p {
            flex: 1;
          }
          > span {
            display: inline-block;
            width: 150px;
            text-align: right;
          }
        }
        .bottom {
          text-align: right;
        }
      }
    }
    .is-bottom {
      padding: 20px 0;
      text-align: center;
    }
  }
</style>