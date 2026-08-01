<template>
    <div class="app-header">
        <Logo></Logo>
        <Search @on-search="onSearch"></Search>
        <div class="header-menu">
            <HeaderLogin></HeaderLogin>
        </div>
    </div>
</template>
<script lang="ts" setup>
import Logo from './Logo.vue';
import Search from './Search.vue';
import HeaderLogin from './HeaderLogin.vue';

const emit = defineEmits(["onSearch"]);
const onSearch = (value: string) => {
    emit('onSearch', value);
}
</script>
<style scoped>
.app-header {
    padding: 20px 0;
    position: relative;
    height: 100px;
}
.app-header .header-menu {
    position: absolute;
    right: 0;
    top: 25px;
    transform: translateY(-50%);
    width: 140px;
}
</style>
