# Fakemon

A pokemon type turn-based battle game on-chain.

Currently deployed on Goerli testnet, but as Alchemy stopped supporting it the app isn't working. We are in process of moving to a different testnet soon. You can try it locally for now.

## Features

- User registration, user will get 50 tokens and 1 NFT
- User can mint new NFT for 5 tokens each
- User can create new gyms, each NFT can be used only once
- User can fight with gyms created by other users
- (For now, NFTs are automatically healed)

### Upcoming features

- Battle history + No of wins
- Battle entry fee + Winning reward
- Close gym (Would free up staked NFTs)
- Buying token
- Dynamic NFT stats
- Healing using tokens, and better tokenomics
- Playing game without using metamask (using meta transactions)
- Onchain metadata for all Fakemons + generative art

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

## Deployment

### Confusion regarding "hardhat" vs "localhost"

For local development we are using Hardhat network. But for the deployment script we are using `--network localhost` which can generate confusion.

Hardhat network comes in two modes - `hardhat` (in-process blockchain which is used for testing and running tasks if not specified any network) and `localhost` (standalone background process which is used to connect with wallets and FE app).

After deployment the script will copy newly deployed contract address and ABI into FE directory under `/frontend/src/artifacts/${networkName}`. We will save in "hardhat" folder for local development instead of "localhost".

TLDR: For network name, we are using "hardhat" everywhere except deployment script.

### Deployment process

- There are 2 contracts here: Token (Fmon.sol) and Game (Fakemon.sol)
- You need to deploy Token first, then Game contract, and then transfer ownership of Token contract to Game contract. As Game contract mints new tokens for users, and no outsiders should be able to do that.
