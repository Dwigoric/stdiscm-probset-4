import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './pages/LoginPage.vue'
import CoursePage from './pages/CoursePage.vue'
import EnrollPage from './pages/EnrollPage.vue'
import StudentGradesPage from './pages/StudentGradesPage.vue'
import FacultyUploadPage from './pages/FacultyUploadPage.vue'
import CreateUserPage from './pages/CreateUserPage.vue'
import MyCoursesPage from './pages/MyCoursesPage.vue'

const routes = [
    { path: '/', component: LoginPage },
    { path: '/courses', component: CoursePage },
    { path: '/enroll', component: EnrollPage },
    { path: '/grades', component: StudentGradesPage },
    { path: '/faculty-upload', component: FacultyUploadPage },
    { path: '/create-user', component: CreateUserPage },
    { path: '/my-courses', component: MyCoursesPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});


router.beforeEach((to, from, next) => {
    if (to.fullPath !== from.fullPath) {
        // This will refresh the page before navigating
        window.location.reload();
    }
    next();
});

export default createRouter({
    history: createWebHistory(),
    routes,
})
