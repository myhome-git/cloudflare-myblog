<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>系统登录</h1>
        <p>欢迎使用博客管理系统</p>
      </div>
      <a-form :model="formState" name="loginForm" :wrapper-col="{ span: 24 }" autocomplete="off" @finish="onFinish"
        @finishFailed="onFinishFailed" class="login-form">
        <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名!' }]">
          <a-input v-model:value="formState.username" size="large" placeholder="请输入用户名">
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item name="password" :rules="[{ required: true, message: '请输入密码!' }]">
          <a-input-password v-model:value="formState.password" size="large" placeholder="请输入密码">
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item name="remember" class="remember-me">
          <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" size="large" block :loading="loading" class="login-button">
            {{ loading ? '登录中...' : '登录' }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import SystemConfig from "@/SystemConfig.js";
import { reactive, ref } from 'vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
// @ts-ignore
import request from "@/utils/request.js";
import { message } from 'ant-design-vue';

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

const formState = reactive<FormState>({
  username: localStorage.getItem("remember") === 'true' ? `${localStorage.getItem("username")}` : '',
  password: '',
  remember: true,
});

const loading = ref(false);

const onFinish = (values: any) => {
  loading.value = true;
  const sendForm = JSON.parse(JSON.stringify(formState));
  try {
    request({
      url: `${SystemConfig.host}/api/user/accountVerification`,
      method: "post",
      data: sendForm
    }).then((resp: any) => {
      const { result } = resp;
      sessionStorage.setItem("token", result.token);
      sessionStorage.setItem("username", result.username);
      sessionStorage.setItem("file_upload_max_size", result.file_upload_max_size);
      // 记住功能
      if (formState.remember) {
        localStorage.setItem("username", result.username);
        localStorage.setItem("remember", formState.remember.toString());
      }
      location.href = "/admin";
      // console.log(res);
    }).catch((err: any) => {
      console.log(err);
    }).finally(() => {
      loading.value = false;
    })
  } catch (err) {
    console.log(err);
    message.error("登录失败，请检查用户名和密码");
  } finally {
    loading.value = false;
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>
<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.5s ease-out;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;

  h1 {
    font-size: 28px;
    color: #333;
    margin-bottom: 10px;
    font-weight: 600;
  }

  p {
    color: #666;
    font-size: 14px;
  }
}

.login-form {
  .ant-form-item {
    margin-bottom: 20px;
  }

  .ant-input-affix-wrapper {
    border-radius: 6px;
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    transition: all 0.3s;

    &:hover {
      border-color: #40a9ff;
    }

    &:focus {
      border-color: #40a9ff;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }

    .ant-input {
      font-size: 16px;
    }
  }

  .ant-input-password {
    border-radius: 6px;
  }
}

.remember-me {
  margin-bottom: 25px !important;

  .ant-checkbox-wrapper {
    color: #666;
  }
}

.login-button {
  height: 45px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式设计
@media (max-width: 480px) {
  .login-box {
    padding: 30px 20px;
    margin: 10px;
  }

  .login-header h1 {
    font-size: 24px;
  }
}
</style>
