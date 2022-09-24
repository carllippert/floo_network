// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.10;

import "solmate/tokens/ERC721.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

error IncorrectFunds();
error NonExistantToken();

contract Floo2 is ERC721, Ownable {
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
        uint256 taskBounty;
        //bounty paid to address that finds user to complete task
        uint256 recruiterBounty;
        //self explanatory
        uint256 deadline;
        //public metadata
        string tokenURI;
    }

    //tokenid -> task struct
    mapping(uint256 => Task) public tasks;

    //employer -> locked funds
    mapping(address => uint256) public lockedBalances;

    //address -> withdrawable funds
    mapping(address => uint256) public withdrawableBalances;

    //employer -> cancellable funds
    mapping(address => uint256) public cancellableBalances;

    //initiate the floo network
    constructor() ERC721(_name, _symbol) {}

    function mint(
        address _employer,
        address _creator,
        uint256 _creatorBounty,
        uint256 _taskBounty,
        uint256 _recruiterBounty,
        uint256 _deadline,
        string calldata _tokenURI
    ) external payable {
        if (
            msg.value !=
            (_creatorBounty + _taskBounty + _recruiterBounty + NETWORK_FEE)
        ) {
            revert IncorrectFunds();
        }

        //Create Task
        tasks[currentTokenId] = Task({
            employer: _employer,
            creator: _creator,
            creatorBounty: _creatorBounty,
            taskBounty: _taskBounty,
            recruiterBounty: _recruiterBounty,
            deadline: _deadline,
            tokenURI: _tokenURI
        });

        //Update Accounting

        //creator & network gets paid upfront
        withdrawableBalances[_creator] = _creatorBounty;
        withdrawableBalances[address(this)] = NETWORK_FEE;

        //unclaimed bounties live in "cancellable"
        cancellableBalances[_employer] = _taskBounty + _recruiterBounty;

        _safeMint(_employer, currentTokenId);

        // Counter overflow is incredibly unrealistic.
        unchecked {
            currentTokenId++;
        }
    }

    //TODO: perhaps tokenURI mapping is wise just for gas efficinet URI fetching?
    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        if (_exists(tokenId) == false) {
            revert NonExistantToken();
        }

        return tasks[tokenId].tokenURI;
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf[tokenId] != address(0);
    }
}
