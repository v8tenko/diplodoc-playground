#!usr/bin/bash
declare -a DIRS=("$PWD/openapi-extension" "$PWD/yfm-docs" "$PWD/client")

Cyan='\033[0;36m'

for DIR in "${DIRS[@]}"; do
    echo -e "${Cyan}preparing ${DIR}"
    cd "${DIR}"
    echo -e "${Cyan}running install command"
    npm install
    echo -e "${Cyan}running build command"
    npm run build
done
