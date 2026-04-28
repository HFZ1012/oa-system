<template>
  <div class="vab-ad">
    <div class="static-notice">
      <span class="notice-icon">📢</span>
      <span class="notice-text">中国科学院上海分院内网系统更新上线了！</span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'VabAd',
  }
</script>
<style lang="scss" scoped>
  .vab-ad {
    height: 30px;
    padding-right: $base-padding;
    padding-left: $base-padding;
    margin-bottom: -20px;
    line-height: 30px;

    .static-notice {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;

      .notice-icon {
        font-size: 16px;
      }

      .notice-text {
        color: #666;
        font-weight: 500;
      }
    }
  }
</style>
