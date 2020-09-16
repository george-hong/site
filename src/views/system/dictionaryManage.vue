<template>
  <div class="dictionary">
    <h2>字典配置</h2>
    <div class="search-area">
      <el-form :model="searchForm">
        <el-row :gutter="20">
          <el-col :xs="24"
                  :sm="8">
            <el-form-item label="关键字">
              <el-input v-model="searchForm.keyword"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24"
                  :sm="8">
            <el-form-item label="关键字">
              <el-input v-model="searchForm.keyword"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'dictionary-manage',
    data() {
      return {
        searchForm: {
          keyword: '，'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>