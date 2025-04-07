import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from './pages/LoginPage.vue'
import CoursePage from './pages/CoursePage.vue'
import EnrollPage from './pages/EnrollPage.vue'
import StudentGradesPage from './pages/StudentGradesPage.vue'
import FacultyUploadPage from './pages/FacultyUploadPage.vue'

const routes = [
    { path: '/', component: LoginPage },
    { path: '/courses', component: CoursePage },
    { path: '/enroll', component: EnrollPage },
    { path: '/grades', component: StudentGradesPage },
    { path: '/faculty-upload', component: FacultyUploadPage },
]

export default createRouter({
    history: createWebHistory(),
    routes,
})
