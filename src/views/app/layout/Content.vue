<template>
    <div class="app-content">
        <div class="c-layout layout-left">
            <slot name="left">
                left
            </slot>
        </div>
        <div class="c-layout layout-right">
            <slot name="right">
                right
            </slot>
        </div>
    </div>
</template>
<script lang="ts" setup>
</script>

<style scoped>
.app-content {
    padding: 20px 0;
    display: grid;
    grid-template-columns: minmax(500px, 1fr) 400px;
    gap: 26px;
    align-items: start;
}

.c-layout {}

.layout-left {
    /* 左侧自适应，最小宽度500px */
    position: relative;
    height: 100%;
}
.layout-left::after{
    content: '';
    display: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    border: 1px solid #eee;
    border-radius: 5px;
}

.layout-right {
    /* 右侧固定宽度400px */
    position: relative;
}
.layout-right::after{
    content: '';
    display: block;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: -1;
    border: 0px solid red;
    border-radius: 5px;
}
</style>
