<template>
    <div class="app-logo">
        <a href="/">
            <i class="iconfont"></i>
            <span>MyBlog </span><b>Beta</b>
            <p>Tell the world we were here!</p>
        </a>
    </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.app-logo{
	/* 位置由 Header 的 flex 布局决定，不再使用绝对定位 */
	flex: none;
	line-height: 20px;
}
.app-logo span{
	font-weight: bold;
	font-size: 28px;
	/*text-shadow: -2px 2px 4px rgba(0,0,0,0.3);*/
	color: #FF5722;
}
.app-logo b{
	font-size: 16px;
	color: #666;
	font-weight: normal;
}
.app-logo p{
	
}
</style>