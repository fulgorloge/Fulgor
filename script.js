document.addEventListener('DOMContentLoaded', () => {
    // Ejemplo de funcionalidad para el botón "Conectar Wallet Solana"
    const connectWalletBtn = document.getElementById('connectWalletBtn');
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', async () => {
            // Aquí iría la lógica para conectar la wallet Solana (ej. Phantom)
            // Esto es solo un placeholder, la implementación real es compleja
            try {
                // Verificar si Phantom Wallet está instalado
                if ('solana' in window) {
                    const provider = window.solana;
                    if (provider.isPhantom) {
                        // Solicitar conexión a la wallet
                        const resp = await provider.connect();
                        console.log('Wallet conectada:', resp.publicKey.toString());
                        alert('¡Wallet Solana conectada con éxito! Public Key: ' + resp.publicKey.toString());
                        connectWalletBtn.textContent = 'Wallet Conectada';
                        connectWalletBtn.disabled = true;
                        // Aquí podrías actualizar la UI con el saldo de FULGOR, etc.
                    }
                } else {
                    alert('Phantom Wallet no encontrada. Por favor, instálala para conectar.');
                    window.open('https://phantom.app/', '_blank'); // Abrir enlace a Phantom
                }
            } catch (err) {
                console.error('Error al conectar la wallet:', err);
                alert('Error al conectar la wallet. Consulta la consola para más detalles.');
            }
        });
    }

    // Funcionalidad para desplegar/contraer FAQ
    const faqItems = document.querySelectorAll('.faq-item h4');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            item.parentNode.classList.toggle('active');
        });
    });

    // Desplazamiento suave para los enlaces de navegación
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
