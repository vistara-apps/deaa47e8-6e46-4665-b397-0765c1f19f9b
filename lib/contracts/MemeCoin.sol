// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MemeCoin is ERC20, Ownable, ReentrancyGuard {
    // Events
    event MemeReward(address indexed user, uint256 amount, string reason);
    event MemeBurned(address indexed user, uint256 amount, string reason);

    // Constants
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant REWARD_RATE = 10 * 10**18; // 10 tokens per reward
    uint256 public constant BURN_RATE = 1 * 10**18; // 1 token burn per transaction

    // Mappings
    mapping(address => uint256) public lastRewardTime;
    mapping(address => bool) public isAuthorizedMinter;

    constructor() ERC20("MemeCoin", "MEME") {
        _mint(msg.sender, 100_000 * 10**18); // Initial supply to deployer
        isAuthorizedMinter[msg.sender] = true;
    }

    // Modifiers
    modifier onlyAuthorized() {
        require(isAuthorizedMinter[msg.sender], "Not authorized to mint");
        _;
    }

    modifier canReward(address user) {
        require(block.timestamp >= lastRewardTime[user] + 1 hours, "Reward cooldown active");
        _;
    }

    // Admin functions
    function addAuthorizedMinter(address minter) external onlyOwner {
        isAuthorizedMinter[minter] = true;
    }

    function removeAuthorizedMinter(address minter) external onlyOwner {
        isAuthorizedMinter[minter] = false;
    }

    // Reward functions
    function rewardUser(address user, string calldata reason) external onlyAuthorized canReward(user) nonReentrant {
        require(totalSupply() + REWARD_RATE <= MAX_SUPPLY, "Max supply reached");

        _mint(user, REWARD_RATE);
        lastRewardTime[user] = block.timestamp;

        emit MemeReward(user, REWARD_RATE, reason);
    }

    function rewardMultipleUsers(address[] calldata users, string calldata reason) external onlyAuthorized nonReentrant {
        uint256 totalReward = users.length * REWARD_RATE;
        require(totalSupply() + totalReward <= MAX_SUPPLY, "Max supply would exceed limit");

        for (uint256 i = 0; i < users.length; i++) {
            if (block.timestamp >= lastRewardTime[users[i]] + 1 hours) {
                _mint(users[i], REWARD_RATE);
                lastRewardTime[users[i]] = block.timestamp;
                emit MemeReward(users[i], REWARD_RATE, reason);
            }
        }
    }

    // Burn function for marketplace transactions
    function burnForTransaction(address user, uint256 amount) external onlyAuthorized nonReentrant {
        require(balanceOf(user) >= amount, "Insufficient balance");
        _burn(user, amount);
        emit MemeBurned(user, amount, "Marketplace transaction");
    }

    // Transfer with burn fee
    function transferWithFee(address to, uint256 amount) external nonReentrant returns (bool) {
        require(balanceOf(msg.sender) >= amount + BURN_RATE, "Insufficient balance including burn fee");

        uint256 burnAmount = BURN_RATE;
        uint256 transferAmount = amount;

        _burn(msg.sender, burnAmount);
        _transfer(msg.sender, to, transferAmount);

        emit MemeBurned(msg.sender, burnAmount, "Transfer fee");

        return true;
    }

    // Override transfer to include burn fee for marketplace transactions
    function transfer(address to, uint256 amount) public virtual override nonReentrant returns (bool) {
        // For marketplace transactions, use transferWithFee
        // For regular transfers, proceed normally
        return super.transfer(to, amount);
    }

    // View functions
    function getRewardCooldown(address user) external view returns (uint256) {
        if (block.timestamp < lastRewardTime[user] + 1 hours) {
            return (lastRewardTime[user] + 1 hours) - block.timestamp;
        }
        return 0;
    }

    function canUserBeRewarded(address user) external view returns (bool) {
        return block.timestamp >= lastRewardTime[user] + 1 hours;
    }
}

