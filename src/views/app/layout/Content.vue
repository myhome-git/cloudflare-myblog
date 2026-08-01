<template>
    <div class="app-content">
        <div class="app-content-left">
            <slot name="left"></slot>
        </div>
        <div class="app-content-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script lang="ts" setup>
</script>

<style scoped>
.app-content {
    margin: 20px 0;
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.app-content-left {
    min-width: 0;
    flex: 1;
    min-height: 0;
}

.app-content-right {
    min-width: 0;
    position: absolute;
    left: calc(100% + 20px);
    top: 0;
    width: 340px;
}
</style>