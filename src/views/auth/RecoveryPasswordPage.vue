<template>
	<div class="container-fluid d-flex justify-content-center">
		<div class="login-page">
			<template v-if="!requestSuccessFull">
				<a-card title="Change Password" bordered class="login-card">
					<a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
						autocomplete="off" @finish="onFinish">
						<a-form-item label="Password" name="newPassword" :rules="[
							{ required: true, message: 'Password is required' },
							{ min: 8, max: 64, message: 'Password must be between 8 and 64 characters' },
							{ pattern: /[a-z]/, message: 'Password must include at least one lowercase letter' },
							{ pattern: /[A-Z]/, message: 'Password must include at least one uppercase letter' },
							{ pattern: /\d/, message: 'Password must include at least one number' },
							{ pattern: /[!@#$%^&*(),.?:{}|<>]/, message: 'Password must include at least one special character' }
						]">
							<a-input-password v-model:value="formState.newPassword" placeholder="Enter new password" />
						</a-form-item>

						<!-- Confirm Password -->
						<a-form-item label="Confirm Password" name="confirmPassword"
							:rules="[{ required: true, message: 'Please confirm your password' }]">
							<a-input-password v-model:value="formState.confirmPassword"
								placeholder="Confirm password" />
						</a-form-item>

						<a-form-item :wrapper-col="{ offset: 8, span: 16 }">
							<a-button type="primary" html-type="submit">Submit</a-button>
						</a-form-item>
					</a-form>

					<!-- Error Alert -->
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
				<a-card title="Change Password Success" bordered class="noti-card">
					<a-result status="success" title="Change Password Success!" sub-title="You can come back to login.">
					</a-result>
					<router-link to="/login">
						Sign in
					</router-link>
				</a-card>
			</template>

		</div>
	</div>
</template>

<script setup>
import { reactive, ref, onMounted, toRaw } from 'vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import { buildApi } from '@/api/base';
import { useRoute } from 'vue-router';

const route = useRoute()

const formState = reactive({
	otp: '',
	id: '',
	newPassword: '',
	confirmPassword: '',
});

const requestSuccessFull = ref(false)

const loading = ref(false);
const error = ref(null);
const showDismissibleAlert = ref(false);
const errorList = ref([]);

const onFinish = async () => {
	loading.value = true;
	error.value = null;
	errorList.value = [];
	showDismissibleAlert.value = false;

	try {
		// Validate fields manually
		if (
			!formState.otp ||
			!formState.newPassword ||
			!formState.id
		) {
			message.error('Please fill in all required fields.');
			loading.value = false;
			return;
		}

		// Submit login request
		const apiUrl = buildApi('auth/reset-password');
		const response = await axios.post(apiUrl, toRaw(formState));

		if (response.status === 204 || response.status === 200) {
			requestSuccessFull.value = true
		}

	} catch (err) {
		const errorResponse = err.response;
		if (errorResponse && errorResponse.status === 400) {
			// Clear previous errors
			errorList.value = [];

			// Populate errorList with multiple errors from the response
			errorList.value = errorResponse.data.errors.map((err) => err.msg);
		} else {
			errorList.value.push('Change password failed. Please try again.');
		}
		showDismissibleAlert.value = true;
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	const id = route.params.userId;
	formState.id = id;

	const otp = route.query.token ?? null;
	if (otp) {
		formState.otp = otp;
	}
});

</script>

<style scoped>
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
