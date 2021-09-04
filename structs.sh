#!/bin/sh
# A very not robust setup script that needs improvement.
# Ideas:
#     ➤ Prompt user to fill in environment variables
#     ➤ Silence npm output

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RESET='\033[0m' 

showHelp() {
    helpLog="Usage: $0 [--frontend | --backend | --setup]"
    echo "${YELLOW}$helpLog${RESET}"
    echo "\t./structs.sh --setup\t\tInstalls all dependencies"
    echo "\t./structs.sh --frontend\t\tStarts the client development server"
    echo "\t./structs.sh --backend\t\tStarts the Structs.sh API development server"
}

if test $# -eq 0; then
    showHelp
    exit 1
fi

while test $# -gt 0; do
    case "$1" in
        -h|--help)
            showHelp 
            exit 0
            ;;
        --setup)
            echo "${YELLOW} ➤ Setting up Structs.sh${RESET}"
            if npm --silent --prefix ./client install; then
                echo "${GREEN} ➤ Installed all Structs.sh client dependencies!${RESET}"
            else
                echo "${RED} ➤ Something went wrong with setting up the client dependencies"
            fi
            if npm --silent --prefix ./server install; then
                echo "${GREEN} ➤ Installed all Structs.sh API dependencies!${RESET}"
            else
                echo "${RED} ➤ Something went wrong with setting up the server dependencies"
            fi
            if npm --silent --prefix ./visualiser-new install; then
                echo "${GREEN} ➤ Installed all visualiser developement dependencies!${RESET}"
            else
                echo "${RED} ➤ Something went wrong with setting up the server dependencies"
            fi
            exit 0
            ;;
        --frontend)
            echo "${YELLOW}Running the Structs.sh client development server${RESET}"
            npm --prefix ./client run start  
            exit 0
            ;;
        --backend)
            echo "${YELLOW}Running the Structs.sh API server${RESET}"
            npm --prefix ./server run dev
            exit 0
            ;;
        *)
            echo "${RED}Unrecognised option\n${RESET}`./structs.sh -h`"
            exit 0
            ;;
    esac
done
