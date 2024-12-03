<template>
	<div>
		<a-flex justify="space-between" :align="alignItems">
			<div class="table-operations">
				<!-- Clear all filters and sorters -->
				<a-button @click="clearAll" size="medium" style="margin-right: 8px;">Clear All Filters and
					Sorters</a-button>
				<!-- Clear filters -->
				<a-button @click="clearFilters" size="medium">Clear Filters</a-button>
				<!-- <a-button type="primary" :icon="h(SearchOutlined)">Search</a-button> -->
			</div>
		</a-flex>

		<a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading"
			:expand-column-width="20" :expanded-row-keys="expandedRowKeys" rowKey="_id" @expand="onExpand"
			@change="handleChange">
			<template #expandedRowRender="{ record }">
				<p style="margin: 0">
					{{ record.content }}
				</p>
			</template>
			<template #expandColumnTitle>
				<span style="color: red">More</span>
			</template>
			<!-- Custom Filter Dropdown cho cột title | url -->
			<template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
				<div style="padding: 8px">
					<a-input ref="searchInput" :placeholder="`Search ${column.dataIndex}`" :value="selectedKeys[0]"
						style="width: 188px; margin-bottom: 8px; display: block"
						@change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
						@pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)" />
					<a-button type="primary" size="small" style="width: 90px; margin-right: 8px"
						@click="handleSearch(selectedKeys, confirm, column.dataIndex)">
						<template #icon>
							<SearchOutlined />
						</template>
						Search
					</a-button>
					<a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
						Reset
					</a-button>
				</div>
			</template>


			<!-- Highlight Search Text trong Body -->
			<template #bodyCell="{ text, column, record }">
				<template v-if="column.key === 'title'">
					<router-link :to="`/notes/${record._id}`">
						{{ text }}
					</router-link>
				</template>
			</template>
		</a-table>
	</div>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import apiClient from '@/api/apiClient';
import { DEFAULT_SIZE } from './../../shared/constant/pagination'
const expandedRowKeys = ref([]);
import { useRoute } from 'vue-router';

const route = useRoute();

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: DEFAULT_SIZE, total: 0 });
const filteredInfo = ref({});
const sortedInfo = ref({});

const state = reactive({
	searchText: '',
	searchedColumn: '',
});

const fetchData = async (params = {}) => {
	loading.value = true;
	const noteId = route.params.noteId;
	try {
		const formatParams = {
			...params,
			page: params.page || pagination.value.current,
			size: params.size || pagination.value.pageSize,
		}

		if (filteredInfo.value.shortText && filteredInfo.value.shortText.length > 0) {
			formatParams.shortText = filteredInfo.value.shortText[0];
		}

		const response = await apiClient.get(`u/notes/${noteId}/translations`, {
			params: formatParams
		});

		dataSource.value = response.data.data.translations || [];
		pagination.value.total = response.data.data.total || 0;
		pagination.value.current = params.page || pagination.value.current;
	} catch (error) {
		console.error('Error fetching data:', error);
	} finally {
		loading.value = false;
	}
};
const searchInput = ref();

const columns = computed(() => [
	{
		title: 'Language',
		dataIndex: 'language',
		width: '20%',
		sorter: true,
		sortOrder: sortedInfo.value.columnKey === 'language' && sortedInfo.value.order,
	},
	{
		title: 'Text',
		dataIndex: 'shortText',
		ellipsis: true,
		width: '70%',
		filterSearch: true,
		customFilterDropdown: true,
	}
]);

const handleChange = (pagination, filters, sorter) => {
	filteredInfo.value = filters;
	sortedInfo.value = sorter;
	const sortRequest = {
		key: sorter.field,
		value: sorter.order == 'ascend' ? 'ASC' : 'DESC',
	}
	fetchData({
		page: pagination.current,
		size: pagination.pageSize,
		...filters,
		order: sortRequest
	});
};

const handleSearch = (selectedKeys, confirm, dataIndex) => {
	confirm();
	state.searchText = selectedKeys[0];
	state.searchedColumn = dataIndex;


	if (dataIndex === 'shortText') {
		filteredInfo.value.shortText = [state.searchText];
	}
	fetchData({
		page: pagination.value.current,
		size: pagination.value.pageSize,
		...filteredInfo.value,
	});
};


const handleReset = clearFilters => {
	clearFilters();
	state.searchText = '';
	filteredInfo.value = {};
	fetchData({ page: 1, size: pagination.value.pageSize });
};


const clearFilters = () => {
	filteredInfo.value = {};
	fetchData({ page: 1, size: pagination.value.pageSize });
};

const clearAll = () => {
	filteredInfo.value = {};
	sortedInfo.value = {};
	fetchData({ page: 1, size: pagination.value.pageSize });
};

const onExpand = (expanded, record) => {
	if (expanded) {
		expandedRowKeys.value = [...expandedRowKeys.value, record._id];
	} else {
		expandedRowKeys.value = expandedRowKeys.value.filter(key => key !== record._id);
	}
};

onMounted(() => {
	fetchData({ page: pagination.value.current, size: pagination.value.pageSize });
});
</script>

<style scoped>
.table-operations {
	margin-bottom: 16px;
}

.table-operations>button {
	margin-right: 8px;
}

.highlight {
	background-color: rgb(255, 192, 105);
	padding: 0px;
}
</style>
