# High-Stake Tournament

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
