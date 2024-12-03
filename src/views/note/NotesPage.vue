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
			:expand-column-width="100" :expanded-row-keys="expandedRowKeys" rowKey="_id" @expand="onExpand"
			@change="handleChange">
			<template #expandedRowRender="{ record }">
				<p style="margin: 0">
					{{ record.originalText }}
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
				<template v-if="column.key === 'url'">
					<a :href="text" class="action-route">
						{{ text }}
					</a>
				</template>
				<template v-if="column.key === 'summariesCount'">
					<router-link :to="`/notes/${record._id}/summaries`" class="action-route">
						{{ text }}
					</router-link>
				</template>
				<template v-if="column.key === 'translationsCount'">
					<router-link :to="`/notes/${record._id}/translations`" class="action-route">
						{{ text }}
					</router-link>
				</template>
				<template v-if="column.key === 'relatesCount'">
					<router-link :to="`/notes/${record._id}/relations`" class="action-route">
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

	try {
		const formatParams = {
			...params,
			page: params.page || pagination.value.current,
			size: params.size || pagination.value.pageSize,
		}

		if (filteredInfo.value.title && filteredInfo.value.title.length > 0) {
			formatParams.title = filteredInfo.value.title[0];
		}

		if (filteredInfo.value.url && filteredInfo.value.url.length > 0) {
			formatParams.url = filteredInfo.value.url[0];
		}

		const response = await apiClient.get('u/notes', {
			params: formatParams
		});

		dataSource.value = response.data.data.notes || [];
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
		title: 'Title',
		dataIndex: 'title',
		key: "title",
		sorter: true,
		sortOrder: sortedInfo.value.columnKey === 'title' && sortedInfo.value.order,
		ellipsis: true,
		width: '20%',
		filterSearch: true,
		customFilterDropdown: true,
	},
	{
		title: 'Url',
		dataIndex: 'url',
		key: "url",
		filterSearch: true,
		sorter: true,
		sortOrder: sortedInfo.value.columnKey === 'url' && sortedInfo.value.order,
		ellipsis: true,
		width: '30%',
		customFilterDropdown: true,

	},
	{
		title: 'Language',
		dataIndex: 'language',
		width: '10%',
		sorter: true,
		sortOrder: sortedInfo.value.columnKey === 'language' && sortedInfo.value.order,
	},
	{
		title: 'Text',
		dataIndex: 'shortText',
		ellipsis: true,
		width: '40%',
		filterSearch: true,
		customFilterDropdown: true,
	},
	{
		title: 'Relates Count',
		key: 'relatesCount',
		dataIndex: 'relatesCount',
		width: '20%',
		filterSearch: true,
		ellipsis: true,
		sorter: true,
		sortOrder: sortedInfo.value.columnKey === 'relatesCount' && sortedInfo.value.order,
	},
	{
		title: 'Summary Count',
		key: 'summariesCount',
		dataIndex: 'summariesCount',
		width: '20%',
		filterSearch: true,
		ellipsis: true,
		sorter: true,
		sortOrder: sortedInfo.value.columnKey === 'summariesCount' && sortedInfo.value.order,
	},
	{
		title: 'Transaction Count',
		key: 'translationsCount',
		dataIndex: 'translationsCount',
		width: '20%',
		filterSearch: true,
		ellipsis: true,
		sorter: true,
		sortOrder: sortedInfo.value.columnKey === 'translationsCount' && sortedInfo.value.order,
	},
	{
		title: 'Created At',
		key: 'createdAt',
		dataIndex: 'createdAt',
		width: '20%',
		ellipsis: true,
		sorter: true,
		sortOrder: sortedInfo.value.columnKey === 'createdAt' && sortedInfo.value.order,
	},
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

	let constTextIndex = ["title", 'url', 'shortText'];
	if (constTextIndex.include(dataIndex)) {
		filteredInfo.value[dataIndex] = [state.searchText];
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
