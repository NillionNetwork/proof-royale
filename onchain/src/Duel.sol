pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DuelContract is ReentrancyGuard {
    struct Game {
        string title;
        string achievement;
    }
    
    struct Player {
        address playerAddress;
        string platformUserID;
        bool hasJoined;
    }

    Game public game;
    Player public challenger;
    Player public defender;
    address public verifier;
    uint256 public betSize;
    uint256 public expiry;
    bool public active;

    event PlayerJoined(address player);
    event DuelExpired(address duelAddress);
    event WinClaimed(address winner);
    event ChallengeRescinded(address rescindedDuel);

    // Add modifiers for role-based access control
    modifier onlyChallenger() {
        require(msg.sender == challenger.playerAddress, "Only the challenger can perform this action.");
        _;
    }

    modifier onlyDefender() {
        require(msg.sender == defender.playerAddress, "Only the defender can perform this action.");
        _;
    }

    modifier onlyVerifier() {
        require(msg.sender == verifier, "Only verifier can perform this action.");
        _;
    }

    constructor(
        string memory _title, // Gamer Stats
        string memory _achievement, // >70% completion
        uint256 _betSize, // 0.01 ETH
        uint256 _expiryDate, // 1 month
        address _verifier, // Gnosis Safe Address
        address _challengerAddr,
        address _defenderAddr,
        string memory _challengerUserID,
        string memory _defenderUserID
    ) payable {
        require(msg.value == _betSize, "Incorrect ETH amount sent.");
        defender = Player(_defenderAddr, _defenderUserID, false);
        game = Game(_title, _achievement);
        betSize = _betSize;
        expiry = _expiryDate;
        verifier = _verifier;
        challenger = Player(_challengerAddr, _challengerUserID, true);
        active = false;
    }

    // Update joinDuel function to use onlyDefender modifier
    function joinDuel() public payable nonReentrant onlyDefender {
        require(msg.value == betSize, "Incorrect ETH amount sent.");
        defender.hasJoined = true;
        active = true;
        emit PlayerJoined(msg.sender);
    }

    // Update rescindChallenge function to use onlyChallenger modifier
    function rescindChallenge() public onlyChallenger {
        require(!defender.hasJoined, "Defender has already joined.");
        active = false;
        payable(challenger.playerAddress).transfer(address(this).balance);
        emit ChallengeRescinded(address(this));
    }

    function matchExpired() public nonReentrant {
        require(block.timestamp > expiry, "Duel not yet expired.");
        require(active, "Duel already settled.");
        active = false;
        payable(challenger.playerAddress).transfer(betSize);
        payable(defender.playerAddress).transfer(betSize);
        emit DuelExpired(address(this));
    }

    function claimWin(address winner) public onlyVerifier{
        require(active, "Duel is not active.");
        require(winner == challenger.playerAddress || winner == defender.playerAddress, "Only player addresses can win.");
        active = false;
        payable(winner).transfer(address(this).balance);
        emit WinClaimed(msg.sender);
    }



    function getPlayerDetails() public view returns (
        address challengerAddress,
        string memory challengerUserID,
        bool challengerJoined,
        address defenderAddress,
        string memory defenderUserID,
        bool defenderJoined
    ) {
        challengerAddress = challenger.playerAddress;
        challengerUserID = challenger.platformUserID;
        challengerJoined = challenger.hasJoined;
        defenderAddress = defender.playerAddress;
        defenderUserID = defender.platformUserID;
        defenderJoined = defender.hasJoined;
    }

    function getGameDetails() public view returns (string memory title, string memory achievement) {
        title = game.title;
        achievement = game.achievement;
    }

    function isPlayerJoined(address player) public view returns (bool) {
        if (player == challenger.playerAddress) {
            return challenger.hasJoined;
        } else if (player == defender.playerAddress) {
            return defender.hasJoined;
        }
        return false;
    }

    function getCurrentDuelStatus() public view returns (string memory) {
        if (block.timestamp > expiry) {
            return "Expired";
        } else if (active) {
            return "Active";
        } else {
            return "Inactive";
        }
    }
}