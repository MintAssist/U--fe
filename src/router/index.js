import { createRouter, createWebHistory } from 'vue-router';
// layout
import MainLayout from '@/layouts/MainLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import SupportLayout from '@/layouts/SupportLayout.vue';

// Common page
import DashboardPage from '@/views/main/DashboardPage.vue';

// Auth page
import LoginPage from '@/views/auth/LoginPage.vue';
import SignUpPage from '@/views/auth/SignUpPage.vue';
import VerifyMailPage from '@/views/auth/VerifyMailPage.vue';
import ForgotPasswordPage from '@/views/auth/ForgotPasswordPage.vue';
import RecoveryPasswordPage from '@/views/auth/RecoveryPasswordPage.vue';

// Account page
import MePage from '@/views/me/MePage.vue';
import ApiKeyPage from '@/views/me/ApiKeyPage.vue';
import ChangePasswordPage from '@/views/me/ChangePasswordPage.vue';

// Users page
import NotesPage from '@/views/note/NotesPage.vue';
import SummariesPage from '@/views/note/SummariesPage.vue';
import TranslationsPage from '@/views/note/TranslationsPage.vue';
import RelationsPage from '@/views/note/RelationsPage.vue';

import authenticate from '@/interceptors/authenticate';

const routes = [
	{
		path: '/support',
		component: SupportLayout,
		children: [
			{
				path: 'reset-password/:userId',
				name: 'Change Password',
				component: RecoveryPasswordPage
			},
			{
				path: 'verify-mail/:userId',
				name: 'Verify Mail',
				component: VerifyMailPage
			},
			{
				path: 'sign-up',
				name: 'Sign Up',
				component: SignUpPage
			},
			{
				path: 'forgot-password',
				name: 'Forgot Password',
				component: ForgotPasswordPage
			},
		]
	},
	{
		path: '/',
		component: AuthLayout,
		meta: { requiresNotAuth: true },
		children: [
			{
				path: 'login',
				name: 'Login',
				component: LoginPage
			},
		]
	},
	{
		path: '/',
		component: MainLayout,
		meta: { requiresAuth: true },
		children: [
			{
				path: 'dashboard',
				name: 'Dashboard',
				component: DashboardPage,
				meta: { title: 'Dashboard', breadcrumb: [{ name: 'Home', link: '/' }, { name: 'Dashboard'}] },
			},
			{
				path: 'api-key',
				name: 'Api Key',
				component: ApiKeyPage,
				meta: { title: 'Api Key', breadcrumb: [{ name: 'Home', link: '/' }, { name: 'Api Key' }] },
			},
			{
				path: 'me',
				name: 'My Account',
				component: MePage,
				meta: { title: 'My Account', breadcrumb: [{ name: 'Home', link: '/' }, { name: 'My Account' }] },
			},
			{
				path: 'change-password',
				name: 'Change Password',
				component: ChangePasswordPage,
				meta: { title: 'Change Password', breadcrumb: [{ name: 'Home', link: '/' }, { name: 'Change Password' }] },
			},
			{
				path: 'notes',
				name: 'Notes',
				component: NotesPage,
				meta: { title: 'Notes', breadcrumb: [{ name: 'Home', link: '/' }, { name: 'Notes' }] },
			},
			{
				path: 'notes/:noteId/summaries',
				name: 'Summaries',
				component: SummariesPage,
				meta: { title: 'Summaries', breadcrumb: [{ name: 'Home', link: '/' }, { name: 'Notes', link: '/notes' }, { name: 'Summaries'}] },
			},
			{
				path: 'notes/:noteId/translations',
				name: 'Translations',
				component: TranslationsPage,
				meta: { title: 'Translations', breadcrumb: [{ name: 'Home', link: '/' }, { name: 'Notes', link: '/notes' }, { name: 'Translations'}] },
			},
			{
				path: 'notes/:noteId/relations',
				name: 'Relations',
				component: RelationsPage,
				meta: { title: 'Relations', breadcrumb: [{ name: 'Home', link: '/' }, { name: 'Notes', link: '/notes' }, { name: 'Relations' }] },
			},
		]
	},
];

const router = createRouter({
	history: createWebHistory('/'),
	routes,
});

router.beforeEach((to, from, next) => {
	const title = to.name || 'Default Title';
	document.title = title;
	next();
});

router.beforeEach(authenticate)

export default router;
