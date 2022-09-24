// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "forge-std/Script.sol";
import "../Floo.sol";

contract MyScript is Script {
    function run() external {
        vm.startBroadcast();

        Floo floo = new Floo("The Floo Network", "FLOO");

        vm.stopBroadcast();
    }
}
