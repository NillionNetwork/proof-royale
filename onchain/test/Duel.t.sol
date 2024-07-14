// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Duel.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract DuelTest is Test {
    DuelContract duelChallengerOnly;
    DuelContract duelBothJoined;
    string title = "Gamer Stats";
    string achievement = ">70% completion";
    address challenger = address(0x123);
    address defender = address(0x456);
    address verifier = address(0x789);
    uint256 betSize = 0.1 ether;
    uint256 expiryDate = block.timestamp + 30 days;
    string challengerID = "Player1";
    string defenderID = "Player2";

    function setUp() public { 
        vm.deal(challenger, betSize*2);
        
        // Instance where only challenger has joined
        vm.deal(challenger, betSize*2);
        vm.prank(challenger);
        duelChallengerOnly = new DuelContract{value: betSize}(
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

        // Instance where both challenger and defender have joined
        duelBothJoined = new DuelContract{value: betSize}(
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
        vm.deal(defender, betSize);
        vm.prank(defender);
        duelBothJoined.joinDuel{value: betSize}();
    }

    function testConstructorInitialization() public {
        (string memory duelTitle, string memory duelAchievement) = duelChallengerOnly.game();
        (address duelChallengerAddress, string memory duelChallengerUserID, bool duelChallengerJoined) = duelChallengerOnly.challenger();
        (address duelDefenderAddress, string memory duelDefenderUserID, bool duelDefenderJoined) = duelChallengerOnly.defender();
        assertEq(duelTitle, "Gamer Stats", "Title should match the constructor input.");
        assertEq(duelAchievement, ">70% completion", "Achievement should match the constructor input.");
        assertEq(duelChallengerOnly.verifier(), verifier, "Verifier address should match the constructor input.");
        assertEq(duelChallengerOnly.betSize(), betSize, "Bet size should match the constructor input.");
        assertEq(duelChallengerOnly.expiry(), expiryDate, "Expiry date should match the constructor input.");
        assertEq(duelChallengerAddress, challenger, "Challenger address should match the constructor input.");
        assertEq(duelDefenderAddress, defender, "Defender address should match the constructor input.");
        assertEq(duelChallengerUserID, challengerID, "Challenger user ID should match the constructor input.");
        assertEq(duelDefenderUserID, defenderID, "Defender user ID should match the constructor input.");
        assertFalse(duelChallengerOnly.active(), "Duel should not be active initially.");
    }

    function testJoinDuel() public {
        DuelContract newDuel = new DuelContract{value: betSize}(
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
        vm.deal(defender, betSize);
        vm.prank(defender);
        newDuel.joinDuel{value: betSize}();
        assertTrue(newDuel.isPlayerJoined(defender));
        assertTrue(newDuel.active());
    }
    function testClaimWin() public {   
        uint256 challengerBalance = address(challenger).balance;
        vm.prank(verifier);
        duelBothJoined.claimWin(challenger);
        assertFalse(duelBothJoined.active(), "Duel should be inactive after a win is claimed.");
        assertEq(address(challenger).balance, challengerBalance + betSize * 2, "Winner should receive the bet amount.");
    }

    function testFailClaimWinByNonVerifier() public {
        vm.prank(challenger); // Challenger tries to claim the win
        duelBothJoined.claimWin(challenger); // Should fail
        assertEq(duelBothJoined.active(), true, "Duel should still be active.");
    }

    function testFailClaimWinInvalidWinner() public {
        vm.prank(verifier);
        duelBothJoined.claimWin(address(0xABC)); // Invalid winner address
        assertEq(duelBothJoined.active(), true, "Duel should still be active.");
    }

    function testRescindChallenge() public {
        uint256 balance = address(challenger).balance;
        vm.prank(challenger);
        duelChallengerOnly.rescindChallenge();
        assertEq(address(challenger).balance, balance + betSize);  // Challenger should get their bet back
    }

    function testMatchExpired() public {
        vm.warp(expiryDate + 1); // Move time forward to ensure the duel is expired
        uint256 balance = address(defender).balance;
        uint256 challengerBalance = address(challenger).balance;
        duelBothJoined.matchExpired();
        assertEq(duelBothJoined.active(), false);
        assertEq(address(defender).balance, balance + betSize);
        assertEq(address(challenger).balance, challengerBalance + betSize);
    }

    function testMatchExpiredCannotBeCalledEarly() public {
        vm.expectRevert("Duel not yet expired.");
        duelChallengerOnly.matchExpired();
    }

    function testFailJoinDuelWithIncorrectAmount() public {
        vm.prank(challenger);
        vm.expectRevert("Incorrect amount of ETH sent.");
        duelChallengerOnly.joinDuel{value: betSize * 2}(); // Should fail due to incorrect ETH amount
    }

    function testFailRescindByNonChallenger() public {
        vm.prank(defender); // Defender tries to rescind
        duelChallengerOnly.rescindChallenge(); // Should fail
        assertEq(duelChallengerOnly.active(), true, "Duel should still be active.");
    }

    function testFailRescindDuelActive() public {
        vm.prank(challenger);
        vm.expectRevert("Duel is still active.");
        duelBothJoined.rescindChallenge();
    }
}

