// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract DAOGovernance is AccessControl {
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");

    enum Role { User, Government, Enterprise }
    enum ProposalStatus { Pending, Active, Passed, Rejected, Executed }

    struct Voter {
        Role role;
        uint256 weight;
        bool exists;
    }

    struct Proposal {
        uint256 id;
        string title;
        string description;
        address proposer;
        uint256 startTime;
        uint256 endTime;
        ProposalStatus status;
        uint256 yesVotes;
        uint256 noVotes;
        mapping(address => bool) hasVoted;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => Voter) public voters;

    uint256 public constant USER_WEIGHT = 50;
    uint256 public constant GOVERNMENT_WEIGHT = 20;
    uint256 public constant ENTERPRISE_WEIGHT = 30;

    event ProposalCreated(uint256 indexed proposalId, string title, address proposer);
    event Voted(uint256 indexed proposalId, address voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PROPOSER_ROLE, msg.sender);
    }

    function registerVoter(address voter, Role role) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(!voters[voter].exists, "Already registered");
        uint256 weight;
        if (role == Role.User) weight = USER_WEIGHT;
        else if (role == Role.Government) weight = GOVERNMENT_WEIGHT;
        else if (role == Role.Enterprise) weight = ENTERPRISE_WEIGHT;
        
        voters[voter] = Voter({
            role: role,
            weight: weight,
            exists: true
        });
    }

    function createProposal(
        string memory title,
        string memory description,
        uint256 duration
    ) external onlyRole(PROPOSER_ROLE) {
        require(bytes(title).length > 0, "Empty title");
        require(duration >= 1 days, "Duration too short");

        proposalCount++;
        Proposal storage proposal = proposals[proposalCount];
        proposal.id = proposalCount;
        proposal.title = title;
        proposal.description = description;
        proposal.proposer = msg.sender;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + duration;
        proposal.status = ProposalStatus.Pending;

        emit ProposalCreated(proposalCount, title, msg.sender);
    }

    function startVoting(uint256 proposalId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.status == ProposalStatus.Pending, "Not pending");
        require(block.timestamp >= proposal.startTime, "Too early");
        
        proposal.status = ProposalStatus.Active;
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        Voter storage voter = voters[msg.sender];
        
        require(voter.exists, "Not a voter");
        require(proposal.status == ProposalStatus.Active, "Not active");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");

        proposal.hasVoted[msg.sender] = true;
        if (support) {
            proposal.yesVotes += voter.weight;
        } else {
            proposal.noVotes += voter.weight;
        }

        emit Voted(proposalId, msg.sender, support, voter.weight);
    }

    function finalizeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.status == ProposalStatus.Active, "Not active");
        require(block.timestamp > proposal.endTime, "Voting not ended");

        if (proposal.yesVotes > proposal.noVotes) {
            proposal.status = ProposalStatus.Passed;
        } else {
            proposal.status = ProposalStatus.Rejected;
        }
    }

    function executeProposal(uint256 proposalId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.status == ProposalStatus.Passed, "Not passed");
        
        proposal.status = ProposalStatus.Executed;
        emit ProposalExecuted(proposalId);
    }

    function getProposal(uint256 proposalId) external view returns (
        string memory title,
        string memory description,
        address proposer,
        uint256 startTime,
        uint256 endTime,
        ProposalStatus status,
        uint256 yesVotes,
        uint256 noVotes
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.title,
            proposal.description,
            proposal.proposer,
            proposal.startTime,
            proposal.endTime,
            proposal.status,
            proposal.yesVotes,
            proposal.noVotes
        );
    }
}
