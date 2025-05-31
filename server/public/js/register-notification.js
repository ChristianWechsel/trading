document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('notify-btn');
    if (btn) {
        btn.addEventListener('click', sendNotification);
    }
});

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
