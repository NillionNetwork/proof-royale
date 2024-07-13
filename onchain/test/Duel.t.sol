// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../src/Duel.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract DuelTest is DSTest {
    DuelContract duel;
    string title = "Gamer Stats";
    string achievement = ">70% completion";
    address challenger = address(0x123);
    address defender = address(0x456);
    address verifier = address(0x789);
    uint256 betSize = 1 ether;
    uint256 expiryDate = block.timestamp + 30 days;
    string challengerID = "Player1";
    string defenderID = "Player2";

    function setUp() public {
        duel = new DuelContract(
            title,
            achievement,
            betSize,
            expiryDate,
            verifier,
            challenger,
            defender,
            challengerID,
            defenderID
        );
    }

    function testConstructorInitialization() public {
        assertEq(duel.title(), "Gamer Stats", "Title should match the constructor input.");
        assertEq(duel.achievement(), ">70% completion", "Achievement should match the constructor input.");
        assertEq(duel.verifier(), verifier, "Verifier address should match the constructor input.");
        assertEq(duel.betSize(), betSize, "Bet size should match the constructor input.");
        assertEq(duel.expiry(), expiryDate, "Expiry date should match the constructor input.");
        assertEq(duel.challenger().playerAddress, challenger, "Challenger address should match the constructor input.");
        assertEq(duel.defender().playerAddress, defender, "Defender address should match the constructor input.");
        assertEq(duel.challenger().platformUserID, challengerID, "Challenger user ID should match the constructor input.");
        assertEq(duel.defender().platformUserID, defenderID, "Defender user ID should match the constructor input.");
        assertFalse(duel.accepted(), "Duel should not be accepted initially.");
        assertFalse(duel.active(), "Duel should not be active initially.");
    }

    function testJoinDuel() public {
        vm.prank(challenger);
        duel.joinDuel{value: betSize}(challengerID);
        assertTrue(duel.isPlayerJoined(challenger));
    }
    function testClaimWin() public {
        vm.prank(verifier);
        duel.claimWin(challenger);
        assertEq(duel.getCurrentDuelStatus(), "Inactive", "Duel should be inactive after a win is claimed.");
        assertEq(address(challenger).balance, address(this).balance + betSize, "Winner should receive the bet amount.");
    }

    function testFailClaimWinByNonVerifier() public {
        vm.prank(challenger); // Challenger tries to claim the win
        vm.expectRevert("Only verifier can perform this action.");
        duel.claimWin(challenger); // Should fail
    }

    function testFailClaimWinInvalidWinner() public {
        vm.prank(verifier);
        vm.expectRevert("Only player addresses can win.");
        duel.claimWin(address(0xABC)); // Invalid winner address
    }

    function testRescindChallenge() public {
        vm.prank(challenger);
        uint256 balance = address(challenger).balance;
        duel.rescindChallenge();
        assertEq(address(challenger).balance, balance + betSize);  // Challenger should get their bet back
    }

    function testMatchExpired() public {
        vm.warp(expiryDate + 1); // Move time forward to ensure the duel is expired
        duel.matchExpired();
        assertEq(duel.getCurrentDuelStatus(), "Inactive");
    }

    function testMatchExpiredCannotBeCalledEarly() public {
        vm.expectRevert("Duel not yet expired.");
        duel.matchExpired();
    }

    function testFailJoinDuelWithIncorrectAmount() public {
        vm.prank(challenger);
        vm.expectRevert("Incorrect amount of ETH sent.");
        duel.joinDuel{value: 0.5 ether}(challengerID); // Should fail due to incorrect ETH amount
    }

    function testFailRescindByNonChallenger() public {
        vm.prank(defender); // Defender tries to rescind
        vm.expectRevert("Only the challenger can rescind the challenge.");
        duel.rescindChallenge(); // Should fail
    }
}
