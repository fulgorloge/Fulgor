// --- CONFIGURACIÓN CRÍTICA: MODIFICA ESTOS VALORES REALES ---
// (No cambies los nombres de las variables, solo los valores)

// CONFIGURACIÓN DE SOLANA
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com'; // O 'https://api.devnet.solana.com' para pruebas
                                                             // Para un nodo más robusto y límites más altos, considera proveedores como QuickNode o Alchemy.
const FULGOR_SOLANA_TOKEN_MINT_ADDRESS = 'TuDireccionDelTokenFULGORenSolanaAqui'; // Ejemplo: 'Es9vMFrzaCERmJfrF4H2dtwNgKQy4GVBCbDzxVzKmPFJ' (USDC ejemplo)
const FULGOR_SOLANA_TOKEN_DECIMALS = 9; // Decimales de tu token FULGOR en Solana (comúnmente 9)

// CONFIGURACIÓN DE EVM (MetaMask - Ethereum/Polygon/BSC/etc.)
const EVM_RPC_URL = 'https://mainnet.infura.io/v3/TU_CLAVE_INFURA'; // ¡REEMPLAZA CON TU PROPIA CLAVE INFURA!
                                                                  // Alternativas si no tienes clave Infura:
                                                                  // Ethereum Mainnet: 'https://cloudflare-eth.com/'
                                                                  // Binance Smart Chain (BSC): 'https://bsc-dataseed.binance.org/'
                                                                  // Polygon Mainnet: 'https://polygon-rpc.com/'
const FULGOR_EVM_TOKEN_CONTRACT_ADDRESS = 'TuDireccionDelTokenFULGORenEVMAqui'; // Ejemplo: '0xdac17f958d2ee523a2206206994597c13d831ec7' (USDT ejemplo en ETH)
const FULGOR_EVM_TOKEN_DECIMALS = 18; // Decimales de tu token FULGOR en EVM (comúnmente 18, como ETH)

// ABI MÍNIMA PARA ERC-20 (Necesaria para leer el balance del token)
const ERC20_ABI = [
    { "constant": true, "inputs": [{"name": "_owner", "type": "address"}], "name": "balanceOf", "outputs": [{"name": "balance", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function" },
    { "constant": true, "inputs": [], "name": "decimals", "outputs": [{"name": "", "type": "uint8"}], "payable": false, "stateMutability": "view", "type": "function" }
];

// --- FIN DE CONFIGURACIÓN CRÍTICA ---


document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const connectSolanaWalletBtn = document.getElementById('connectSolanaWalletBtn');
    const solanaBalanceDisplay = document.getElementById('solanaBalanceDisplay');
    const connectMetamaskWalletBtn = document.getElementById('connectMetamaskWalletBtn');
    const metamaskBalanceDisplay = document.getElementById('metamaskBalanceDisplay');
    const investorPortalBtn = document.querySelector('.investor-portal-btn');

    let solanaPublicKey = null; // Almacena la Public Key de Solana conectada
    let evmAddress = null;      // Almacena la dirección EVM conectada

    // Inicializar conexión a RPC de Solana
    // @ts-ignore
    const solanaConnection = new solanaWeb3.Connection(SOLANA_RPC_URL, 'confirmed');
    // @ts-ignore
    let evmProvider = null; // Se inicializará con window.ethereum o un JsonRpcProvider

    // --- Funciones de Utilidad y Formateo ---

    // Formatear BigInts de tokens (de ethers.js) para visualización
    function formatUnits(bigintAmount, decimals) {
        if (!bigintAmount || decimals === undefined || window.ethers === undefined) return 'N/A';
        try {
            return window.ethers.formatUnits(bigintAmount, decimals);
        } catch (e) {
            console.error('Error al formatear unidades:', e);
            return 'Formato Error';
        }
    }

    // --- Funciones para Obtener Saldos ---

    async function getSolanaBalances(publicKey) {
        if (!publicKey) {
            solanaBalanceDisplay.innerHTML = '';
            return;
        }
        solanaBalanceDisplay.innerHTML = 'Cargando...'; // Mensaje de carga
        try {
            // Saldo de SOL (token nativo de Solana)
            const solBalanceLamports = await solanaConnection.getBalance(publicKey);
            const solBalance = solBalanceLamports / solanaWeb3.LAMPORTS_PER_SOL;

            // Saldo de FULGOR (SPL Token)
            let fulgorSolanaBalance = 0;
            if (FULGOR_SOLANA_TOKEN_MINT_ADDRESS && FULGOR_SOLANA_TOKEN_MINT_ADDRESS !== 'TuDireccionDelTokenFULGORenSolanaAqui') {
                try {
                    const tokenMintPublicKey = new solanaWeb3.PublicKey(FULGOR_SOLANA_TOKEN_MINT_ADDRESS);
                    const tokenAccounts = await solanaConnection.getTokenAccountsByOwner(
                        publicKey,
                        { mint: tokenMintPublicKey }
                    );

                    if (tokenAccounts.value.length > 0) {
                        // Obtener la información parseada de la cuenta de token
                        const accountInfo = await solanaConnection.getParsedAccountInfo(tokenAccounts.value[0].pubkey);
                        // @ts-ignore
                        fulgorSolanaBalance = accountInfo.value.data.parsed.info.tokenAmount.uiAmount;
                    } else {
                        fulgorSolanaBalance = 0; // El usuario no tiene una cuenta para este token
                    }
                } catch (err) {
                    console.error('Error al obtener saldo FULGOR (Solana):', err);
                    fulgorSolanaBalance = 'Error';
                }
            } else {
                fulgorSolanaBalance = 'Pendiente config.'; // Mensaje si la dirección no está configurada
            }

            solanaBalanceDisplay.innerHTML = `
                SOL: <strong>${solBalance.toFixed(4)}</strong><br>
                FULGOR (SOL): <strong>${typeof fulgorSolanaBalance === 'number' ? fulgorSolanaBalance.toFixed(FULGOR_SOLANA_TOKEN_DECIMALS > 4 ? 4 : FULGOR_SOLANA_TOKEN_DECIMALS) : fulgorSolanaBalance}</strong>
            `;
        } catch (error) {
            console.error('Error al obtener saldos Solana:', error);
            solanaBalanceDisplay.innerHTML = '<span style="color: red;">Error al cargar saldos Solana.</span>';
        }
    }

    async function getEvmBalances(address) {
        if (!address) {
            metamaskBalanceDisplay.innerHTML = '';
            return;
        }
        metamaskBalanceDisplay.innerHTML = 'Cargando...'; // Mensaje de carga
        try {
            // Si MetaMask está instalado, usa su proveedor. Si no, usa un JsonRpcProvider para solo lectura.
            if (typeof window.ethereum !== 'undefined') {
                 // @ts-ignore
                 evmProvider = new window.ethers.BrowserProvider(window.ethereum); 
            } else if (!evmProvider) { // Si no hay MetaMask y no se ha inicializado, crea un JsonRpcProvider
                 // @ts-ignore
                 evmProvider = new window.ethers.JsonRpcProvider(EVM_RPC_URL);
            }

            if (!evmProvider) {
                 metamaskBalanceDisplay.innerHTML = '<span style="color: red;">Provider EVM no disponible.</span>';
                 return;
            }

            // Saldo de ETH (o token nativo de la red EVM actual)
            const ethBalanceWei = await evmProvider.getBalance(address);
            const ethBalance = formatUnits(ethBalanceWei, 18); // ETH siempre tiene 18 decimales

            // Saldo de FULGOR (ERC-20 Token)
            let fulgorEvmBalance = 0;
            if (FULGOR_EVM_TOKEN_CONTRACT_ADDRESS && FULGOR_EVM_TOKEN_CONTRACT_ADDRESS !== 'TuDireccionDelTokenFULGORenEVMAqui') {
                try {
                    // @ts-ignore
                    const tokenContract = new window.ethers.Contract(FULGOR_EVM_TOKEN_CONTRACT_ADDRESS, ERC20_ABI, evmProvider);
                    const tokenBalanceBigInt = await tokenContract.balanceOf(address);
                    fulgorEvmBalance = formatUnits(tokenBalanceBigInt, FULGOR_EVM_TOKEN_DECIMALS);
                } catch (err) {
                    console.error('Error al obtener saldo FULGOR (EVM):', err);
                    fulgorEvmBalance = 'Error';
                }
            } else {
                fulgorEvmBalance = 'Pendiente config.'; // Mensaje si la dirección no está configurada
            }

            metamaskBalanceDisplay.innerHTML = `
                ETH/Native: <strong>${parseFloat(ethBalance).toFixed(4)}</strong><br>
                FULGOR (EVM): <strong>${typeof fulgorEvmBalance === 'number' ? fulgorEvmBalance.toFixed(FULGOR_EVM_TOKEN_DECIMALS > 4 ? 4 : FULGOR_EVM_TOKEN_DECIMALS) : fulgorEvmBalance}</strong>
            `;
        } catch (error) {
            console.error('Error al obtener saldos EVM:', error);
            metamaskBalanceDisplay.innerHTML = '<span style="color: red;">Error al cargar saldos EVM.</span>';
        }
    }


    // --- Funciones de Actualización de UI y Manejo de Conexiones ---

    function updateSolanaWalletButton(publicKey) {
        if (publicKey) {
            solanaPublicKey = publicKey.toString();
            const displayKey = solanaPublicKey.substring(0, 4) + '...' + solanaPublicKey.substring(solanaPublicKey.length - 4);
            connectSolanaWalletBtn.textContent = `Solana: ${displayKey}`;
            connectSolanaWalletBtn.classList.add('connected');
            getSolanaBalances(publicKey); // Obtener saldos al conectar
        } else {
            solanaPublicKey = null;
            connectSolanaWalletBtn.textContent = 'Conectar Wallet Solana';
            connectSolanaWalletBtn.classList.remove('connected');
            solanaBalanceDisplay.innerHTML = ''; // Limpiar saldo
        }
        updateInvestorPortalButton(); // Actualizar visibilidad del portal
    }

    function updateMetamaskWalletButton(address) {
        if (address) {
            evmAddress = address.toString();
            const displayAddress = evmAddress.substring(0, 6) + '...' + evmAddress.substring(evmAddress.length - 4);
            connectMetamaskWalletBtn.textContent = `MetaMask: ${displayAddress}`;
            connectMetamaskWalletBtn.classList.add('connected');
            getEvmBalances(address); // Obtener saldos al conectar
        } else {
            evmAddress = null;
            connectMetamaskWalletBtn.textContent = 'Conectar MetaMask (EVM)';
            connectMetamaskWalletBtn.classList.remove('connected');
            metamaskBalanceDisplay.innerHTML = ''; // Limpiar saldo
        }
        updateInvestorPortalButton(); // Actualizar visibilidad del portal
    }

    // El botón "Portal Inversionistas" se muestra si AL MENOS una wallet está conectada
    function updateInvestorPortalButton() {
        if (investorPortalBtn) {
            if (solanaPublicKey || evmAddress) {
                investorPortalBtn.style.display = 'inline-block';
            } else {
                investorPortalBtn.style.display = 'none';
            }
        }
    }

    // --- Lógica Principal (Conexión de Wallets y Listeners) ---

    // Inicializar el estado de los botones y el portal al cargar la página
    updateSolanaWalletButton(null);
    updateMetamaskWalletButton(null);
    updateInvestorPortalButton();

    // 1. Conexión a Solana (Phantom)
    if (connectSolanaWalletBtn) {
        connectSolanaWalletBtn.addEventListener('click', async () => {
            // @ts-ignore
            if ('solana' in window) {
                // @ts-ignore
                const provider = window.solana;
                if (provider.isPhantom) {
                    try {
                        const resp = await provider.connect();
                        console.log('Wallet Solana conectada:', resp.publicKey.toString());
                        alert('¡Wallet Solana conectada con éxito! Public Key: ' + resp.publicKey.toString());
                        updateSolanaWalletButton(resp.publicKey);

                        // Adjuntar listeners solo si no están ya conectados
                        if (!provider._events || !provider._events.disconnect) { // Simple check, could be more robust
                            provider.on('disconnect', () => {
                                console.log('Wallet Solana desconectada.');
                                alert('Tu wallet Solana ha sido desconectada.');
                                updateSolanaWalletButton(null);
                            });
                        }
                        if (!provider._events || !provider._events.accountChanged) {
                            provider.on('accountChanged', (publicKey) => {
                                if (publicKey) {
                                    console.log('Cuenta Solana cambiada a:', publicKey.toString());
                                    alert('Tu cuenta Solana ha cambiado a: ' + publicKey.toString());
                                    updateSolanaWalletButton(publicKey);
                                } else {
                                    console.log('Cuenta Solana desconectada o no seleccionada.');
                                    alert('Cuenta Solana desconectada o no seleccionada en la wallet.');
                                    updateSolanaWalletButton(null);
                                }
                            });
                        }

                    } catch (err) {
                        console.error('Error al conectar la wallet Solana:', err);
                        if (err.code === 4001) {
                            alert('Conexión de wallet Solana rechazada por el usuario.');
                        } else {
                            alert('Error al conectar la wallet Solana: ' + err.message + '. Consulta la consola para más detalles.');
                        }
                        updateSolanaWalletButton(null);
                    }
                } else {
                    alert('Phantom Wallet no detectada. Por favor, asegúrate de que está instalada y activa.');
                    window.open('https://phantom.app/', '_blank');
                }
            } else {
                alert('No se detectó ninguna extensión de wallet Solana (ej. Phantom). Por favor, instala una.');
                window.open('https://phantom.app/', '_blank');
            }
        });

        // Intentar una conexión silenciosa a Solana al cargar la página
        (async () => {
            // @ts-ignore
            if ('solana' in window && window.solana.isPhantom) {
                try {
                    // @ts-ignore
                    const isConnected = await window.solana.connect({ onlyIfTrusted: true });
                    if (isConnected.publicKey) {
                        updateSolanaWalletButton(isConnected.publicKey);
                        console.log('Conexión silenciosa Solana exitosa:', isConnected.publicKey.toString());
                        // @ts-ignore
                        window.solana.on('disconnect', () => {
                            console.log('Wallet Solana desconectada.');
                            alert('Tu wallet Solana ha sido desconectada.');
                            updateSolanaWalletButton(null);
                        });
                        // @ts-ignore
                        window.solana.on('accountChanged', (publicKey) => {
                            if (publicKey) {
                                console.log('Cuenta Solana cambiada a:', publicKey.toString());
                                alert('Tu cuenta Solana ha cambiado a: ' + publicKey.toString());
                                updateSolanaWalletButton(publicKey);
                            } else {
                                console.log('Cuenta Solana desconectada o no seleccionada.');
                                alert('Cuenta Solana desconectada o no seleccionada en la wallet.');
                                updateSolanaWalletButton(null);
                            }
                        });
                    }
                } catch (error) {
                    console.log('No hay conexión silenciosa Solana o usuario no confiable:', error.message);
                    updateSolanaWalletButton(null);
                }
            }
        })();
    }

    // 2. Conexión a MetaMask (EVM)
    if (connectMetamaskWalletBtn) {
        connectMetamaskWalletBtn.addEventListener('click', async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const account = accounts[0];
                    console.log('MetaMask conectada:', account);
                    alert('¡MetaMask conectada con éxito! Dirección: ' + account);
                    updateMetamaskWalletButton(account);

                    // Adjuntar listeners para cambios de cuenta y red
                    // Solo adjuntar si no existen para evitar duplicados en conexiones silenciosas/repetidas
                    if (!window.ethereum._events || !window.ethereum._events.accountsChanged) {
                         window.ethereum.on('accountsChanged', (newAccounts) => {
                            if (newAccounts.length > 0) {
                                console.log('Cuenta MetaMask cambiada a:', newAccounts[0]);
                                alert('Tu cuenta MetaMask ha cambiado a: ' + newAccounts[0]);
                                updateMetamaskWalletButton(newAccounts[0]);
                            } else {
                                console.log('MetaMask desconectada o sin cuentas seleccionadas.');
                                alert('MetaMask desconectada o sin cuentas seleccionadas.');
                                updateMetamaskWalletButton(null);
                            }
                        });
                    }
                   
                    if (!window.ethereum._events || !window.ethereum._events.chainChanged) {
                        window.ethereum.on('chainChanged', (chainId) => {
                            console.log('Red MetaMask cambiada a Chain ID:', chainId);
                            alert('Tu red MetaMask ha cambiado a Chain ID: ' + chainId);
                            if (evmAddress) { 
                                getEvmBalances(evmAddress); // Re-consultar saldos si la red cambia
                            }
                        });
                    }

                } catch (error) {
                    console.error('Error al conectar MetaMask:', error);
                    if (error.code === 4001) {
                        alert('Conexión MetaMask rechazada por el usuario.');
                    } else if (error.code === -32002) {
                         alert('Ya hay una solicitud de conexión MetaMask pendiente. Revisa tu extensión.');
                    } else {
                        alert('Error al conectar MetaMask: ' + error.message + '. Consulta la consola para más detalles.');
                    }
                    updateMetamaskWalletButton(null);
                }
            } else {
                alert('MetaMask no detectada. Por favor, instala la extensión de MetaMask.');
                window.open('https://metamask.io/download/', '_blank');
            }
        });

        // Intentar una conexión silenciosa a MetaMask al cargar la página
        (async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    // eth_accounts no solicita conexión si no hay ninguna existente, solo devuelve las conectadas
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        updateMetamaskWalletButton(accounts[0]);
                        console.log('Conexión silenciosa MetaMask exitosa:', accounts[0]);
                        // Re-adjuntar listeners para cambios de cuenta y red
                        if (!window.ethereum._events || !window.ethereum._events.accountsChanged) {
                            window.ethereum.on('accountsChanged', (newAccounts) => {
                                if (newAccounts.length > 0) {
                                    console.log('Cuenta MetaMask cambiada a:', newAccounts[0]);
                                    alert('Tu cuenta MetaMask ha cambiado a: ' + newAccounts[0]);
                                    updateMetamaskWalletButton(newAccounts[0]);
                                } else {
                                    console.log('MetaMask desconectada o sin cuentas seleccionadas.');
                                    alert('MetaMask desconectada o sin cuentas seleccionadas.');
                                    updateMetamaskWalletButton(null);
                                }
                            });
                        }
                        if (!window.ethereum._events || !window.ethereum._events.chainChanged) {
                            window.ethereum.on('chainChanged', (chainId) => {
                                console.log('Red MetaMask cambiada a Chain ID:', chainId);
                                alert('Tu red MetaMask ha cambiado a Chain ID: ' + chainId);
                                if (evmAddress) {
                                    getEvmBalances(evmAddress);
                                }
                            });
                        }
                    }
                } catch (error) {
                    console.log('No hay conexión silenciosa MetaMask o error:', error.message);
                    updateMetamaskWalletButton(null);
                }
            }
        })();
    }


    // Funcionalidad para desplegar/contraer FAQ (acordeón)
    const faqItems = document.querySelectorAll('.faq-item h4');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            // Cierra otros ítems abiertos para que solo uno esté abierto a la vez (opcional)
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.parentNode.classList.contains('active')) {
                    otherItem.parentNode.classList.remove('active');
                }
            });
            // Alterna la clase 'active' en el padre (faq-item)
            item.parentNode.classList.toggle('active');
        });
    });

    // Desplazamiento suave para los enlaces de navegación
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Desplazarse al elemento con el ID correspondiente al href
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
            // Opcional: Cerrar el menú de navegación en móviles después de hacer clic
            // if (window.innerWidth <= 768) {
            //     const navMenu = document.querySelector('.nav-menu');
            //     if (navMenu) navMenu.classList.remove('active'); // Asumiendo que tienes una clase 'active' para mostrar/ocultar
            // }
        });
    });
});
