<template>
	<div class="create-user-page">
		<a-card title="Change Password Form" bordered>
			<a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" ref="formRef">
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
					<a-input-password v-model:value="formState.confirmPassword" placeholder="Confirm password" />
				</a-form-item>

				<!-- Submit & Cancel Buttons -->
				<a-form-item :wrapper-col="{ span: 14, offset: 4 }">
					<a-button type="primary" @click="onSubmit">Update</a-button>
					<a-button @click="handleReset" style="margin-left: 10px">Cancel</a-button>
				</a-form-item>
			</a-form>
		</a-card>
	</div>
</template>

<script setup>
import { reactive, toRaw } from 'vue';
import { message } from 'ant-design-vue';
import apiClient from '@/api/apiClient';

const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };

const formState = reactive({
	password: '',
	confirmPassword: '',
});

const onSubmit = async () => {
	try {
		// Validate fields
		if (
			!formState.password
		) {
			message.error('Please fill all required fields.');
			return;
		}

		if (formState.password !== formState.confirmPassword) {
			message.error('Passwords do not match!');
			return;
		}

		const response = await apiClient.patch('/u/me/change-password', toRaw(formState));

		if (response.status === 200) {
			message.success('Change password successfully!');
			handleReset();
		} else {
			message.error('Failed to change password. Please try again.');
		}
	} catch (error) {
		message.error(error.response?.data?.message || 'Failed to change password.');
	}
};

const handleReset = () => {
	formState.password = '';
	formState.confirmPassword = '';
};
</script>

<style scoped>
.create-user-page {
	margin: 20px auto;
}
</style>
