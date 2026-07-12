<template>
  <div class="dashboard">
    <a-row :gutter="[16, 16]" class="mb-4">
      <a-col :span="6">
        <a-card class="statistic-card">
          <a-statistic title="分类数量" :value="statistics.categories" :value-style="{ color: '#ff6b00' }">
            <template #prefix>
              <FolderOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="statistic-card">
          <a-statistic title="文章总数" :value="statistics.articles" :value-style="{ color: '#3f8600' }">
            <template #prefix>
              <FileTextOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="statistic-card">
          <a-statistic title="日记总数" :value="statistics.users" :value-style="{ color: '#008cff' }">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card class="statistic-card">
          <a-statistic title="友链数量" :value="statistics.links" :value-style="{ color: '#ff008c' }">
            <template #prefix>
              <LinkOutlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" class="mt-4">
      <a-col :span="16">
        <a-card title="文章发布趋势" class="chart-card">
          <div ref="lineChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="文章分类分布" class="chart-card">
          <div ref="pieChartRef" class="chart-container"></div>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="[16, 16]" class="mt-4">
      <a-col :span="24">
        <a-card title="最近文章" class="table-card">
          <a-table :columns="columns" :data-source="recentArticles" :pagination="false">
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'title'">
                {{ record.title }}
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import SystemConfig from "@/SystemConfig";
// @ts-ignore
import request from "@/utils/request.js";
import { handleDecodemultiple } from "@/utils/utils.js";
import { ref, onMounted, onUnmounted } from 'vue';
import { FileTextOutlined, UserOutlined, FolderOutlined, LinkOutlined } from '@ant-design/icons-vue';
import * as echarts from 'echarts';

// 统计数据
const statistics = ref({
  articles: 0,
  users: 0,
  categories: 0,
  links: 0,
  blogAddDateCount: {
    date: [],
    data: []
  },
  blogClassCount: []
});

const apiURL = `/api/admin/welcome`;

// 获取数据
const handleGetList = () => {
  request({
    url: `${apiURL}`,
    params: {}
  }).then((data: any) => {
    const result = data;
    const value = statistics.value;
    value.categories = result.blogClassTotal;
    value.articles = result.blogTotal;
    value.users = result.notepadTotal;
    value.links = result.linkTotal;
    // 趋势
    const newList = value.blogAddDateCount;
    result.blogAddDateCount.forEach((item: any) => {
      // @ts-ignore
      newList.date.push(item.publish_date);
      // @ts-ignore
      newList.data.push(item.publish_count);
    });

    // 分类统计
    const newList2 = value.blogClassCount;
    result.blogClassCount.forEach((item: any) => {
      // @ts-ignore
      newList2.push({
        name: item.class_name,
        value: item.blog_count
      });
    });

    initLineChart();
    initPieChart();
  }).catch((err: any) => {
    console.log(err);
  });
}

// 最近文章表格列定义
const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '分类',
    dataIndex: 'className',
    key: 'className'
  },
  {
    title: '置顶',
    dataIndex: 'readTop',
    key: 'readTop'
  },
  {
    title: '发布时间',
    dataIndex: 'create_time',
    key: 'create_time'
  }
];

// 最近文章数据
const recentArticles = ref([]);

const pagination = ref({
  size: 5,
  index: 1,
  total: 0
});

const handleGetListBlog = () => {
  let requestParams = Object.assign({}, pagination.value);
  request({
    url: `/api/admin/blogs/query/list/simple`,
    params: requestParams
  }).then((data: any) => {
    const dataSource = recentArticles;
    dataSource.value.splice(0, dataSource.value.length);
    data.result.forEach((element: any) => {
      try {
        element = handleDecodemultiple(element, element.key, ["title"]);
      } catch (error) {

      }
      // @ts-ignore
      dataSource.value.push(element);
    });
  }).catch((err: any) => {
    console.log(err);
  });
}


// 图表引用
const lineChartRef = ref<HTMLElement | null>(null);
const pieChartRef = ref<HTMLElement | null>(null);
let lineChart: echarts.ECharts | null = null;
let pieChart: echarts.ECharts | null = null;

// 初始化折线图
const initLineChart = () => {
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value);

    const option = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        // 调整图表的外边距
        top: 20,
        right: 10,
        bottom: 10,
        left: 20,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: statistics.value.blogAddDateCount.date
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: statistics.value.blogAddDateCount.data,
          type: 'line',
          smooth: true,
          areaStyle: {
            color: '#67c23a'
          },
          lineStyle: {
            color: '#67c23a'
          }
        }
      ]
    };

    lineChart.setOption(option);
  }
};

// 初始化饼图
const initPieChart = () => {
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value);

    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '80%',
          data: statistics.value.blogClassCount,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    pieChart.setOption(option);
  }
};

// 窗口大小改变时重置图表大小
const resizeCharts = () => {
  if (lineChart) {
    lineChart.resize();
  }
  if (pieChart) {
    pieChart.resize();
  }
};

onMounted(() => {
  handleGetList();
  handleGetListBlog();
  // 监听窗口大小改变事件
  window.addEventListener('resize', resizeCharts);
});

// 组件卸载时清理事件监听器和eCharts实例
onUnmounted(() => {
  window.removeEventListener('resize', resizeCharts);
  // 销毁eCharts实例以防止内存泄漏
  if (lineChart) {
    lineChart.dispose();
    lineChart = null;
  }
  if (pieChart) {
    pieChart.dispose();
    pieChart = null;
  }
});
</script>

<style scoped>
.dashboard {
  padding: 24px;
  background-color: #f0f2f5;
  min-height: 100%;
}

.statistic-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.statistic-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.chart-card,
.table-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-container {
  width: 100%;
  height: 300px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-4 {
  margin-top: 16px;
}
</style>
