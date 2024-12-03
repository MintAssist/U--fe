<template>
	<div class="container-fluid d-flex justify-content-center">
		<div class="login-page">
			<template v-if="!requestSuccessFull">
				<a-card title="Forgot Password" bordered class="login-card">
					<a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef">
						<!-- Email -->
						<a-form-item label="Email" name="email" :rules="[
							{ required: true, message: 'Email is required' },
							{ type: 'email', message: 'Invalid email format' }
						]">
							<a-input v-model:value="formState.email" placeholder="Enter email" />
						</a-form-item>

						<!-- Submit & Cancel Buttons -->
						<a-form-item :wrapper-col="{ span: 14, offset: 4 }">
							<a-button type="primary" @click="onSubmit">Submit</a-button>
						</a-form-item>
					</a-form>
					<a-alert v-if="errorList.length" type="error" closable show-icon>
						<template #message>
							<div v-for="(error, index) in errorList" :key="index">
								{{ error }}
							</div>
						</template>
					</a-alert>
				</a-card>
			</template>
			<template v-else>
				<a-card title="Forgot Password Success" bordered class="noti-card">
					<a-result status="success" title="Forgot Password Success!"
						sub-title="A 5 minute token has been sent to you, please check your email.">
					</a-result>
				</a-card>
			</template>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, toRaw } from 'vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { buildApi } from '@/api/base';
const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };

const requestSuccessFull = ref(false)
const errorList = ref([]);
const showDismissibleAlert = ref(false);
const loading = ref(false);

const formState = reactive({
	email: '',
});

const onSubmit = async () => {
	loading.value = true;
	errorList.value = [];
	showDismissibleAlert.value = false;
	try {
		// Validate fields
		if (
			!formState.email
		) {
			message.error('Please fill all required fields.');
			return;
		}

		const apiUrl = buildApi('auth/forgot-password');
		const response = await axios.post(apiUrl, toRaw(formState));

		if (response.status === 204) {
			message.success('Forgot Password successfully!');
			requestSuccessFull.value = true
		} else {
			message.error('Failed to forgot password. Please try again.');
		}
	} catch (error) {
		const errorResponse = error.response;
		if (errorResponse && errorResponse.status === 400) {
			// Clear previous errors
			errorList.value = [];

			// Populate errorList with multiple errors from the response
			errorList.value = errorResponse.data.errors.map((err) => err.msg);
		} else {
			errorList.value.push('Login failed. Please try again.');
		}
		showDismissibleAlert.value = true;
		message.error(error.response?.data?.message || 'Failed to forgot password.');
	} finally {
		loading.value = false;
	}
};

</script>

<style scoped>
.create-user-page {
	margin: 20px auto;
}

.login-page {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
}


.login-card {
	width: 500px;
	overflow-y: auto;
}

.noti-card {
	width: 500px;
	overflow-y: auto;
}

.w-100 {
	width: 100%;
}

.is-invalid {
	border-color: #f5222d !important;
}

.text-center {
	text-align: center;
}

.mt-3 {
	margin-top: 1rem;
}
</style>
