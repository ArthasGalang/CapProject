import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
	broadcaster: 'pusher',
	key: '059dc1ecc7821ef442d3',
	cluster: 'ap1',
	forceTLS: true
});
