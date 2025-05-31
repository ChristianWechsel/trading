// Service Worker für Push-Benachrichtigungen
self.addEventListener('push', function (event) {
    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = { title: 'Nachricht', body: event.data.text() };
        }
    }
    const title = data.title || 'Neue Benachrichtigung';
    const options = {
        body: data.body || '',
        icon: data.icon || 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
        data: { url: data.url }
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const url = event.notification.data && event.notification.data.url;
    if (url) {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
                for (const client of clientList) {
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
        );
    }
});
