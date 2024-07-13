# Proof Royale [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/NillionNetwork/proof-royale/blob/main/LICENSE)

<p align="center"><img width="20%" src="https://github.com/NillionNetwork/proof-royale/blob/main/proof-royale.png" alt="Proof Royale logo" /></p>

--------------------------------------------------------------------------------

## TL;DR
Hey there, fellow gamers and web3 enthusiasts! Have you ever wondered how you could flex your epic gaming skills and earn real money for your in-game achievements without worrying about getting duped? Say hello to Proof Royale, your new favorite battleground where gaming glory meets blockchain and ZK brilliance!

What is Proof Royale I hear you asking? Proof Royale is a revolutionary web3 app that brings together the thrill of gaming and the power of zero-knowledge proofs (ZKPs) on a Layer 2 blockchain. Whether you're a solo player looking for a duel or a champion ready to dominate a tournament, Proof Royale is your arena to showcase your gaming prowess and get paid for it!

#### How Does It Work?
* **Set Up Your Challenge:** Create a smart contract for a Duel between two players or a Tournament for N players. The stakes are high, and the rewards are even higher!
* **Achieve and Prove:** Be the first to complete 100% of your badges on your favorite gaming platform (like Steam). When you achieve this milestone, generate a Zero-Knowledge Proof (ZKP) that proves your accomplishment.
* **Notarize with Confidence:** We use TLSNotarize to ensure your proof is rock-solid and tamper-proof. Your victory is indisputable!
* **Claim Your Winnings:** Once your proof is verified, the smart contract releases the prize money to the deserving champion—you! Bask in the glory of your triumph and the sweet rewards that come with it.

####  Why Proof Royale?
Trustless Verification: With ZKPs and TLSNotarize, your achievements are securely verified without revealing sensitive information—no more disputes or shady deals—just pure, verified victories.

Smart Contract Security: Our smart contracts are battle-tested, ensuring that the winner always gets their rightful reward.

Community and Competition: Join a thriving community of gamers and blockchain enthusiasts. Challenge friends, rivals, or complete strangers—let the best player win!

So, are you ready to take your gaming achievements to the next level? Prove your mettle, earn real money, and become a legend in the Proof Royale arena. Game on, and may the best gamer win! 🎮🏆🚀

## Building

Clone this repository and build the extension from the [`extension`](./extension) directory.
```bash
git clone git@github.com:NillionNetwork/proof-royale.git --recursive
```

Run the proxy:
```bash
docker run -it --rm -p 55688:80 novnc/websockify 80 n70y7tgezh.execute-api.eu-west-1.amazonaws.com:443
```

Run the notary ([tlsn/notary-server](https://github.com/tlsnotary/tlsn) commit `b4334ad1`):
```bash
cargo r -r
```

Compile the plugin to WASM from [`./plugin/examples/gamer_stats`](./plugin/examples/gamer_stats):
```bash
extism-js index.js -i index.d.ts -o index.wasm
```

Finally, add the Custom Steam plugin to your browser extension.


## Examples

A simple ranking based website inspired from steam badges: [`https://tlsnotary-game.vercel.app/testnet-1/user/player1`](https://tlsnotary-game.vercel.app/testnet-1/user/player1) (replace `player1` to get stats for different players).

## Disclaimer
This is software is an EthCC 2024 hackathon prototype and not production-ready code.
This repository builds upon [TLS Notary](https://tlsnotary.org/).
