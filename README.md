<p align="center">Proof Royal <img width="10%" src="https://github.com/NillionNetwork/proof-royale/blob/main/proof-royale.png" alt="Proof Royal logo" /></p>

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/NillionNetwork/proof-royale/blob/main/LICENSE)
--------------------------------------------------------------------------------

## TL;DR
Proof Royal is a ...

## Building

Clone this repository and build the extension from the [`extension`](./extension) directory.

Run the proxy:
```bash
docker run -it --rm -p 55688:80 novnc/websockify 80 n70y7tgezh.execute-api.eu-west-1.amazonaws.com:443
```

Run the notary ([tlsn/notary-server](https://github.com/tlsnotary/tlsn) commit `b4334ad1`):
```bash
cargo r -r
```

Compile the plugin to WASM from [`./plugin/examples/csteam`](./plugin/examples/csteam):
```bash
extism-js index.js -i index.d.ts -o index.wasm
```

Finally, add the Custom Steam plugin to your browser extension.


## Examples

A simple ranking based website inspired from steam badges: [`https://tlsnotary-game.vercel.app/testnet-1/user/player1`](https://tlsnotary-game.vercel.app/testnet-1/user/player1) (replace `player1` to get stats for different players).

## Disclaimer
This is software for a prototype and not production-ready code.
This repository builds upon [TLS Notary](https://tlsnotary.org/).
