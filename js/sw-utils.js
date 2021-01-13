function actualizaCacheDinamico(cacheName, req, res) {
    caches.open(cacheName).then(cache => {
        cache.put(req, res.clone());
    })
    return res.clone();
}