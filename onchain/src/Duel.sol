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
    }

    bool public accepted;
    Player public challenger;
    Player public defender;
    address public verifier;
    address public asset;
    uint256 public betSize;
    uint256 public expiry;

    event PlayerJoined(address player);
    event DuelExpired(address duelAddress);
    event WinClaimed(address winner);
    event ContractTerminated(address terminatedContract);

    constructor(
        string memory _title,
        string memory _achievement,
        address _asset,
        uint256 _amount,
        uint256 _expiryDate,
        address _verifier,
        address _challengerAddr,
        address _defenderAddr,
        string memory _challengerUserID,
        string memory _defenderUserID
        ) {
        defender = Player(_defenderAddr, _defenderUserID);
        game = Game(_title, _achievement);
        asset = _asset;
        betSize = _amount;
        expiry = _expiryDate;
        verifier = _verifier;
        challenger = Player(_challengerAddr, _challengerUserID);
        accepted = false;
    }

    function joinDuel(string memory platformUserID) public payable nonReentrant {
        require(msg.value >= betAmount, "Mimimum bet amount not met.");
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

        if (msg.value > betAmount) {
            payable(msg.sender).transfer(msg.value - betAmount);
        }

        emit PlayerJoined(msg.sender);
    }

    function matchExpired() public nonReentrant {
        require(block.timestamp > expiry, "Duel not yet expired.");
        require(active, "Duel already settled.");
        payable(challenger.playerAddress).transfer(betAmount);
        payable(defender.playerAddress).transfer(betAmount);
        active = false;
        emit DuelExpired(address(this));
    }

    function claimWin() public nonReentrant {
        require(msg.sender == verifier, "Only verifier can determine the winner.");
        require(active, "Duel is not active.");
        // Implement win logic and token transfer
        active = false;
        emit WinClaimed(msg.sender); // Winner's address to be added after logic
    }

    function terminateContract() public onlyVerifier {
        require(!active, "Cannot terminate an active duel.");
        emit ContractTerminated(address(this));
        selfdestruct(payable(verifier));
    }

    modifier onlyVerifier() {
        require(msg.sender == verifier, "Only verifier can perform this action.");
        _;
    }
}

    function getDuelDetails() public view returns (
        bool isActive,
        address challengerAddress,
        string memory challengerUserID,
        bool challengerJoined,
        address defenderAddress,
        string memory defenderUserID,
        bool defenderJoined,
        address verifierAddress,
        uint256 betAmountValue,
        uint256 duelExpiry
    ) {
        isActive = active;
        challengerAddress = challenger.playerAddress;
        challengerUserID = challenger.platformUserID;
        challengerJoined = challenger.hasJoined;
        defenderAddress = defender.playerAddress;
        defenderUserID = defender.platformUserID;
        defenderJoined = defender.hasJoined;
        verifierAddress = verifier;
        betAmountValue = betAmount;
        duelExpiry = expiry;
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