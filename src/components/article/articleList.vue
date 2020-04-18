<template>
  <div class="article-list">
    <!-- <ul class="list-wrapper"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled"> -->
        <ul class="list-wrapper">
        <li v-for="article in articleList"
            :key="article.id">
          <div class="top">
            <p class="one-line-text"
               @click="viewArticleDetail(article)">{{article.title}}</p>
            <span>{{article.updateTime}}</span>
          </div>
          <div class="bottom">
            <span>{{article.author}}</span>
          </div>
        </li>
    </ul>
  </div>
</template>

<script>
  import '../../common/style/common.scss';
  import request from '@request';
  import { isNumber } from '@utilMethods';

  export default {
    name: 'article-list',
    props: {
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
      }
    },
    data() {
      return {
        articleList: [],
        currentPage: this.page,
        isLoading: false, // 是否正在加载
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
      async getArticleList(page) {
        this.isLoading = true;
        try {
          this.articleList = this.articleList.concat(await this.requestGetArticleList(page));
          this.currentPage += 1;
        } catch (err) {
          console.log(err);

        }
        this.isLoading = false;
      },
      requestGetArticleList(page) {
        const pageIsNumber = isNumber(page);
        const pageNumber = pageIsNumber ? page : this.page;
        return new Promise((resolve, reject) => {
          const requestParams = {
            page,
            pageSize: this.pageSize,
          };
          request.getArticleList(requestParams)
            .then(result => {
              if (pageIsNumber) this.page = page;
              resolve(result);
            })
            .catch(err => {
              reject(err);
            });
        });
      }
    },
    created() {
      this.getArticleList(1)
    }
  }
</script>

<style lang="scss" scoped>
  .article-list {
    overflow: auto;
    .list-wrapper {
      > li {
        padding: 15px 0;
        border-bottom: 1px solid #ddd;
        .top {
          display: flex;
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
  }
</style>