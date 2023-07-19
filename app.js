const express = require('express');
const bodyParser = require('body-parser');
const { getStoredWallet, storeWallet, getAllStoredWallets, createNewWallet } = require('./data/wallet');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/wallet/:userId', async (req, res) => {
  const storedWallet = await getStoredWallet(req.params.userId);
  res.json(storedWallet);
});

app.post('/wallet/create', async (req, res) => {
  const walletData = req.body;
  const newWallet = await createNewWallet(walletData.data.values, walletData.data.userId);

  res.status(201).json({ message: 'Wallet created.', wallet: newWallet });
});

app.post('/wallet/update', async (req, res) => {
  const walletData = req.body;
  const existingWallet = await getStoredWallet(walletData.data.userId);
  const wallets = await getAllStoredWallets();

  let keys = Object.keys(existingWallet);
  keys.map(key => {
    if (walletData.data.option === "buy") {
      if (key === walletData.data.values.currencyCode) {
        existingWallet[key] = existingWallet[key] + parseInt(walletData.data.values.units);
      }

      if (key === 'availableMoney') {
        existingWallet[key] = existingWallet[key] - parseFloat(walletData.data.values.totalValue);
      }
    }

    if (walletData.data.option === "sell") {
      if (key === walletData.data.values.currencyCode) {
        existingWallet[key] = existingWallet[key] - parseInt(walletData.data.values.units);
      }

      if (key === 'availableMoney') {
        existingWallet[key] = existingWallet[key] + parseFloat(walletData.data.values.totalValue);
      }
    }
  })

  wallets[wallets.findIndex(x=>x.userId == walletData.data.userId)] = existingWallet;
  await storeWallet(wallets);

  res.status(201).json({ message: 'Wallet updated.', wallet: existingWallet });
});

app.listen(8080);
