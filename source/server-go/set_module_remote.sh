#!/bin/bash
# set_module_remote.sh

REMOTE_MOD_NAME="github.com/luridarmawan/mcp-server-go"

echo "Setting module to remote: $REMOTE_MOD_NAME"
sed -i '' "1s|^module .*|module $REMOTE_MOD_NAME|" go.mod

echo "Replacing import paths..."
find . -type f -name "*.go" -exec sed -i '' "s|mcpserver|$REMOTE_MOD_NAME|g" {} +

echo "Done (remote mode)"
