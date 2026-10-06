self.addEventListener('install', (event) => {
    // Принудительно переходим в стадию активации, не дожидаясь закрытия вкладок
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Удаляем все существующие кэши
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => caches.delete(key))
            );
        }).then(() => {
            // Отключаем регистрацию самого Service Worker
            return self.registration.unregister();
        }).then(() => {
            // Форсируем обновление всех вкладок, чтобы они потеряли связь с SW
            return self.clients.matchAll();
        }).then((clients) => {
            clients.forEach((client) => client.navigate(client.url));
        })
    );
});