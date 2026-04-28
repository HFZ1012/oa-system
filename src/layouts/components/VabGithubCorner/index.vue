<template>
  <div class="github-corner">
    <svg
      aria-hidden="true"
      class="github-color"
      height="80"
      viewBox="0 0 250 250"
      width="80"
    >
      <!-- 修复原有的缺角，变成一个完美的直角三角形 -->
      <path d="M0,0 L250,250 L250,0 Z" />

      <!-- 替换为公文包图标，调整坐标和旋转中心使其在三角形内完美居中 -->
      <!-- 三角形的重心大约在 (166, 83) 附近，我们将图标中心设为 (175, 75) -->
      <g transform="rotate(45, 175, 75)">
        <svg x="135" y="35" width="80" height="80" viewBox="0 0 1024 1024">
          <path d="M942.6 369v574H82.2V369h860.4m20-80H62.2c-33.1 0-60 26.9-60 60v614c0 33.1 26.9 60 60 60h900.4c33.1 0 60-26.9 60-60V349c0-33.1-26.9-60-60-60z" fill="currentColor"></path>
          <path d="M896.8 369c-10.3 31-24.3 60.5-41.9 88.3-24 37.8-53.8 71.3-88.7 99.4-35.2 28.3-74.5 50.4-116.8 65.6-43.9 15.7-89.9 23.7-137 23.7s-93.1-8-136.9-23.7c-42.3-15.2-81.6-37.3-116.8-65.6-34.9-28.1-64.8-61.5-88.7-99.4-17.6-27.8-31.7-57.3-42-88.3h768.8m38.7-80H89.4c-32.5 0-56.8 30.2-49.4 61.8C89.7 565.8 282.3 726 512.4 726s422.7-160.2 472.5-375.2c7.4-31.6-16.9-61.8-49.4-61.8z" fill="currentColor"></path>
          <path d="M765.9 329.5h-80c0-95.7-77.8-173.5-173.5-173.5s-173.5 77.8-173.5 173.5h-80c0-67.7 26.4-131.4 74.2-179.3S444.7 76 512.4 76c67.7 0 131.4 26.4 179.3 74.2s74.2 111.6 74.2 179.3zM512.4 724c-22.1 0-40-17.9-40-40v-94c0-22.1 17.9-40 40-40s40 17.9 40 40v94c0 22.1-17.9 40-40 40z" fill="currentColor"></path>
        </svg>
      </g>
    </svg>
  </div>
</template>
<script>
  export default {
    name: 'VabGithubCorner',
  }
</script>

<style lang="scss" scoped>
  .github-corner {
    position: absolute;
    top: 0;
    right: 0;
    z-index: $base-z-index - 3;
    pointer-events: none;

    .github-color {
      color: #fff;
      fill: $base-color-blue;
    }
  }
</style>
