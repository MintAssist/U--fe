<template>
	<div class="container-fluid d-flex justify-content-center">
		<div class="login-page">
			<template v-if="!signUpSuccessFull">
				<a-card title="Sign Up" bordered class="login-card">
					<a-form :model=" formState" :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef">
						<!-- Email -->
						<a-form-item label="Email" name="email" :rules="[
						{ required: true, message: 'Email is required' },
						{ type: 'email', message: 'Invalid email format' }
					]">
							<a-input v-model:value="formState.email" placeholder="Enter email" />
						</a-form-item>

						<!-- Password -->
						<a-form-item label="Password" name="password" :rules="[
						{ required: true, message: 'Password is required' },
						{ min: 8, max: 64, message: 'Password must be between 8 and 64 characters' },
						{ pattern: /[a-z]/, message: 'Password must include at least one lowercase letter' },
						{ pattern: /[A-Z]/, message: 'Password must include at least one uppercase letter' },
						{ pattern: /\d/, message: 'Password must include at least one number' },
						{ pattern: /[!@#$%^&*(),.?:{}|<>]/, message: 'Password must include at least one special character' }
					]">
							<a-input-password v-model:value="formState.password" placeholder="Enter password" />
						</a-form-item>

						<!-- Confirm Password -->
						<a-form-item label="Confirm Password" name="confirmPassword"
							:rules="[{ required: true, message: 'Please confirm your password' }]">
							<a-input-password v-model:value="formState.confirmPassword"
								placeholder="Confirm password" />
						</a-form-item>


						<!-- Submit & Cancel Buttons -->
						<a-form-item :wrapper-col="{ span: 14, offset: 4 }">
							<a-button type="primary" @click="onSubmit">Register</a-button>
						</a-form-item>
					</a-form>
				</a-card>
			</template>
			<template v-else>
				<a-card title="Sign Up Success" bordered class="noti-card">
					<a-result status="success" title="Sign Up Success!"
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
import { useRouter } from 'vue-router';

const router = useRouter();

const signUpSuccessFull = ref(false)

const formState = reactive({
	email: '',
	password: '',
	confirmPassword: '',
});

const onSubmit = async () => {
	try {
		// Validate fields
		if (
			!formState.email ||
			!formState.password
		) {
			message.error('Please fill all required fields.');
			return;
		}

		if (formState.password !== formState.confirmPassword) {
			message.error('Passwords do not match!');
			return;
		}
		const apiUrl = buildApi('auth/sign-up');
		const response = await axios.post(apiUrl, toRaw(formState));

		if (response.status === 201 || response.status === 200) {
			message.success('Sign up successfully!');
			signUpSuccessFull.value = true
			const user = response.data.data.user
			setTimeout(() => {
				router.push(`/support/verify-mail/${user._id}?email=${user.email}`);
			}, 3000);
		} else {
			message.error('Failed to signup password. Please try again.');
		}
	} catch (error) {
		message.error(error.response?.data?.message || 'Failed to signup.');
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
