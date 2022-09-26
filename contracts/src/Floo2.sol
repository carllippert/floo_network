// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.10;

import "solmate/tokens/ERC721.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

error IncorrectFunds();
error NonExistantTask();
error IncompatableStatus();
error UnAuthorized();

contract Floo2 is ERC721, Ownable {
    event TaskClaimed(
        uint256 indexed tokenId,
        address indexed contractor,
        address indexed recruiter
    );

    event TaskUnclaimed(uint256 indexed tokenId);

    event TaskCancelled(uint256 indexed tokenId);

    event TaskClosed(uint256 indexed tokenId);

    using Strings for uint256;

    string constant _name = "Floo Network";
    string constant _symbol = "FLOO";

    //Keep current tokeId;
    uint256 public currentTokenId;

    //threat of fee
    //hyperstructures paper
    uint256 public NETWORK_FEE = 0;

    struct Task {
        //address spending funds to create task
        address employer;
        //app that mints on behalf of user
        address creator;
        //bounty paid to app that creates on behalf of user
        uint256 creatorBounty;
        //bounty paid on completion of task to task completer
        uint256 contractorBounty;
        //bounty paid to address that finds user to complete task
        uint256 recruiterBounty;
        //self explanatory
        uint256 deadline;
        //public metadata
        string tokenURI;
        //task status
        Status status;
        //recruiter
        address recruiter;
        //contractor
        address contractor;
    }

    enum Status {
        OPEN,
        PENDING,
        CLOSED
    }

    //tokenid -> task struct
    mapping(uint256 => Task) public tasks;

    //employer -> locked funds
    mapping(address => uint256) public escrowedBalances;

    //address -> withdrawable funds
    mapping(address => uint256) public withdrawableBalances;

    //employer -> cancellable funds
    mapping(address => uint256) public cancellableBalances;

    //initiate the floo network
    constructor() ERC721(_name, _symbol) {}

    function mintTask(
        address _employer,
        address _creator,
        uint256 _creatorBounty,
        uint256 _contractorBounty,
        uint256 _recruiterBounty,
        uint256 _deadline,
        string calldata _tokenURI
    ) external payable {
        if (
            msg.value !=
            (_creatorBounty +
                _contractorBounty +
                _recruiterBounty +
                NETWORK_FEE)
        ) {
            revert IncorrectFunds();
        }

        //Create Task
        tasks[currentTokenId] = Task({
            employer: _employer,
            creator: _creator,
            creatorBounty: _creatorBounty,
            contractorBounty: _contractorBounty,
            recruiterBounty: _recruiterBounty,
            deadline: _deadline,
            tokenURI: _tokenURI,
            status: Status.OPEN,
            contractor: address(0),
            recruiter: address(0)
        });

        //Update Accounting

        //creator & network gets paid upfront
        withdrawableBalances[_creator] = _creatorBounty;
        withdrawableBalances[address(this)] = NETWORK_FEE;

        //unclaimed bounties live in "cancellable"
        cancellableBalances[_employer] = _contractorBounty + _recruiterBounty;

        _safeMint(_employer, currentTokenId);

        // Counter overflow is incredibly unrealistic.
        unchecked {
            currentTokenId++;
        }
    }

    function claimTask(
        uint256 _tokenId,
        address _recruiter,
        address _contractor
    ) external {
        //token must exist
        if (_exists(_tokenId) == false) {
            revert NonExistantTask();
        }

        //status must be OPEN
        if (tasks[_tokenId].status != Status.OPEN) {
            revert IncompatableStatus();
        }

        Task memory task = tasks[_tokenId];

        //update accounting
        uint256 totalFee = task.contractorBounty + task.recruiterBounty;

        //transfer bounties from "cancellable" to "escrowed"
        //remove bounties from cancellable
        cancellableBalances[task.employer] -= totalFee;
        //put bounties in escrow
        escrowedBalances[task.employer] += totalFee;

        //update state
        task.contractor = _contractor;
        task.recruiter = _recruiter;
        task.status = Status.PENDING;

        emit TaskClaimed(_tokenId, _contractor, _recruiter);
    }

    function unclaimTask(uint256 _tokenId) external {
        //token must exist
        if (_exists(_tokenId) == false) {
            revert NonExistantTask();
        }

        Task memory task = tasks[_tokenId];

        //status must be PENDING
        if (tasks[_tokenId].status != Status.PENDING) {
            revert IncompatableStatus();
        }

        if (task.contractor != msg.sender) {
            revert UnAuthorized();
        }

        //update accounting
        uint256 totalFee = task.contractorBounty + task.recruiterBounty;

        //transfer bounties from "escrowed" to "cancellable"

        //take bounties out of escrow
        escrowedBalances[task.employer] -= totalFee;
        //move bounties to cancellable
        cancellableBalances[task.employer] += totalFee;

        //update state
        task.contractor = address(0);
        task.recruiter = address(0);
        task.status = Status.OPEN;

        emit TaskUnclaimed(_tokenId);
    }

    function cancelTask(uint256 _tokenId) external {
        //token must exist
        if (_exists(_tokenId) == false) {
            revert NonExistantTask();
        }

        Task memory task = tasks[_tokenId];

        //status must be OPEN
        if (tasks[_tokenId].status != Status.OPEN) {
            revert IncompatableStatus();
        }

        if (task.employer != msg.sender) {
            revert UnAuthorized();
        }

        //update accounting
        uint256 totalFee = task.contractorBounty + task.recruiterBounty;

        //transfer bounties from "cancellable" to "withdrawable"

        //remove bounties from cancellable
        cancellableBalances[task.employer] -= totalFee;
        //put bounties in withdrawable
        withdrawableBalances[task.employer] += totalFee;

        //update state
        task.contractor = address(0);
        task.recruiter = address(0);
        task.status = Status.CLOSED;

        emit TaskCancelled(_tokenId);
    }

    function closeTask(uint256 _tokenId) external {
        //token must exist
        if (_exists(_tokenId) == false) {
            revert NonExistantTask();
        }

        Task memory task = tasks[_tokenId];

        //status must be PENDING
        if (tasks[_tokenId].status != Status.PENDING) {
            revert IncompatableStatus();
        }

        if (task.contractor != msg.sender) {
            revert UnAuthorized();
        }

        //update accounting
        uint256 totalFee = task.contractorBounty + task.recruiterBounty;

        //transfer bounties from "escrowed" to "withdrawable"

        //remove bounties from cancellable
        escrowedBalances[task.employer] -= totalFee;

        //put bounties in withdrawable
        withdrawableBalances[task.contractor] += task.contractorBounty;
        withdrawableBalances[task.recruiter] += task.recruiterBounty;

        //update state
        task.status = Status.CLOSED;

        emit TaskClosed(_tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        if (_exists(tokenId) == false) {
            revert NonExistantTask();
        }

        return tasks[tokenId].tokenURI;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf[tokenId] != address(0);
    }
}
