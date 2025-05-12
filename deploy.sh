#!/bin/sh

set -e

# Konfigurasi default
BINARY_NAME="${BINARY_NAME:-api-server}"
LOCAL_BINARY_PATH="source/server-go/bin/$BINARY_NAME"
REMOTE_BINARY_TMP="$TARGET_DIR/$BINARY_NAME.tmp"
REMOTE_BINARY_FINAL="$TARGET_DIR/$BINARY_NAME"

echo "📦 Menyiapkan koneksi SSH dan SCP"

mkdir -p ~/.ssh
echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

# disable verifikasi fingerprint host
cat <<EOT > ~/.ssh/config
Host *
  StrictHostKeyChecking no
  UserKnownHostsFile=/dev/null
EOT

echo "🔐 Menghitung hash SHA-256 binary lokal"
LOCAL_HASH=$(sha256sum "$LOCAL_BINARY_PATH" | awk '{print $1}')

echo "🚚 Upload binary sementara ke $SSH_HOST:$REMOTE_BINARY_TMP"
scp -i ~/.ssh/id_rsa "$LOCAL_BINARY_PATH" "$SSH_USER@$SSH_HOST:$REMOTE_BINARY_TMP"

echo "🧮 Verifikasi hash SHA-256 di sisi remote"
REMOTE_HASH=$(ssh -i ~/.ssh/id_rsa "$SSH_USER@$SSH_HOST" "sha256sum $REMOTE_BINARY_TMP | awk '{print \$1}'")

echo "LOCAL  : $LOCAL_HASH"
echo "REMOTE : $REMOTE_HASH"

if [ "$LOCAL_HASH" = "$REMOTE_HASH" ]; then
  echo "✅ Hash cocok, lanjutkan deployment"
  ssh -i ~/.ssh/id_rsa "$SSH_USER@$SSH_HOST" "
    mv $REMOTE_BINARY_TMP $REMOTE_BINARY_FINAL &&
    chmod +x $REMOTE_BINARY_FINAL &&
    systemctl --user restart $BINARY_NAME
  "
else
  echo "❌ Hash tidak cocok! Deploy dibatalkan."
  exit 1
fi
