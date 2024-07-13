// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Tournament.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TournamentFactory is Ownable {
    TournamentContract[] public tournaments;

    event TournamentCreated(address indexed tournamentAddress, address indexed creator, uint256 timestamp);
    event PrizePoolFunded(address indexed tournamentAddress, address indexed funder, uint256 amount, string assetType);

    // Function to create a new tournament
    function createTournament(address[] memory _players, address _referee, string memory _customizationOptions)
        public
    {
        TournamentContract newTournament = new TournamentContract(_players, _referee);
        tournaments.push(newTournament);
        emit TournamentCreated(address(newTournament), msg.sender, block.timestamp);
    }

    // Function to retrieve all created tournaments
    function getTournaments() public view returns (TournamentContract[] memory) {
        return tournaments;
    }
}