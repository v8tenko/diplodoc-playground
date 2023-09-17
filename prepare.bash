#!usr/bin/bash
declare -a DIRS=("$PWD/openapi-extension" "$PWD/yfm-docs" "$PWD/client")

Cyan='\033[0;36m'
NC='\033[0m' # No Color

for DIR in "${DIRS[@]}"; do
    echo -e "${Cyan}preparing ${DIR}${NC}"
    cd "${DIR}"
    echo -e "${Cyan}running install command${NC}"
    npm install
    echo -e "${Cyan}running build command${NC}"
    npm run build
done
