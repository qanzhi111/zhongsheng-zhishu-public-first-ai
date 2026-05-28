// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract RMBStableCoin is ERC20, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant REGULATOR_ROLE = keccak256("REGULATOR_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    mapping(address => bool) public blacklisted;

    event Blacklisted(address indexed account);
    event Unblacklisted(address indexed account);
    event TransactionFrozen(address indexed from, address indexed to, uint256 amount);

    constructor() ERC20("人民链稳定币", "RMBc") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(REGULATOR_ROLE, msg.sender);
        _grantRole(BURNER_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(!blacklisted[to], "Account blacklisted");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public onlyRole(BURNER_ROLE) {
        _burn(from, amount);
    }

    function pause() public onlyRole(REGULATOR_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(REGULATOR_ROLE) {
        _unpause();
    }

    function blacklist(address account) public onlyRole(REGULATOR_ROLE) {
        blacklisted[account] = true;
        emit Blacklisted(account);
    }

    function unblacklist(address account) public onlyRole(REGULATOR_ROLE) {
        blacklisted[account] = false;
        emit Unblacklisted(account);
    }

    function freezeTransaction(address from, address to, uint256 amount) public onlyRole(REGULATOR_ROLE) {
        emit TransactionFrozen(from, to, amount);
    }

    function transfer(address to, uint256 amount) public virtual override whenNotPaused returns (bool) {
        require(!blacklisted[_msgSender()], "Sender blacklisted");
        require(!blacklisted[to], "Recipient blacklisted");
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public virtual override whenNotPaused returns (bool) {
        require(!blacklisted[from], "Sender blacklisted");
        require(!blacklisted[to], "Recipient blacklisted");
        return super.transferFrom(from, to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        require(!paused(), "Token transfer while paused");
    }
}
