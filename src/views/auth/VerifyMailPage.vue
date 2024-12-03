<template>
	<div class="container-fluid d-flex justify-content-center">
		<div class="login-page">
			<a-card title="Verify Account" bordered class="login-card">
				<a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }"
					autocomplete="off" @finish="onFinish">


					<a-form-item label="OTP" name="otp" :rules="[
							{ required: true, message: 'OTP is required' },
							{ min: 6, max: 6, message: 'OTP must be 6 characters' },
							{ pattern: /\d/, message: 'OTP is number' },
						]">
						<a-input v-model:value="formState.otp" />
					</a-form-item>

					<a-form-item :wrapper-col="{ offset: 8, span: 16 }">
						<a-button type="primary" html-type="submit">Verify</a-button>
						<a-button @click="handleReSend" style="margin-left: 10px">Re-send OTP</a-button>
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
		</div>
	</div>
</template>

<script setup>
import { reactive, ref, onMounted, toRaw } from 'vue';
import { message } from 'ant-design-vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { buildApi, roles, accessTokenKey, refreshTokenKey, currentUserKey  } from '@/api/base';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute()
const formState = reactive({
	otp: '',
	id: '',
	email: '',
});

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
		if (!formState.otp ) {
			message.error('Please fill in all required fields.');
			loading.value = false;
			return;
		}

		// Submit login request
		const apiUrl = buildApi('auth/verify-email');
		const response = await axios.post(apiUrl, toRaw(formState));

		const result = response.data;
		if (roles.includes(result.data.user.role)) {
			const accessToken = result.data.accessToken;
			const refreshToken = result.data.refreshToken;

			// Save tokens
			localStorage.setItem(accessTokenKey, accessToken);
			localStorage.setItem(currentUserKey, JSON.stringify(result.data.user));

			if (refreshToken) {
				Cookies.set(refreshTokenKey, refreshToken, { 
					expires: 30,
				 });
			}

			Cookies.set(accessTokenKey, accessToken, {
				expires: 1,
			});

			Cookies.set(currentUserKey, JSON.stringify(result.data.user), {
				expires: 1,
			});


			// Redirect to dashboard
			router.push(route.query.redirect || '/dashboard');
		} else {
			error.value = "Forbidden";
			showDismissibleAlert.value = true;
		}
	} catch (err) {
		const errorResponse = err.response;
		if (errorResponse && errorResponse.status === 400) {
			// Clear previous errors
			errorList.value = [];

			// Populate errorList with multiple errors from the response
			errorList.value = errorResponse.data.errors.map((err) => err.msg);
		} else {
			errorList.value.push('Verify account failed. Please try again.');
		}
		showDismissibleAlert.value = true;
	} finally {
		loading.value = false;
	}
};
const handleReSend = async () => {
	try {
		// Validate fields
		if (
			!formState.email
		) {
			message.error('Missing data to resend.');
			return;
		}
		const apiUrl = buildApi('auth/reverify-email')
		const response = await axios.post(apiUrl, toRaw(formState));

		if (response.status === 200) {
			message.success('Re-send otp successfully!');
		} else {
			message.error('Failed to Re-send otp. Please try again.');
		}
	} catch (error) {
		message.error(error.response?.data?.message || 'Failed to Re-send otp.');
	}
}
onMounted(() => {
	const id = route.params.userId;
	formState.id = id;
	const email = route.query.email;
	if (email) {
		formState.email = email
	}
	const otp = route.query.token ?? null;
	if (otp) {
		formState.otp = otp;
		onFinish()
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
