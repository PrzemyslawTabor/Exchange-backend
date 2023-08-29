const fs = require('node:fs/promises');

async function getStoredWallet(userId) {
  const storedWallets = await getAllStoredWallets();
  const wallet = storedWallets[userId];

  if (wallet === undefined) {
    return null;
  }

  return wallet;
}

async function getAllStoredWallets() {
  const rawFileContent = await fs.readFile('wallet.json', { encoding: 'utf-8' });
  const data = JSON.parse(rawFileContent);
  const storedWallets = data.wallets ?? [];

  return storedWallets;
}

function storeWallet(wallets) {
  return fs.writeFile('wallet.json', JSON.stringify({ wallets: wallets || [] }));
}

async function createNewWallet(values, userId) {
  const newWallet = { userId }; Object.entries(values).forEach(([key, value]) => (newWallet[key] = value));
  const wallets = await getAllStoredWallets();

  wallets[userId] = newWallet;
  await storeWallet(wallets);
  
  return wallets[userId];
}


exports.getStoredWallet = getStoredWallet;
exports.storeWallet = storeWallet;
exports.getAllStoredWallets = getAllStoredWallets;
exports.createNewWallet = createNewWallet;