#!/bin/sh

set -e

echo "📦 Memulai proses deploy ke $SSH_HOST sebagai $SSH_USER"

# Konfigurasi
BINARY_NAME="${BINARY_NAME:-api-server}"
LOCAL_BINARY="source/server-go/bin/$BINARY_NAME"
TARGET_DIR="${TARGET_DIR:-~/app/server-go}"
REMOTE_TMP="$TARGET_DIR/$BINARY_NAME.tmp"
REMOTE_FINAL="$TARGET_DIR/$BINARY_NAME"
SSH_KEY_PATH="$HOME/.ssh/id_rsa"
SSH_OPTS="-i $SSH_KEY_PATH -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"

echo "🔐 Menyiapkan SSH key"
mkdir -p ~/.ssh
echo "$SSH_PRIVATE_KEY" > "$SSH_KEY_PATH"
chmod 600 "$SSH_KEY_PATH"

echo "🧮 Menghitung SHA-256 hash dari binary lokal"
LOCAL_HASH=$(sha256sum "$LOCAL_BINARY" | awk '{print $1}')
echo "  👉 $LOCAL_BINARY"
echo "  🔢 Hash lokal: $LOCAL_HASH"

echo "📤 Mengupload binary ke VPS (sementara)"
scp $SSH_OPTS "$LOCAL_BINARY" "$SSH_USER@$SSH_HOST:$REMOTE_TMP"

echo "🧮 Memverifikasi hash SHA-256 di sisi remote"
REMOTE_HASH=$(ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "sha256sum $REMOTE_TMP | awk '{print \$1}'")
echo "  🔢 Hash remote: $REMOTE_HASH"

if [ "$LOCAL_HASH" = "$REMOTE_HASH" ]; then
  echo "✅ Hash cocok, lanjutkan proses deploy..."

  ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "
    mv $REMOTE_TMP $REMOTE_FINAL &&
    chmod +x $REMOTE_FINAL &&
    systemctl --user restart $BINARY_NAME
  "

  echo "🚀 Deploy berhasil dan service berhasil direstart."
else
  echo "❌ Hash tidak cocok! Deploy dibatalkan demi keamanan."
  ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "rm -f $REMOTE_TMP"
  exit 1
fi
