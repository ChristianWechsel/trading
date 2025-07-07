document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/auth/logout', {
                    method: 'POST',
                });

                if (response.ok) {
                    window.location.href = '/login';
                } else {
                    alert('Logout fehlgeschlagen.');
                }
            } catch (err) {
                alert('Ein Fehler ist beim Logout aufgetreten.');
            }
        });
    }

    // Login-Formular-Handling (aus login.js)
    // Login-Formular
    const form = document.querySelector('form');
    const errorElem = document.getElementById('error-message');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Verhindert das Neuladen der Seite
            errorElem.textContent = ''; // Fehlermeldung zurücksetzen

            const data = {
                username: form.username.value,
                password: form.password.value,
            };

            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                const result = await response.json();

                if (response.ok && result.message === 'Login successful') {
                    // Bei Erfolg: Leite auf die Home-Seite um
                    window.location.href = '/';
                } else {
                    // Bei Fehler: Zeige die Fehlermeldung an
                    errorElem.textContent = result.error || 'Login fehlgeschlagen.';
                }
            } catch (err) {
                errorElem.textContent = 'Ein Serverfehler ist aufgetreten.';
            }
        });
    }
});