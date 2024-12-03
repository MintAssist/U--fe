
// import { reactive, onMounted } from 'vue';
// import { message } from 'ant-design-vue';
// import apiClient from '@/api/apiClient';

// const formStateUserInfo = reactive({
// 	firstName: '',
// 	lastName: '',
// 	gender: '',
// 	phone: '',
// 	age: '',
// 	nation: '',
// 	job: '',
// });

// const filterNation = (input, option) => {
// 	return option.key.toLowerCase().includes(input.toLowerCase());
// };


// // Fetch user data based on ID
// const fetchUserData = async () => {
// 	try {
// 		const apiUrl = `/u/me`;
// 		const response = await apiClient.get(apiUrl);
// 		if (response.status === 200) {
// 			// Populate the form fields excluding password
// 			formState.email = response.data.data.user.email;
// 			formState.role = response.data.data.user.roleKey;
// 			formState.state = response.data.data.user.stateKey;

// 			formStateUserInfo.age = response.data.data.user.age;
// 			formStateUserInfo.firstName = response.data.data.user.firstName;
// 			formStateUserInfo.lastName = response.data.data.user.lastName;
// 			formStateUserInfo.gender = response.data.data.user.gender;
// 			formStateUserInfo.phone = response.data.data.user.phone;
// 			formStateUserInfo.nation = response.data.data.user.nation;
// 			formStateUserInfo.job = response.data.data.user.job;
// 		} else {
// 			message.error('Failed to fetch user data.');
// 		}
// 	} catch (error) {
// 		message.error('Failed to fetch user data.');
// 	}
// };

// // Call fetchUserData when component is mounted
// onMounted(() => {
// 	fetchUserData();
// });

// const onSubmitUserInfo = async () => {
// 	try {
// 		// Validate fields
// 		if (
// 			!formStateUserInfo.firstName ||
// 			!formStateUserInfo.lastName ||
// 			!formStateUserInfo.gender ||
// 			!formStateUserInfo.phone ||
// 			!formStateUserInfo.age
// 		) {
// 			message.error('Please fill all required fields.');
// 			return;
// 		}

// 		// Prepare payload with data from formStateUserInfo
// 		const payload = {
// 			firstName: formStateUserInfo.firstName,
// 			lastName: formStateUserInfo.lastName,
// 			gender: formStateUserInfo.gender,
// 			phone: formStateUserInfo.phone,
// 			age: formStateUserInfo.age,
// 			nation: formStateUserInfo.nation,
// 			job: formStateUserInfo.job,
// 		};

// 		// Update user data via API
// 		const apiUrl = `/u/me`;
// 		const response = await apiClient.put(apiUrl, payload);

// 		if (response.status === 200) {
// 			message.success('User updated successfully!');
// 		} else {
// 			message.error('Failed to update user. Please try again.');
// 		}
// 	} catch (error) {
// 		message.error('Error updating user.');
// 	}
// };


