#!/bin/sh

# brew install gnupg
# cat turtles.csv \
# | gpg --armor --symmetric --output - \
# | curl -X PUT --upload-file "-" https://transfer.sh/turtles.csv \
# | pbcopy


# RSA KEYS
PRIVATE_KEY_URL=$(cat ./keys/private.key | curl -X PUT --upload-file "-" https://transfer.sh/private.key)
PUBLIC_KEY_URL=$(cat ./keys/public.key | curl -X PUT --upload-file "-" https://transfer.sh/public.key)

# MODEL
MODEL_JSON=$(cat ./model/model.json | curl -X PUT --upload-file "-" https://transfer.sh/model.json)
MODEL_BIN=$(cat ./model/group1-shard1of1.bin | curl -X PUT --upload-file "-" https://transfer.sh/group1-shard1of1.bin)
MODEL_MAPPING=$(cat ./keys/mapping.json | curl -X PUT --upload-file "-" https://transfer.sh/mapping.json)

# TRANSFER
# curl {PRIVATE_KEY_URL} --output ./keys/private.key
# curl https://transfer.sh/abOWI/private.key --output ./keys/private.key
# curl https://transfer.sh/abOWI/private.key --output ./keys/private.key
# curl https://transfer.sh/abOWI/private.key --output ./keys/private.key