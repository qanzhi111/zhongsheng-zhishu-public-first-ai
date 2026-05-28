// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract DIDIdentity {
    struct Identity {
        address owner;
        string did;
        bool isVerified;
        uint256 creditScore;
        uint256 createdAt;
        mapping(string => bytes) credentials;
        mapping(address => bool) authorized;
    }

    mapping(string => Identity) private identities;
    mapping(address => string) private addressToDID;
    address public regulator;
    address public admin;

    event IdentityCreated(string did, address owner);
    event IdentityVerified(string did);
    event CredentialAdded(string did, string credentialType);
    event AuthorizedAddressAdded(string did, address authorized);
    event AuthorizedAddressRemoved(string did, address authorized);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyRegulator() {
        require(msg.sender == regulator, "Only regulator");
        _;
    }

    modifier onlyOwner(string memory did) {
        require(identities[did].owner == msg.sender, "Only owner");
        _;
    }

    constructor() {
        admin = msg.sender;
        regulator = msg.sender;
    }

    function createIdentity(string memory did) external {
        require(bytes(did).length > 0, "Invalid DID");
        require(bytes(addressToDID[msg.sender]).length == 0, "Identity exists");
        
        Identity storage identity = identities[did];
        identity.owner = msg.sender;
        identity.did = did;
        identity.isVerified = false;
        identity.creditScore = 50;
        identity.createdAt = block.timestamp;
        
        addressToDID[msg.sender] = did;
        
        emit IdentityCreated(did, msg.sender);
    }

    function verifyIdentity(string memory did) external onlyRegulator {
        require(bytes(identities[did].did).length > 0, "Identity not found");
        identities[did].isVerified = true;
        identities[did].creditScore = 70;
        emit IdentityVerified(did);
    }

    function addCredential(string memory did, string memory credentialType, bytes memory credentialData) 
        external 
        onlyOwner(did) 
    {
        identities[did].credentials[credentialType] = credentialData;
        emit CredentialAdded(did, credentialType);
    }

    function getCredential(string memory did, string memory credentialType) 
        external 
        view 
        returns (bytes memory) 
    {
        Identity storage identity = identities[did];
        require(identity.owner == msg.sender || identity.authorized[msg.sender] || msg.sender == regulator, "Not authorized");
        return identity.credentials[credentialType];
    }

    function addAuthorizedAddress(string memory did, address authorized) external onlyOwner(did) {
        identities[did].authorized[authorized] = true;
        emit AuthorizedAddressAdded(did, authorized);
    }

    function removeAuthorizedAddress(string memory did, address authorized) external onlyOwner(did) {
        identities[did].authorized[authorized] = false;
        emit AuthorizedAddressRemoved(did, authorized);
    }

    function getIdentity(string memory did) 
        external 
        view 
        returns (address owner, bool isVerified, uint256 creditScore, uint256 createdAt) 
    {
        Identity storage identity = identities[did];
        return (identity.owner, identity.isVerified, identity.creditScore, identity.createdAt);
    }

    function getDIDByAddress(address addr) external view returns (string memory) {
        return addressToDID[addr];
    }

    function updateCreditScore(string memory did, uint256 score) external onlyAdmin {
        require(score <= 100, "Score too high");
        identities[did].creditScore = score;
    }

    function setRegulator(address newRegulator) external onlyAdmin {
        regulator = newRegulator;
    }
}
