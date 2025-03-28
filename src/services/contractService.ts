
import { BrowserProvider, Contract, keccak256 } from "ethers";

// Contract details from your provided code
export const contractAddress = "0x1fDd9b748d0A341CCEb2336D979ffaBcE369e71D";
export const contractABI = [
  // ... Your provided ABI, omitted for brevity
];

// Status codes mapping
export enum PaperStatus {
  PENDING = 0,
  PUBLISHED = 1,
  REJECTED = 2,
  REMOVED = 3
}

export async function getContract() {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask or another Ethereum wallet extension");
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new Contract(contractAddress, contractABI, signer);
}

export async function getCurrentAccount() {
  if (!window.ethereum) {
    throw new Error("MetaMask not detected");
  }
  
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  return accounts[0];
}

export async function checkRoles() {
  try {
    const contract = await getContract();
    const account = await getCurrentAccount();
    
    // Check if owner
    const ownerAddr = await contract.owner();
    const isOwner = account.toLowerCase() === ownerAddr.toLowerCase();
    
    // Check if auditor
    const isAuditor = await contract.auditors(account);
    
    return { account, isOwner, isAuditor };
  } catch (err) {
    console.error("Error checking roles:", err);
    return { account: "", isOwner: false, isAuditor: false };
  }
}

export async function uploadToIPFS(file: File) {
  if (!file) throw new Error("No file provided");
  
  // Replace with your IPFS endpoint
  const ipfsEndpoint = "http://47.79.16.191:5001/api/v0";
  
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${ipfsEndpoint}/add`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload to IPFS');
  }
  
  const data = await response.json();
  return data.Hash; // The CID
}

// Calculate file hash
export async function calculateFileHash(file: File) {
  const fileBuffer = await file.arrayBuffer();
  const fileHashBytes = new Uint8Array(fileBuffer);
  return keccak256(fileHashBytes);
}
