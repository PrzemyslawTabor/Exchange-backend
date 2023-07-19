const fs = require('node:fs/promises');

async function getStoredWallet(userId) {
  const storedWallets = await getAllStoredWallets();
  let wallet = storedWallets.find((wallet) => wallet.userId == userId);

  if (wallet === undefined) {
    return null;
  }

  return wallet;
}

async function getAllStoredWallets() {
  const rawFileContent = await fs.readFile('wallet.json', { encoding: 'utf-8' });
  const data = JSON.parse(rawFileContent);
  const storedWallets = data.wallet ?? [];

  return storedWallets;
}

function storeWallet(wallet) {
  return fs.writeFile('wallet.json', JSON.stringify({ wallet: wallet || [] }));
}

async function createNewWallet(values, userId) {
  const newWallet = Object.entries(values).reduce((obj, [key, value]) => (obj[key] = parseFloat(value), obj), {});
  newWallet.userId = userId;

  const wallets = await getAllStoredWallets();
  await storeWallet([newWallet, ...wallets]);

  return newWallet;
}


exports.getStoredWallet = getStoredWallet;
exports.storeWallet = storeWallet;
exports.getAllStoredWallets = getAllStoredWallets;
exports.createNewWallet = createNewWallet;