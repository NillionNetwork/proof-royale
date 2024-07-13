// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Duel.sol"; // Assuming Duel.sol contains the DuelContract

contract TournamentContract {
    address[] public players;
    address public referee;
    mapping(uint256 => address) public matchWinners; // Maps match index to winner address
    uint256 public currentMatchIndex;
    uint256 public totalRounds;
    bool public tournamentActive;

    event MatchCreated(uint256 matchIndex, address player1, address player2);
    event MatchResult(uint256 matchIndex, address winner);
    event TournamentEnded(address winner);

    constructor(address[] memory _players, address _referee) {
        require(_players.length > 1 && (_players.length & (_players.length - 1)) == 0, "Player count must be a power of 2");
        players = _players;
        referee = _referee;
        currentMatchIndex = 0;
        totalRounds = log2(players.length);
        tournamentActive = true;
    }

    function createNextMatch() public {
        require(tournamentActive, "Tournament has ended.");
        require(currentMatchIndex < players.length / 2, "All matches for this round are already created.");

        uint256 idx1 = currentMatchIndex * 2;
        uint256 idx2 = idx1 + 1;
        emit MatchCreated(currentMatchIndex, players[idx1], players[idx2]);
        currentMatchIndex++;
    }

    function reportMatchResult(uint256 matchIndex, address winner) public {
        require(msg.sender == referee, "Only the referee can report match results.");
        require(matchWinners[matchIndex] == address(0), "Result for this match already reported.");

        matchWinners[matchIndex] = winner;
        emit MatchResult(matchIndex, winner);

        // Check if this was the final match
        if (currentMatchIndex == players.length / 2 && currentMatchIndex == 1) {
            tournamentActive = false;
            emit TournamentEnded(winner);
        } else if (currentMatchIndex == players.length / 2) {
            // Prepare for next round
            prepareNextRound();
        }
    }

    function prepareNextRound() private {
        uint256 winnersCount = players.length / 2;
        for (uint256 i = 0; i < winnersCount; i++) {
            players[i] = matchWinners[i];
        }
        currentMatchIndex = 0;
    }

    function log2(uint x) private pure returns (uint y) {
        assembly { y := shl(1, x) }
    }
}
