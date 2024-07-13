pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

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

    bool public accepted;
    Player public challenger;
    Player public defender;
    address public verifier;
    uint256 public betSize;
    uint256 public expiry;
    bool public active = false;

    event PlayerJoined(address player);
    event DuelExpired(address duelAddress);
    event WinClaimed(address winner);
    event ChallengeRescinded(address rescindedDuel);

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
        defender = Player(_defenderAddr, _defenderUserID);
        game = Game(_title, _achievement);
        betSize = _betSize;
        expiry = _expiryDate;
        verifier = _verifier;
        challenger = Player(_challengerAddr, _challengerUserID);
        accepted = false;
    }

    function joinDuel(string memory platformUserID) public payable nonReentrant {
        require(msg.value == betSize, "Incorrect ETH amount sent.");

        bool isChallenger = msg.sender == challenger.playerAddress && !challenger.hasJoined;
        bool isDefender = msg.sender == defender.playerAddress && !defender.hasJoined;

        require(isChallenger || isDefender, "Not a registered player or already joined.");

        if (isChallenger) {
            challenger.platformUserID = platformUserID;
            challenger.hasJoined = true;
        } else {
            defender.platformUserID = platformUserID;
            defender.hasJoined = true;
        }

        emit PlayerJoined(msg.sender);
    }

    function rescindChallenge() public {
        require(msg.sender == challenger.playerAddress, "Only the challenger can rescind the challenge.");
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

    modifier onlyVerifier() {
        require(msg.sender == verifier, "Only verifier can perform this action.");
        _;
    }

    function getPlayerDetails() public view returns (
        address challengerAddress,
        string memory challengerUserID,
        bool challengerJoined,
        address defenderAddress,
        string memory defenderUserID,
        bool defenderJoined,
    ) {
        challengerAddress = challenger.playerAddress;
        challengerUserID = challenger.platformUserID;
        challengerJoined = challenger.hasJoined;
        defenderAddress = defender.playerAddress;
        defenderUserID = defender.platformUserID;
        defenderJoined = defender.hasJoined;
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