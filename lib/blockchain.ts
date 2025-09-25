import { createPublicClient, createWalletClient, http, Address, formatEther, parseEther } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Contract ABI (simplified for our needs)
const MEME_COIN_ABI = [
  {
    inputs: [{ name: 'user', type: 'address' }, { name: 'reason', type: 'string' }],
    name: 'rewardUser',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'users', type: 'address[]' }, { name: 'reason', type: 'string' }],
    name: 'rewardMultipleUsers',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }, { name: 'amount', type: 'uint256' }],
    name: 'burnForTransaction',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
    name: 'transferWithFee',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'canUserBeRewarded',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Contract address (to be deployed)
const MEME_COIN_ADDRESS = process.env.MEME_COIN_CONTRACT_ADDRESS as Address;

// Create clients
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
});

// Wallet client for transactions (only if we have a private key)
let walletClient: any = null;
if (process.env.PRIVATE_KEY) {
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
  walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(process.env.BASE_RPC_URL || 'https://mainnet.base.org'),
  });
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}

// Get user's MemeCoin balance
export const getMemeCoinBalance = async (address: string): Promise<string> => {
  try {
    if (!MEME_COIN_ADDRESS) {
      throw new Error('Contract address not configured');
    }

    const balance = await publicClient.readContract({
      address: MEME_COIN_ADDRESS,
      abi: MEME_COIN_ABI,
      functionName: 'balanceOf',
      args: [address as Address],
    });

    return formatEther(balance as bigint);
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0';
  }
};

// Check if user can be rewarded
export const canUserBeRewarded = async (address: string): Promise<boolean> => {
  try {
    if (!MEME_COIN_ADDRESS) {
      return false;
    }

    const canReward = await publicClient.readContract({
      address: MEME_COIN_ADDRESS,
      abi: MEME_COIN_ABI,
      functionName: 'canUserBeRewarded',
      args: [address as Address],
    });

    return canReward as boolean;
  } catch (error) {
    console.error('Error checking reward eligibility:', error);
    return false;
  }
};

// Reward a user with MemeCoins
export const rewardUser = async (userAddress: string, reason: string): Promise<TransactionResult> => {
  try {
    if (!walletClient || !MEME_COIN_ADDRESS) {
      return { success: false, error: 'Wallet or contract not configured' };
    }

    const hash = await walletClient.writeContract({
      address: MEME_COIN_ADDRESS,
      abi: MEME_COIN_ABI,
      functionName: 'rewardUser',
      args: [userAddress as Address, reason],
    });

    return { success: true, hash };
  } catch (error) {
    console.error('Error rewarding user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Reward multiple users
export const rewardMultipleUsers = async (userAddresses: string[], reason: string): Promise<TransactionResult> => {
  try {
    if (!walletClient || !MEME_COIN_ADDRESS) {
      return { success: false, error: 'Wallet or contract not configured' };
    }

    const addresses = userAddresses.map(addr => addr as Address);
    const hash = await walletClient.writeContract({
      address: MEME_COIN_ADDRESS,
      abi: MEME_COIN_ABI,
      functionName: 'rewardMultipleUsers',
      args: [addresses, reason],
    });

    return { success: true, hash };
  } catch (error) {
    console.error('Error rewarding multiple users:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Burn tokens for marketplace transaction
export const burnForTransaction = async (userAddress: string, amount: string): Promise<TransactionResult> => {
  try {
    if (!walletClient || !MEME_COIN_ADDRESS) {
      return { success: false, error: 'Wallet or contract not configured' };
    }

    const amountWei = parseEther(amount);
    const hash = await walletClient.writeContract({
      address: MEME_COIN_ADDRESS,
      abi: MEME_COIN_ABI,
      functionName: 'burnForTransaction',
      args: [userAddress as Address, amountWei],
    });

    return { success: true, hash };
  } catch (error) {
    console.error('Error burning tokens:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Transfer with fee
export const transferWithFee = async (fromAddress: string, toAddress: string, amount: string): Promise<TransactionResult> => {
  try {
    if (!walletClient || !MEME_COIN_ADDRESS) {
      return { success: false, error: 'Wallet or contract not configured' };
    }

    const amountWei = parseEther(amount);
    const hash = await walletClient.writeContract({
      address: MEME_COIN_ADDRESS,
      abi: MEME_COIN_ABI,
      functionName: 'transferWithFee',
      args: [toAddress as Address, amountWei],
      account: fromAddress as Address,
    });

    return { success: true, hash };
  } catch (error) {
    console.error('Error transferring with fee:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Get transaction status
export const getTransactionStatus = async (hash: string) => {
  try {
    const receipt = await publicClient.getTransactionReceipt({ hash: hash as `0x${string}` });
    return {
      status: receipt.status,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
    };
  } catch (error) {
    console.error('Error getting transaction status:', error);
    return null;
  }
};

// Format address for display
export const formatAddress = (address: string): string => {
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Validate Ethereum address
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

