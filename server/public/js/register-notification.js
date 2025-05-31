document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('notify-btn');
    if (btn) {
        btn.addEventListener('click', registerServiceWorkerAndSubscribe);
    }
});


async function registerServiceWorkerAndSubscribe() {
    if (!('serviceWorker' in navigator)) {
        alert('Service Worker werden nicht unterstützt.');
        return;
    }
    // Service Worker registrieren
    const reg = await navigator.serviceWorker.register('/sw.js');
    // VAPID Public Key vom Server holen
    const vapidKey = await fetch('/notification/vapid-public-key').then(r => r.text());
    // Push Subscription anlegen
    let subscription = await reg.pushManager.getSubscription();
    if (!subscription) {
        subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKey)
        });
    }
    // Subscription an den Server senden
    await fetch('/notification/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
    });
    alert('Push-Benachrichtigungen aktiviert!');
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function sendNotification() {
    if (!('Notification' in window)) {
        alert('Dieser Browser unterstützt keine Benachrichtigungen.');
        return;
    }
    if (Notification.permission === 'granted') {
        new Notification('Registrierung erfolgreich!', {
            body: 'Du erhältst jetzt Benachrichtigungen.',
            icon: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
                new Notification('Registrierung erfolgreich!', {
                    body: 'Du erhältst jetzt Benachrichtigungen.',
                    icon: 'https://cdn-icons-png.flaticon.com/512/190/190411.png',
                });
            } else {
                alert('Benachrichtigungen wurden nicht erlaubt.');
            }
        });
    } else {
        alert('Benachrichtigungen wurden blockiert.');
    }
}
