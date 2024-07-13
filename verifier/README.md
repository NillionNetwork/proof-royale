Run with Docker but from the root directory of the project (one dir back from here):
```bash
docker build -t verifier -f ./verifier/Dockerfile .
docker run -ti --rm -v ./verifier/nick_proof.json:/opt/proof.json -v ./verifier/nick.pub:/opt/key.pub verifier --proof /opt/proof.json --public-key /opt/key.pub
```
