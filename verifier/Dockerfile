# !!! To use this file, please run docker run at the root level of this repository
#
# Using rust:bookworm so that the builder image has OpenSSL 3.0 which is required by async-tungstenite, because
#
# (1) async-tungstenite dynamically links to the OS' OpenSSL by using openssl-sys crate (https://docs.rs/openssl/0.10.56/openssl/#automatic)
#
# (2) async-tungstenite does not utilise the "vendored" feature for its dependency crates, i.e.
# tokio-native-tls, tungstenite and native-tls. The "vendored" feature would have statically linked
# to a OpenSSL copy instead of dynamically link to the OS' OpenSSL (https://docs.rs/openssl/0.10.56/openssl/#vendored)
# — reported an issue here (https://github.com/sdroege/async-tungstenite/issues/119)
#
# (3) We want to use ubuntu:latest (22.04) as the runner image, which (only) has OpenSSL 3.0, because
# OpenSSL 1.1.1 is reaching EOL in Sept 2023 (https://www.openssl.org/blog/blog/2023/03/28/1.1.1-EOL/)
#
# (4) Therefore, we need the builder image to have the same OpenSSL version, else the built binary will
# try to dynamically link to a different (non-existing) version in the runner image
#
# (5) rust:latest is still using bullseye somehow which only has OpenSSL 1.1.1
FROM rust:1.77-bookworm AS builder
WORKDIR /usr/src/verifier
COPY . .
COPY verifier/verifier.rs ./tlsn/tlsn/examples/simple/simple_verifier.rs
COPY verifier/Cargo.toml ./tlsn/tlsn/examples/Cargo.toml

WORKDIR /usr/src/verifier/tlsn/tlsn
RUN cargo install --path examples --example simple_verifier


FROM ubuntu:latest
WORKDIR /root/.verifier
# Install pkg-config and libssl-dev for async-tungstenite to use (as explained above)
RUN apt-get update && apt-get -y upgrade && apt-get install -y --no-install-recommends \
  pkg-config \
  libssl-dev \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/simple_verifier /usr/local/bin/simple_verifier
# Label to link this image with the repository in Github Container Registry (https://docs.github.com/en/packages/learn-github-packages/connecting-a-repository-to-a-package#connecting-a-repository-to-a-container-image-using-the-command-line)
# LABEL org.opencontainers.image.source=https://github.com/tlsnotary/tlsn
LABEL org.opencontainers.image.description="An implementation of a TLS Notary Verifier in Rust."

# ENV MY_PROOF foo
# ENV MY_PUBLIC_KEY bar
ENTRYPOINT ["simple_verifier"]
CMD ["--proof", "$MY_PROOF", "--public-key", "$MY_PUBLIC_KEY"]
