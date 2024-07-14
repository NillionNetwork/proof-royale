// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/DuelFactory.sol";

contract DuelFactoryDeploy is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy DuelFactory
        DuelFactory duelFactory = new DuelFactory();

        console.log("DuelFactory deployed at:", address(duelFactory));

        vm.stopBroadcast();
    }
}
