# Fakemon

A pokemon type turn-based battle game on-chain.

## Features

- User registration, user will get 50 tokens and 1 NFT
- User can mint new NFT for 5 tokens each
- User can create new gyms, each NFT can be used only once
- User can fight with gyms created by other users
- (For now, NFTs are automatically healed)

### Upcoming features

- Page loaders in FE
- Battle history
- Close gym (Would free up staked NFTs)
- Buying token
- Dynamic NFT stats
- Healing using tokens, and better tokenomics
- Playing game without using metamask (using meta transactions)

## How to run locally

First

- First start hardhat network `npx hardhat node`
- Then deploy the contracts `npm run deploy`
- Then start the frontend `cd frontend && npm start`

Then

- Import few accounts from hardhat network into metamask to interact with the webapp.
- You need to "Reset account" in metamask each time you restart the local blockchain.

Extras

- To test contracts `npm test`

## Deployment rule

- There are 2 contracts here: Token (Fmon.sol) and Game (Fakemon.sol)
- You need to deploy Token first, then Game contract, and then transfer ownership of Token contract to Game contract. As Game contract mints new tokens for users, and no outsiders should be able to do that.
