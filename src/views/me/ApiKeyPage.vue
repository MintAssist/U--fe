<template>
	<div class="edit-user-page">
		<a-card title="Update Gemini Api Key" bordered>
			<a-form :label-col="labelCol" :wrapper-col="wrapperCol" layout="horizontal" :disabled="componentDisabled"
				@click="allowEdit" :model="formState" ref="formRef">
				<a-form-item label="Api Key" :rules="[
					{ required: true, message: 'Api key is required' },
					{ type: 'string', message: 'Invalid Api Key format' },
					{ min: 20, max: 200, message: 'Api Key must be between 20 and 200 digits' }
				]">
					<a-input v-model:value="formState.apiKey" placeholder="Enter Api Key" />
				</a-form-item>
			</a-form>
			<a-form-item :wrapper-col="{ span: 14, offset: 4 }">
				<a-button type="primary" @click="onSubmit" :disabled="componentDisabled">Update</a-button>
				<a-button @click="handleReset" style="margin-left: 10px">Cancel</a-button>
			</a-form-item>
		</a-card>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import apiClient from '@/api/apiClient';

const componentDisabled = ref(true);
const currentApiKey = ref(null);
const labelCol = { style: { width: '150px' } };
const wrapperCol = { span: 14 };


// Initialize the form state
const formState = reactive({
	apiKey: ''
});

// Fetch user data based on ID
const fetchApiKeyData = async () => {
	try {
		const apiUrl = `/u/me/google-generate-api-key`;
		const response = await apiClient.get(apiUrl);
		if (response.status === 200) {
			// Populate the form fields excluding password
			formState.apiKey = response.data.data.apiKey;
			currentApiKey.value = response.data.data.apiKey
		} else {
			message.error('Failed to fetch user data.');
		}
	} catch (error) {
		message.error('Failed to fetch user data.');
	}
};

// Call fetchUserData when component is mounted
onMounted(() => {
	fetchApiKeyData();
});

const onSubmit = async () => {
	try {
		// // Validate fields
		if (
			!formState.apiKey
		) {
			message.error('Please fill all required fields.');
			return;
		}

		// // Prepare payload with data from formStateUserInfo
		const payload = {
			apiKey: formState.apiKey
		}
		// Update user data via API
		const apiUrl = `/u/me/google-generate-api-key`;
		const response = await apiClient.patch(apiUrl, payload);

		if (response.status === 200) {
			currentApiKey.value = null
			message.success('Api Key updated successfully!');
		} else {
			message.error('Failed to update Api Key. Please try again.');
		}
	} catch (error) {
		message.error('Error updating Api Key.');
	}
};


const handleReset = () => {
	formState.apiKey = currentApiKey.value
	componentDisabled.value = true
};

const allowEdit = () => {
	if (true === componentDisabled.value) {
		componentDisabled.value = false
		formState.apiKey = ''
	}
}
</script>

<style scoped>
.edit-user-page {
	margin: 20px auto;
}
</style>
