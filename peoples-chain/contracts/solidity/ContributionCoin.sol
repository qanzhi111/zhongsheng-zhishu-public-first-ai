// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ContributionCoin is ERC20, AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant REDEEMER_ROLE = keccak256("REDEEMER_ROLE");

    uint256 public constant MAX_SUPPLY = 100000000 * 10 ** decimals();
    mapping(address => uint256) public lastIssued;
    uint256 public constant ISSUE_COOLDOWN = 1 days;

    event ContributionRewarded(address indexed contributor, uint256 amount, string reason);
    event ContributionRedeemed(address indexed redeemer, uint256 amount, string service);

    constructor() ERC20("贡献币", "GXC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
        _grantRole(REDEEMER_ROLE, msg.sender);
    }

    function issueContribution(address to, uint256 amount, string memory reason) public onlyRole(ISSUER_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        require(block.timestamp - lastIssued[to] >= ISSUE_COOLDOWN, "Cooldown period");
        
        _mint(to, amount);
        lastIssued[to] = block.timestamp;
        emit ContributionRewarded(to, amount, reason);
    }

    function redeem(address from, uint256 amount, string memory service) public onlyRole(REDEEMER_ROLE) {
        require(balanceOf(from) >= amount, "Insufficient balance");
        _burn(from, amount);
        emit ContributionRedeemed(from, amount, service);
    }

    function transfer(address to, uint256 amount) public pure override returns (bool) {
        revert("ContributionCoin is non-transferable");
    }

    function transferFrom(address from, address to, uint256 amount) public pure override returns (bool) {
        revert("ContributionCoin is non-transferable");
    }
}
