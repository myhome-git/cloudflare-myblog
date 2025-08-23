<template>
    <a-select :value="value" show-search placeholder="请选择" style="width: 100%" :options="options" v-bind="attrs"
        :filter-option="filterOption" @focus="handleFocus" @blur="handleBlur" @change="handleChange">
        <!-- 循环 slots 对象，将所有插槽（包括作用域插槽）都透传下去 -->
        <template v-for="(_, name) in slots" #[name]="scopedData">
            <slot :name="name" v-bind="scopedData" />
        </template>
    </a-select>
</template>
<script lang="ts" setup>
import { useAttrs, useSlots, ref, onMounted, nextTick, computed, watch } from 'vue';
import type { SelectProps } from 'ant-design-vue';

interface Option {
  label: string;
  value: string | number;
  [key: string]: any;
}

interface Props {
  value?: string | number | null;
  options?: Option[];
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  options: () => []
});

const attrs = useAttrs();
const slots = useSlots();
// console.log(`select透传对象`, attrs);
// console.log(`select透传插槽`, slots);

const emit = defineEmits(["update:value", "onChange"]);
// 使用 props 和 emits 实现 v-model 双向绑定
const value = ref(props.value);
const options = ref<Option[]>(props.options);
// const options = ref(props.options);
// const dataSource = ref<SelectProps['options']>(options.value || []);
const handleChange = (val: string | number | null) => {
    console.log(`selected ${val}`);
    value.value = val;
    emit("update:value", val);
    if (val !== null) {
        const result: Option[] = options.value.filter((item: Option) => {
            return `${item.value}` === `${val}`;
        });
        if (result.length > 0) {
            emit("onChange", result[0]);
        }
    }
};
const handleBlur = () => {
    // console.log('blur');
};
const handleFocus = () => {
    // console.log('focus');
};

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

// 监听 props 变化
watch(() => props.value, (newVal) => {
    // console.log(`props.value被更新`, newVal);
    if (newVal !== undefined && newVal !== value.value) {
        value.value = newVal;
    }
});

watch(() => props.options, (newData) => {
    // console.log(`props.options被更新`, newData);
    if (newData) {
        options.value = newData;
    }
});

// 挂在事件
onMounted(async () => {
    // 使用 $nextTick 确保 DOM 已经渲染完成
    await nextTick(() => {

    });
});
</script>
