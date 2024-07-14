pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/DuelFactory.sol";

contract DuelFactoryTest is Test {
    DuelFactory duelFactory;
    address verifier;
    address challenger;
    address defender;

    function setUp() public {
        verifier = address(0x1);
        challenger = address(0x2);
        defender = address(0x3);
        duelFactory = new DuelFactory();
    }

    function testCreateDuel() public {
        string memory title = "Chess";
        string memory achievement = "Winner";
        uint256 betSize = 1 ether;
        uint256 expiryDate = block.timestamp + 7 days;
        string memory challengerUserID = "Challenger123";
        string memory defenderUserID = "Defender123";

        vm.deal(challenger, betSize);
        vm.startPrank(challenger);

        DuelContract createdDuel = duelFactory.createDuel{value: betSize}(
            title,
            achievement,
            betSize,
            expiryDate,
            verifier,
            defender,
            challengerUserID,
            defenderUserID
        );
        
        (string memory duelTitle, string memory duelAchievement) = createdDuel.game();
        (address duelChallengerAddress, string memory duelChallengerUserID, bool duelChallengerJoined) = createdDuel.challenger();
        (address duelDefenderAddress, string memory duelDefenderUserID, bool duelDefenderJoined) = createdDuel.defender();

        assertEq(duelTitle, title);
        assertEq(duelAchievement, achievement);
        assertEq(createdDuel.verifier(), verifier);
        assertEq(createdDuel.betSize(), betSize);
        assertEq(createdDuel.expiry(), expiryDate);
        assertEq(duelChallengerAddress, challenger);
        assertEq(duelDefenderAddress, defender);
        assertEq(duelChallengerUserID, challengerUserID);
        assertEq(duelDefenderUserID, defenderUserID);
        assertEq(createdDuel.active(), false);

        vm.stopPrank();
    }

    function testGetDuels() public {
        testCreateDuel(); // Create a duel to test retrieval
        DuelContract[] memory retrievedDuels = duelFactory.getDuels();
        assertEq(retrievedDuels.length, 1);
        assertEq(address(retrievedDuels[0]), address(duelFactory.duels(0)));
    }
}
