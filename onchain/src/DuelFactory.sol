pragma solidity ^0.8.0;

import "./Duel.sol";

contract DuelFactory {
    DuelContract[] public duels;

    event DuelCreated(address indexed duelAddress, uint256 duelId);

    function createDuel(
        string memory _title,
        string memory _achievement,
        uint256 _betSize,
        uint256 _expiryDate,
        address _verifier,
        address _defenderAddr,
        string memory _challengerUserID,
        string memory _defenderUserID
    ) public payable returns (DuelContract) {
        require(msg.value == _betSize, "Incorrect ETH amount sent");

        DuelContract duel = (new DuelContract){value: msg.value}( // Forward ETH to the DuelContract
            _title,
            _achievement,
            _betSize,
            _expiryDate,
            _verifier,
            msg.sender,
            _defenderAddr,
            _challengerUserID,
            _defenderUserID
        );
        duels.push(duel);
        emit DuelCreated(address(duel), duels.length - 1);
        return duel;
    }

    function getDuels() public view returns (DuelContract[] memory) {
        return duels;
    }
}