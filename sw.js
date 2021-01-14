importScripts('js/sw-utils.js');

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js',
    'https://fonts.gstatic.com/s/lato/v17/S6uyw4BMUTPHjx4wXiWtFCc.woff2',
    'https://use.fontawesome.com/releases/v5.3.1/webfonts/fa-solid-900.woff2',
    'https://fonts.gstatic.com/s/quicksand/v21/6xKtdSZaM9iE8KbpRA_hK1QNYuDyPw.woff2',
    'https://use.fontawesome.com/releases/v5.3.1/webfonts/fa-brands-400.woff',
    'https://use.fontawesome.com/releases/v5.3.1/webfonts/fa-brands-400.ttf',
    'https://use.fontawesome.com/releases/v5.3.1/webfonts/fa-brands-400.woff2'

];

const APP_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

const CACHE_STATIC = 'static-v2';
const CACHE_INMUTABLE = 'inmutable-v1';
const CACHE_DINAMIC = 'dinamic-v2';

//EVENT INSTALL
self.addEventListener('install', ev => {

    const installStatic = caches.open(CACHE_STATIC)
        .then(cache => cache.addAll(APP_SHELL)).catch(console.log);

    const installInmutable = caches.open(CACHE_INMUTABLE)
        .then(cache => cache.addAll(APP_INMUTABLE));

    ev.waitUntil(Promise.all([installInmutable, installStatic]));
});


//EVENT ACTIVATE
self.addEventListener('activate', ev => {

    const deleteOldCaches = caches.keys().then(keys => {

        keys.forEach(key => {

            if (key !== CACHE_STATIC && key.includes('static')) {
                return caches.delete(key);
            }
            if (key !== CACHE_DINAMIC && key.includes('dinamic')) {
                return caches.delete(key);
            }

        });

    });

    ev.waitUntil(deleteOldCaches);
});

self.addEventListener('fetch', ev => {

    const DynFetch = caches.match(ev.request)
        .then(resp => {
            if (resp) {
                return resp;
            } else {
                // console.log(resp);
                return fetch(ev.request).then(fetchResp => {
                    return actualizaCacheDinamico(CACHE_DINAMIC, ev.request, fetchResp)
                })
            }
        });

    ev.respondWith(DynFetch);
})