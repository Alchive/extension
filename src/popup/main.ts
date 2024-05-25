import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './Popup.vue'
import { setupApp } from '~/logic/common-setup'
import '../styles'
const pinia = createPinia()

const app = createApp(App)
setupApp(app)
app.use(pinia)
app.mount('#app')
