document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Intersection Observer for scroll animations (Fade-in and Slide-in)
    const fadeInElements = document.querySelectorAll('.js-fade-in');
    const slideInElements = document.querySelectorAll('.js-slide-in');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => fadeInObserver.observe(el));

    const slideInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    slideInElements.forEach(el => slideInObserver.observe(el));


    // FAQ Section Accordion
    const faqItems = document.querySelectorAll('.faq-item h4');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.parentElement;
            parent.classList.toggle('active');

            const answer = item.nextElementSibling;
            if (parent.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });


    // --- Wallet Connection Logic ---

    // Solana Wallet (Phantom)
    const connectSolanaWalletBtn = document.getElementById('connectSolanaWalletBtn');
    const solanaBalanceDisplay = document.getElementById('solanaBalanceDisplay');
    const investorPortalBtn = document.querySelector('.investor-portal-btn'); // Get the investor portal button

    if (connectSolanaWalletBtn) {
        connectSolanaWalletBtn.addEventListener('click', async () => {
            try {
                const { solana } = window;

                // Check if Phantom wallet is installed
                if (!solana) {
                    alert('Phantom Wallet no encontrada. Por favor, instala Phantom para Solana.');
                    window.open('https://phantom.app/', '_blank');
                    return;
                }

                // Connect to Phantom wallet
                const resp = await solana.connect();
                const walletAddress = resp.publicKey.toString();
                console.log('Wallet de Solana conectada:', walletAddress);

                // Display wallet address (shortened) and full address on hover
                connectSolanaWalletBtn.textContent = `Conectado: ${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`;
                connectSolanaWalletBtn.title = `Dirección: ${walletAddress}`; // Full address on hover
                connectSolanaWalletBtn.classList.add('connected'); // Add a class for styling

                // Fetch SOL balance
                const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta')); // Use mainnet-beta for real SOL
                const balance = await connection.getBalance(resp.publicKey);
                const solBalance = balance / solanaWeb3.LAMPORTS_PER_SOL;

                solanaBalanceDisplay.innerHTML = `<strong>SOL: ${solBalance.toFixed(4)}</strong>`;
                solanaBalanceDisplay.title = `Saldo completo de SOL: ${solBalance}`; // Full balance on hover

                // Show investor portal button after successful connection
                investorPortalBtn.style.display = 'inline-block';

            } catch (err) {
                console.error('Error al conectar la wallet de Solana:', err);
                alert('Error al conectar la wallet de Solana. Asegúrate de que Phantom esté desbloqueado y permítelo.');
            }
        });
    }

    // MetaMask Wallet (EVM)
    const connectMetamaskWalletBtn = document.getElementById('connectMetamaskWalletBtn');
    const metamaskBalanceDisplay = document.getElementById('metamaskBalanceDisplay');

    if (connectMetamaskWalletBtn) {
        connectMetamaskWalletBtn.addEventListener('click', async () => {
            try {
                // Check if MetaMask is installed
                if (typeof window.ethereum === 'undefined') {
                    alert('MetaMask no encontrada. Por favor, instala MetaMask para EVM.');
                    window.open('https://metamask.io/download/', '_blank');
                    return;
                }

                // Request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const walletAddress = accounts[0];
                console.log('Wallet de MetaMask conectada:', walletAddress);

                // Display wallet address (shortened) and full address on hover
                connectMetamaskWalletBtn.textContent = `Conectado: ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;
                connectMetamaskWalletBtn.title = `Dirección: ${walletAddress}`; // Full address on hover
                connectMetamaskWalletBtn.classList.add('connected'); // Add a class for styling

                // Initialize ethers provider and signer
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();

                // Get ETH balance
                const balanceWei = await provider.getBalance(walletAddress);
                const ethBalance = ethers.formatEther(balanceWei); // Format balance to ETH

                metamaskBalanceDisplay.innerHTML = `<strong>ETH: ${parseFloat(ethBalance).toFixed(4)}</strong>`;
                metamaskBalanceDisplay.title = `Saldo completo de ETH: ${ethBalance}`; // Full balance on hover

                // Show investor portal button after successful connection
                investorPortalBtn.style.display = 'inline-block';

                // Optional: Listen for account changes in MetaMask
                window.ethereum.on('accountsChanged', (newAccounts) => {
                    if (newAccounts.length === 0) {
                        // User disconnected all accounts
                        console.log('MetaMask desconectado.');
                        connectMetamaskWalletBtn.textContent = 'Conectar MetaMask (EVM)';
                        connectMetamaskWalletBtn.classList.remove('connected');
                        metamaskBalanceDisplay.innerHTML = '';
                        investorPortalBtn.style.display = 'none'; // Hide portal button
                    } else {
                        // Account changed, re-display new account
                        const newWalletAddress = newAccounts[0];
                        connectMetamaskWalletBtn.textContent = `Conectado: ${newWalletAddress.substring(0, 6)}...${newWalletAddress.substring(newWalletAddress.length - 4)}`;
                        connectMetamaskWalletBtn.title = `Dirección: ${newWalletAddress}`;
                        // Update ETH balance for the new account
                        provider.getBalance(newWalletAddress).then(balanceWei => {
                            const ethBalance = ethers.formatEther(balanceWei);
                            metamaskBalanceDisplay.innerHTML = `<strong>ETH: ${parseFloat(ethBalance).toFixed(4)}</strong>`;
                            metamaskBalanceDisplay.title = `Saldo completo de ETH: ${ethBalance}`;
                        }).catch(console.error);
                    }
                });

                 // Optional: Listen for chain changes in MetaMask
                window.ethereum.on('chainChanged', (chainId) => {
                    console.log('MetaMask Chain Changed:', chainId);
                    // You might want to re-fetch balances or update UI based on the new chain
                    // For now, we'll just log it.
                    alert(`MetaMask cambió a Chain ID: ${parseInt(chainId, 16)}. Por favor, asegúrate de estar en la red correcta.`);
                });


            } catch (err) {
                console.error('Error al conectar MetaMask:', err);
                if (err.code === 4001) {
                    alert('Conexión a MetaMask rechazada por el usuario.');
                } else {
                    alert('Error al conectar MetaMask. Asegúrate de que MetaMask esté desbloqueado y permítelo.');
                }
            }
        });
    }

    // Function to check initial wallet connection status (on page load)
    const checkInitialWalletConnection = async () => {
        // Check Solana (Phantom)
        if (window.solana && window.solana.isConnected) {
            try {
                const walletAddress = window.solana.publicKey.toString();
                connectSolanaWalletBtn.textContent = `Conectado: ${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`;
                connectSolanaWalletBtn.title = `Dirección: ${walletAddress}`;
                connectSolanaWalletBtn.classList.add('connected');

                const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'));
                const balance = await connection.getBalance(window.solana.publicKey);
                const solBalance = balance / solanaWeb3.LAMPORTS_PER_SOL;
                solanaBalanceDisplay.innerHTML = `<strong>SOL: ${solBalance.toFixed(4)}</strong>`;
                solanaBalanceDisplay.title = `Saldo completo de SOL: ${solBalance}`;
                investorPortalBtn.style.display = 'inline-block';

            } catch (err) {
                console.warn('Phantom wallet was previously connected but an error occurred:', err);
                // Reset UI if connection is broken
                connectSolanaWalletBtn.textContent = 'Conectar Wallet Solana';
                connectSolanaWalletBtn.classList.remove('connected');
                solanaBalanceDisplay.innerHTML = '';
                investorPortalBtn.style.display = 'none';
            }
        }

        // Check MetaMask (EVM)
        if (typeof window.ethereum !== 'undefined' && window.ethereum.selectedAddress) {
            try {
                const walletAddress = window.ethereum.selectedAddress;
                connectMetamaskWalletBtn.textContent = `Conectado: ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;
                connectMetamaskWalletBtn.title = `Dirección: ${walletAddress}`;
                connectMetamaskWalletBtn.classList.add('connected');

                const provider = new ethers.BrowserProvider(window.ethereum);
                const balanceWei = await provider.getBalance(walletAddress);
                const ethBalance = ethers.formatEther(balanceWei);
                metamaskBalanceDisplay.innerHTML = `<strong>ETH: ${parseFloat(ethBalance).toFixed(4)}</strong>`;
                metamaskBalanceDisplay.title = `Saldo completo de ETH: ${ethBalance}`;
                investorPortalBtn.style.display = 'inline-block';

            } catch (err) {
                console.warn('MetaMask was previously connected but an error occurred:', err);
                // Reset UI if connection is broken
                connectMetamaskWalletBtn.textContent = 'Conectar MetaMask (EVM)';
                connectMetamaskWalletBtn.classList.remove('connected');
                metamaskBalanceDisplay.innerHTML = '';
                investorPortalBtn.style.display = 'none';
            }
        }
    };

    // Call the function on page load
    checkInitialWalletConnection();

});
