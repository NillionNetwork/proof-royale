Compiling 3 files with Solc 0.8.24
Solc 0.8.24 finished in 70.01ms
pragma solidity ^0.8.0 ^0.8.20;

// lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol

// OpenZeppelin Contracts (last updated v5.0.0) (utils/ReentrancyGuard.sol)

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    uint256 private _status;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        if (_status == ENTERED) {
            revert ReentrancyGuardReentrantCall();
        }

        // Any calls to nonReentrant after this point will fail
        _status = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == ENTERED;
    }
}

// src/Duel.sol

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

// src/DuelFactory.sol

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

