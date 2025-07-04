document.addEventListener('DOMContentLoaded', () => {
    const logoutForm = document.querySelector('.logout-form');

    if (logoutForm) {
        logoutForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Verhindert das Neuladen der Seite

            try {
                const response = await fetch('/auth/logout', {
                    method: 'POST',
                });

                if (response.ok) {
                    // Bei Erfolg: Leite auf die Login-Seite um
                    window.location.href = '/login';
                } else {
                    alert('Logout fehlgeschlagen.');
                }
            } catch (err) {
                alert('Ein Fehler ist beim Logout aufgetreten.');
            }
        });
    }
});