document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const menuToggle = document.querySelector('.menu-toggle');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

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
    const investorPortalBtn = document.querySelector('.investor-portal-btn');

    // **IMPORTANT: Set Solana Network to Devnet for testing**
    // Change to 'mainnet-beta' when deploying to production with real SOL
    const SOLANA_NETWORK = 'devnet'; // or 'mainnet-beta' or 'testnet'
    const solanaConnection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(SOLANA_NETWORK));


    if (connectSolanaWalletBtn) {
        connectSolanaWalletBtn.addEventListener('click', async () => {
            try {
                const { solana } = window;

                if (!solana) {
                    alert('Phantom Wallet no encontrada. Por favor, instala Phantom para Solana.');
                    window.open('https://phantom.app/', '_blank');
                    return;
                }

                // Request connection if not already connected
                if (!solana.isConnected) {
                    await solana.connect();
                }
                
                const walletAddress = solana.publicKey.toString();
                console.log('Wallet de Solana conectada:', walletAddress);

                connectSolanaWalletBtn.textContent = `Conectado: ${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`;
                connectSolanaWalletBtn.title = `Dirección: ${walletAddress}`;
                connectSolanaWalletBtn.classList.add('connected');

                // Fetch SOL balance
                try {
                    const balance = await solanaConnection.getBalance(solana.publicKey);
                    const solBalance = balance / solanaWeb3.LAMPORTS_PER_SOL;
                    solanaBalanceDisplay.innerHTML = `<strong>SOL: ${solBalance.toFixed(4)}</strong>`;
                    solanaBalanceDisplay.title = `Saldo completo de SOL: ${solBalance}`;
                } catch (balanceErr) {
                    console.error('Error al obtener saldo de SOL:', balanceErr);
                    solanaBalanceDisplay.innerHTML = `<span style="color: red;">Error al cargar saldo.</span>`;
                    solanaBalanceDisplay.title = 'Error al obtener saldo de SOL.';
                }

                investorPortalBtn.style.display = 'inline-block';

            } catch (err) {
                console.error('Error al conectar la wallet de Solana:', err);
                if (err.code === 4001) { // User rejected the request
                    alert('Conexión a Phantom rechazada por el usuario.');
                } else if (err.message && err.message.includes('Wallet is not connected')) {
                    alert('Wallet de Phantom no está conectada o desbloqueada. Intenta de nuevo.');
                } else {
                    alert('Error al conectar la wallet de Solana. Consulta la consola para más detalles.');
                }
                // Reset UI on error
                connectSolanaWalletBtn.textContent = 'Conectar Wallet Solana';
                connectSolanaWalletBtn.classList.remove('connected');
                solanaBalanceDisplay.innerHTML = '';
                investorPortalBtn.style.display = 'none';
            }
        });

        // Listen for Solana account changes or disconnects
        if (window.solana) {
            window.solana.on('accountChanged', (publicKey) => {
                if (publicKey) {
                    console.log('Phantom account changed to:', publicKey.toString());
                    const walletAddress = publicKey.toString();
                    connectSolanaWalletBtn.textContent = `Conectado: ${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`;
                    connectSolanaWalletBtn.title = `Dirección: ${walletAddress}`;
                    solanaConnection.getBalance(publicKey).then(balance => {
                        const solBalance = balance / solanaWeb3.LAMPORTS_PER_SOL;
                        solanaBalanceDisplay.innerHTML = `<strong>SOL: ${solBalance.toFixed(4)}</strong>`;
                        solanaBalanceDisplay.title = `Saldo completo de SOL: ${solBalance}`;
                    }).catch(console.error);
                    investorPortalBtn.style.display = 'inline-block';
                } else {
                    console.log('Phantom desconectado.');
                    connectSolanaWalletBtn.textContent = 'Conectar Wallet Solana';
                    connectSolanaWalletBtn.classList.remove('connected');
                    solanaBalanceDisplay.innerHTML = '';
                    investorPortalBtn.style.display = 'none';
                }
            });

            window.solana.on('disconnect', () => {
                console.log('Phantom desconectado.');
                connectSolanaWalletBtn.textContent = 'Conectar Wallet Solana';
                connectSolanaWalletBtn.classList.remove('connected');
                solanaBalanceDisplay.innerHTML = '';
                investorPortalBtn.style.display = 'none';
            });
        }
    }

    // MetaMask Wallet (EVM)
    const connectMetamaskWalletBtn = document.getElementById('connectMetamaskWalletBtn');
    const metamaskBalanceDisplay = document.getElementById('metamaskBalanceDisplay');

    if (connectMetamaskWalletBtn) {
        connectMetamaskWalletBtn.addEventListener('click', async () => {
            try {
                if (typeof window.ethereum === 'undefined') {
                    alert('MetaMask no encontrada. Por favor, instala MetaMask para EVM.');
                    window.open('https://metamask.io/download/', '_blank');
                    return;
                }

                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []); // Use provider.send for consistency
                const walletAddress = accounts[0];
                console.log('Wallet de MetaMask conectada:', walletAddress);

                connectMetamaskWalletBtn.textContent = `Conectado: ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;
                connectMetamaskWalletBtn.title = `Dirección: ${walletAddress}`;
                connectMetamaskWalletBtn.classList.add('connected');

                // Get ETH balance
                try {
                    const balanceWei = await provider.getBalance(walletAddress);
                    const ethBalance = ethers.formatEther(balanceWei);
                    metamaskBalanceDisplay.innerHTML = `<strong>ETH: ${parseFloat(ethBalance).toFixed(4)}</strong>`;
                    metamaskBalanceDisplay.title = `Saldo completo de ETH: ${ethBalance}`;
                } catch (balanceErr) {
                    console.error('Error al obtener saldo de ETH:', balanceErr);
                    metamaskBalanceDisplay.innerHTML = `<span style="color: red;">Error al cargar saldo.</span>`;
                    metamaskBalanceDisplay.title = 'Error al obtener saldo de ETH.';
                }
                
                investorPortalBtn.style.display = 'inline-block';

                // Listen for account changes in MetaMask
                window.ethereum.on('accountsChanged', (newAccounts) => {
                    if (newAccounts.length === 0) {
                        console.log('MetaMask desconectado.');
                        connectMetamaskWalletBtn.textContent = 'Conectar MetaMask (EVM)';
                        connectMetamaskWalletBtn.classList.remove('connected');
                        metamaskBalanceDisplay.innerHTML = '';
                        // Check if Solana is also disconnected before hiding portal
                        if (!window.solana || !window.solana.isConnected) {
                             investorPortalBtn.style.display = 'none';
                        }
                    } else {
                        const newWalletAddress = newAccounts[0];
                        connectMetamaskWalletBtn.textContent = `Conectado: ${newWalletAddress.substring(0, 6)}...${newWalletAddress.substring(newWalletAddress.length - 4)}`;
                        connectMetamaskWalletBtn.title = `Dirección: ${newWalletAddress}`;
                        provider.getBalance(newWalletAddress).then(balanceWei => {
                            const ethBalance = ethers.formatEther(balanceWei);
                            metamaskBalanceDisplay.innerHTML = `<strong>ETH: ${parseFloat(ethBalance).toFixed(4)}</strong>`;
                            metamaskBalanceDisplay.title = `Saldo completo de ETH: ${ethBalance}`;
                        }).catch(console.error);
                        investorPortalBtn.style.display = 'inline-block';
                    }
                });

                window.ethereum.on('chainChanged', async (chainId) => {
                    console.log('MetaMask Chain Changed:', chainId);
                    alert(`MetaMask cambió a Chain ID: ${parseInt(chainId, 16)}. Por favor, asegúrate de estar en la red correcta.`);
                    // Attempt to re-fetch balance for the new chain
                    try {
                        const currentAccounts = await provider.send("eth_accounts", []);
                        if (currentAccounts.length > 0) {
                            const walletAddress = currentAccounts[0];
                            const balanceWei = await provider.getBalance(walletAddress);
                            const ethBalance = ethers.formatEther(balanceWei);
                            metamaskBalanceDisplay.innerHTML = `<strong>ETH: ${parseFloat(ethBalance).toFixed(4)}</strong>`;
                            metamaskBalanceDisplay.title = `Saldo completo de ETH: ${ethBalance}`;
                        }
                    } catch (error) {
                        console.error('Error al actualizar el saldo de ETH después del cambio de red:', error);
                        metamaskBalanceDisplay.innerHTML = `<span style="color: red;">Error de red.</span>`;
                    }
                });

            } catch (err) {
                console.error('Error al conectar MetaMask:', err);
                if (err.code === 4001) {
                    alert('Conexión a MetaMask rechazada por el usuario.');
                } else {
                    alert('Error al conectar MetaMask. Consulta la consola para más detalles.');
                }
                // Reset UI on error
                connectMetamaskWalletBtn.textContent = 'Conectar MetaMask (EVM)';
                connectMetamaskWalletBtn.classList.remove('connected');
                metamaskBalanceDisplay.innerHTML = '';
                // Check if Solana is also disconnected before hiding portal
                if (!window.solana || !window.solana.isConnected) {
                     investorPortalBtn.style.display = 'none';
                }
            }
        });
    }

    // Function to check initial wallet connection status (on page load)
    const checkInitialWalletConnection = async () => {
        let solanaConnectedInitially = false;
        let metamaskConnectedInitially = false;

        // Check Solana (Phantom)
        if (window.solana && window.solana.isConnected) {
            try {
                const walletAddress = window.solana.publicKey.toString();
                connectSolanaWalletBtn.textContent = `Conectado: ${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`;
                connectSolanaWalletBtn.title = `Dirección: ${walletAddress}`;
                connectSolanaWalletBtn.classList.add('connected');

                const balance = await solanaConnection.getBalance(window.solana.publicKey);
                const solBalance = balance / solanaWeb3.LAMPORTS_PER_SOL;
                solanaBalanceDisplay.innerHTML = `<strong>SOL: ${solBalance.toFixed(4)}</strong>`;
                solanaBalanceDisplay.title = `Saldo completo de SOL: ${solBalance}`;
                solanaConnectedInitially = true;

            } catch (err) {
                console.warn('Phantom wallet fue conectada pero ocurrió un error al obtener saldo:', err);
                connectSolanaWalletBtn.textContent = 'Conectar Wallet Solana';
                connectSolanaWalletBtn.classList.remove('connected');
                solanaBalanceDisplay.innerHTML = `<span style="color: red;">Error al cargar.</span>`;
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
                metamaskConnectedInitially = true;

            } catch (err) {
                console.warn('MetaMask wallet fue conectada pero ocurrió un error al obtener saldo:', err);
                connectMetamaskWalletBtn.textContent = 'Conectar MetaMask (EVM)';
                connectMetamaskWalletBtn.classList.remove('connected');
                metamaskBalanceDisplay.innerHTML = `<span style="color: red;">Error al cargar.</span>`;
            }
        }

        // Show investor portal if at least one wallet is connected
        if (solanaConnectedInitially || metamaskConnectedInitially) {
            investorPortalBtn.style.display = 'inline-block';
        } else {
            investorPortalBtn.style.display = 'none';
        }
    };

    // Delay initial check slightly to allow wallet extensions to load fully
    setTimeout(checkInitialWalletConnection, 500); // 500ms delay

});
