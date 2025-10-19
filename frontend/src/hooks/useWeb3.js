import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';

export const useWeb3 = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sepolia 网络 ID
  const SEPOLIA_CHAIN_ID = 11155111;

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      console.log('Connected to network:', network.name, 'Chain ID:', Number(network.chainId));
      console.log('Expected Sepolia Chain ID:', SEPOLIA_CHAIN_ID);
      
      // 检查是否连接到 Sepolia 网络
      if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
        try {
          // 尝试切换到 Sepolia 网络
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x' + SEPOLIA_CHAIN_ID.toString(16) }], // 0xaa36a7
          });
          // 重新获取网络信息
          const newNetwork = await provider.getNetwork();
          console.log('Switched to network:', newNetwork.name, 'Chain ID:', Number(newNetwork.chainId));
        } catch (switchError) {
          if (switchError.code === 4902) {
            // 网络不存在，尝试添加 Sepolia 网络
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x' + SEPOLIA_CHAIN_ID.toString(16),
                  chainName: 'Sepolia Test Network',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['https://sepolia.infura.io/v3/'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io/']
                }]
              });
            } catch (addError) {
              throw new Error('Failed to add Sepolia network: ' + addError.message);
            }
          } else {
            throw new Error('Please switch to Sepolia network manually');
          }
        }
      }

      const signer = await provider.getSigner();

      // Validate contract address from env to avoid ENS resolution errors
      const isValidAddress = !!CONTRACT_ADDRESS && /^0x[a-fA-F0-9]{40}$/.test(CONTRACT_ADDRESS);
      if (!isValidAddress) {
        setProvider(provider);
        setSigner(signer);
        setAccount(accounts[0]);
        setChainId(network.chainId);
        setContract(null);
        setError('Contract address not configured. Set VITE_CONTRACT_ADDRESS in frontend/.env');
        return;
      }

      // 验证合约是否存在
      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === '0x') {
        throw new Error(`No contract found at address ${CONTRACT_ADDRESS} on this network`);
      }
      
      console.log('Contract connected successfully at:', CONTRACT_ADDRESS);
      console.log('Contract code length:', code.length);

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      setProvider(provider);
      setSigner(signer);
      setContract(contract);
      setAccount(accounts[0]);
      setChainId(network.chainId);
    } catch (err) {
      setError(err.message);
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setChainId(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return {
    provider,
    signer,
    contract,
    account,
    chainId,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    isConnected: !!account,
  };
};
