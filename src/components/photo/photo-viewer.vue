<template>
    <div v-show="visible" @click="closeClick" class="showPhoto">
      <img class="img" :src="url" alt="图片加载失败" />
    </div>
</template>
   
<script >

  export default {
    props: {
      url: {
        type: String,
        default: "",
      },
      visible: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      closeClick() {
        //子组件可以使用 $emit 触发父组件的自定义事件
        this.$emit("closeClick");
      },
    },
  };
  </script>


  <style scoped>
  .showPhoto {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; /* 填满屏幕宽度 */
  height: 100%; /* 填满屏幕高度 */
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.showPhoto .img {
  display: block;
  margin: auto;
  max-width: 100%; /* 图片宽度不超过容器宽度 */
  max-height: 100%; /* 图片高度不超过容器高度 */
  object-fit: contain; /* 控制图片填充方式，contain 表示保持宽高比并填充容器 */
}
  </style>