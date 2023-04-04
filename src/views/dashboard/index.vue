<template>
  <div class="dashboard-container">
    <PageTools :show-before="true">
      <template v-slot:before>
        <span>你们在干什么啊 ？？？</span>
      </template>
      <template v-slot:after>
        <el-button type="primary" size="small">导出excel</el-button>
      </template>
    </PageTools>
    <UploadExcel></UploadExcel>
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  components: {

  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
