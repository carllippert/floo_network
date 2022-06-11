# include .env file and export its env vars
# (-include to ignore error if it does not exist)
-include .env

#deploy dev

all : deploy_dev update_export remove_new_line remove_bak move

deploy_dev :; forge create NFT --rpc-url=http://localhost:8545 --private-key=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --constructor-args Loop LOOP | grep "Deployed to:" > contract_address.js 
# all: clean remove install update solc build 

update_export :; sed -i.bak 's/Deployed to: /export const address = "/' contract_address.js
remove_new_line :; tr '\n' '"\n' < contract_address.js > not_contract_address.js
remove_bak :; rm contract_address.js.bak
move :; mv not_contract_address.js contract_address.js

# ; sed ':a;N;$!ba;s/\n/ /g' contract_address.js; echo '"' >> contract_address.js
# again :; awk '{ print $1 }' contract_address.js > not_contract_address.js
# again :; sed -i.bak -e '$a"' contract_address.js
# # Install proper solc version. 
# solc:; nix-env -f https://github.com/dapphub/dapptools/archive/master.tar.gz -iA solc-static-versions.solc_0_8_11

# # Clean the repo
# clean  :; forge clean

# # Remove modules
# remove :; rm -rf .gitmodules && rm -rf .git/modules/* && rm -rf lib && touch .gitmodules && git add . && git commit -m "modules"

# # Install the Modules
# install :; forge install dapphub/ds-test && forge install rari-capital/solmate && forge install foundry-rs/forge-std && forge install ZeframLou/clones-with-immutable-args && forge install smartcontractkit/chainlink-brownie-contracts

# # Update Dependencies
# update:; forge update

# # Builds
# build  :; forge clean && forge build --optimize --optimizer-runs 1000000
# dappbuild :; dapp build

# # chmod scripts
# scripts :; chmod +x ./scripts/*

# # Tests
# test   :; forge clean && forge test --optimize --optimizer-runs 1000000 -v # --ffi # enable if you need the `ffi` cheat code on HEVM

# # Lints
# lint :; yarn prettier --write src/**/*.sol && prettier --write src/*.sol

# # Generate Gas Snapshots
# snapshot :; forge clean && forge snapshot --optimize --optimizer-runs 1000000

# # Fork Mainnet With Hardhat
# mainnet-fork :; npx hardhat node --fork ${ETH_MAINNET_RPC_URL}

# # Rename all instances of this repo with the new repo name
# rename :; chmod +x ./scripts/* && ./scripts/rename.sh