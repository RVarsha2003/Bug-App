import StartPage from '../components/StartPage.vue';
import TesterPage from '../components/TesterPage.vue';
import AdminPage from '../components/AdminPage.vue';
import AssignWorkPage from '../components/AssignWorkPage.vue';
import DeveloperPage from '../components/DeveloperPage.vue';
import CompletePage from '../components/CompletePage.vue';
import PendingPage from '../components/PendingPage.vue';
// import IndexPage from '../pages/IndexPage.vue';

const routes = [
  {
    path: '/',
    component: () => import('src/components/StartPage.vue'),
    name: 'StartPage'
  },

  {
    path: '/TesterPage',
    component: () => import('src/components/TesterPage.vue'),
    name: 'TesterPage'
  },
  
  {
    path: '/AdminPage',
    component: () => import('src/components/AdminPage.vue'),
    name: 'AdminPage'
  },

  {
    path: '/AssignWorkPage',
    component: () => import('src/components/AssignWorkPage.vue'),
    name: 'AssignWorkPage'
  },

  {
    path: '/DeveloperPage',
    component: () => import('src/components/DeveloperPage.vue'),
    name: 'DeveloperPage'
  },
  {
    path: '/CompletePage',
    component: () => import('src/components/CompletePage.vue'),
    name: 'CompletePage'
  },
  {
    path: '/PendingPage',
    component: () => import('src/components/PendingPage.vue'),
    name: 'PendingPage'
  },
  
  
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
