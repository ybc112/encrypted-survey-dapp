import { ethers } from 'ethers';

export const encryptAnswer = (answer) => {
  // 简单的客户端"加密"（实际上是哈希）
  // 在生产环境中，这里应该使用真正的加密算法
  const message = `${answer}-${Date.now()}`;
  return ethers.id(message);
};

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTime = (timestamp) => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString('en-US');
};

export const formatDuration = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
};

export const getTimeRemaining = (deadline) => {
  const now = Math.floor(Date.now() / 1000);
  const remaining = Number(deadline) - now;

  if (remaining <= 0) return 'Expired';

  return formatDuration(remaining);
};
