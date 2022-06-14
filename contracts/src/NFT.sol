// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.10;

import "solmate/tokens/ERC721.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

error MintPriceNotPaid();
error MaxSupply();
error NonExistentTokenURI();
error WithdrawTransfer();

contract NFT is ERC721, Ownable {
    using Strings for uint256;
    uint256 public currentTokenId;

    struct Job {
        //the address, entity that "owns" the nft
        //need to figure out how to do this where the "creator" and the "owner"
        //are simple to navigate and obviously not the same
        //avergae user will not be a *creator*
        //systems will be creators
        address recipient;
        //for the entity doing the work. Built in way to hire 3rd parties native to the protocol
        //also often left at zero. For this may be a salaried job not an external one.
        uint256 executerFee;
        //for the system, address,  etc that mints the NFT
        //economic incentive for integration into 3rd party user tools like Asana, Github, Airtable, etc
        //maybe not store? would improve efficiency since payout is at mint
        //may also be not regularly used. Platforms could say "pay for enterprise with USD" and they just cover txn costs and
        //don't include a "creator fee" on the mint transactions they facilitate
        uint256 creatorFee;
        //maybe change name to minter? more explicity? the entity that *mints* the NFT
        //for the dao, guild, marketplace, human, contract etc that helps find the person who does the "work"
        //this will often be kept 0 because no payment may be included since this is just part of a salaried job
        //inspired by recruiter fee naming for zora asks
        uint256 recruiterFee;
        //in future allow dif currencies for everything
        //at least at first blush that seems to be something people would want
        // address jobCurrency;
        //TODO: worry about multicurrency way fucking later
        //the date that something is claimable till.
        //expressed as a blockstamp
        //unsure if this should actually exist
        //external contract could be set  up to use oracle to "burn" this job if it is not completed by date
        //this also is a nice way to prevent capital getting accidentally locked up?
        //some sort form of "debt liquidation" type mev reward to make sure capital is free'd up?
        uint256 deadline;
        //parent or child relationships?
        //gant module
        //what is the equivilant of a "router" like in uniswap to add "expected" features that don't make sense at lowest level?
        //how do we create predictable futures ( aka i know what work I will do next month, next year etc ) without protocol bloat
        //relations or requirements module?
        //like create a place where another contract can be called or is "known" to be indexed to create infoormation
        //for this future?
        //TODO: remove after dev
        string tokenURI;
    }

    //TODO: need to override _burn so that appropriate users receive funds

    /// @notice Emitted when an ask is created
    /// @param tokenId The ERC-721 token ID of the created Job
    /// @param job The metadata of the created job
    event JobCreated(uint256 indexed tokenId, Job job);

    // Custom URI for each token
    mapping(uint256 => string) private _tokenURIs;

    //incentives
    mapping(uint256 => Job) private _jobs;

    //claimed tokens ( work being done! )
    //TODO: how will user best determine what they currently have claimed?
    mapping(uint256 => address) private _claimedTokens;

    //recruiter for job
    mapping(uint256 => address) private _jobsRecruiter;

    //claimable balances
    //from a entity creating a job. the balances start here
    //creator balance is claimable right away
    //recruiter is claimable after completion
    //executer is claimable after completion
    mapping(address => uint256) private _claimableBalances;

    //locked balances
    //once a job is claimed, the balances are locked here
    mapping(address => uint256) private _lockedBlances;

    //reclaimable balances ( balances from burnable tokens )
    mapping(address => uint256) private _reclaimableBalances;

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}

    function mintTo(
        address _creator,
        address _recipient,
        string memory _tokenURI,
        uint256 _executerFee,
        uint256 _recruiterFee,
        uint256 _creatorFee,
        uint256 _deadline
    ) public payable returns (uint256) {
        uint256 _totalFee = _executerFee + _recruiterFee + _creatorFee;

        //exact amount required for the job to be created
        //and incentives initiated
        require(_totalFee == msg.value, "incorrect funds sent");

        uint256 _tokenId = ++currentTokenId;
        _safeMint(_recipient, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);

        //set claimable for creator
        //creator just gets paid right away in current thinking
        _claimableBalances[_creator] = _creatorFee;

        //set reclaimable for executer && recruiter ( both unknown at this point )
        //so the person who sent the money the base user, can claim this back if
        //no one does the work or if they are fishing etc
        _reclaimableBalances[_recipient] = _executerFee + _recruiterFee;

        _jobs[_tokenId] = Job({
            recipient: _recipient,
            executerFee: _executerFee,
            creatorFee: _creatorFee,
            recruiterFee: _recruiterFee,
            deadline: _deadline,
            tokenURI: _tokenURI
        });

        emit JobCreated(_tokenId, _jobs[_tokenId]);

        return _tokenId;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];

        return _tokenURI;
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    function withdrawPayments(address payable payee) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool transferTx, ) = payee.call{value: balance}("");
        if (!transferTx) {
            revert WithdrawTransfer();
        }
    }

    // TODO: remove just for dev really.
    function getCurrentTokenId() public view virtual returns (uint256) {
        return currentTokenId;
    }

    function getJob(uint256 tokenId) public view virtual returns (Job memory) {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI query for nonexistent token"
        );

        Job memory _job = _jobs[tokenId];

        return _job;
    }

    function getClaimStatus(uint256 tokenId)
        public
        view
        virtual
        returns (address)
    {
        require(_exists(tokenId), "query for nonexistent token");
        //TODO: should be in the graph? also how best to deal with unclaimed?
        //will it be zero address?
        address _claimer = _claimedTokens[tokenId];

        return _claimer;
    }

    //TODO: user should be able to listen to these events
    //aka there should be events in general
    function getBalances(address payee)
        public
        view
        virtual
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        uint256 _claimable = _claimableBalances[payee];
        uint256 _locked = _lockedBlances[payee];
        uint256 _reclaimable = _reclaimableBalances[payee];

        return (_claimable, _reclaimable, _locked);
    }

    //should maybe the recruiter be able to request to claim part of executer fee
    //vs the creator needing to explicitly set and correctly price a recruiter fee?
    //TODO: a shit load of complicated stuff related to aggregate identities goldlists, disallow lists
    //etc
    function claimJob(
        uint256 tokenId,
        address recruiter,
        address executer
    ) public returns (uint256) {
        //token exists
        _exists(tokenId);
        //require that the token is available to be claimed
        //token not burned
        //token not currently claimed
        //TODO: this is probs shit logic
        require(_claimedTokens[tokenId] == address(0), "token already claimed");

        _jobsRecruiter[tokenId] = recruiter;
        _claimedTokens[tokenId] = executer;

        return tokenId;
    }

    //TODO: design of hooks to allow for arbitrary complexity for "completion state determination"
    function finishJob(uint256 tokenId, address executer)
        public
        returns (uint256)
    {
        //token exists
        _exists(tokenId);
        //require that the token is available to be claimed
        //token not burned
        //token either unclaimed or claimed by executer
        if (
            _claimedTokens[tokenId] == address(0) ||
            _claimedTokens[tokenId] == executer
        ) {
            //can be finished if either unclaimed or claimed by finisher
            Job memory job = _jobs[tokenId];
            uint256 _totalFee = job.executerFee + job.recruiterFee;
            // START by reducing balances from corresponding balances
            //from the person who made the job in the first place
            //if the token was claimed.
            //move money from locked to claimable
            if (_claimedTokens[tokenId] == executer) {
                //person who minted the job with their money gets money removed from locked
                _lockedBlances[job.recipient] -= _totalFee;
            } else {
                //if job was *NOT* claimed.
                //we allow for finishing of unclaimed jobs as a nicety.
                //move from origin of balance to finisher
                _reclaimableBalances[job.recipient] -= _totalFee;
            }

            //pay out to recruiter && executer
            //recruiter receives recruiter fee
            _claimableBalances[_jobsRecruiter[tokenId]] += job.recruiterFee;
            //executer receives executer fee
            _claimableBalances[executer] += job.executerFee;

            //unclaim nft
            delete _claimedTokens[tokenId];
            //burn to zero address
            _burn(tokenId);
        } else {
            //TODO: create custom error for this
            revert("not able to finish job");
        }
        return tokenId;
    }

    //only can be cancelled while unclaimed
    //maybe there should be a reward for all actions to take on an nft?
    //or allow a portion of any so that their is a monetary model for say an app
    //that removes bullshit jobs from the system for you?
    //but that really only is for the original minter no?
    //TODO: allow the recruiter bounty to be taken by MEV if deadline has passed?
    function cancelJob(uint256 tokenId) public returns (uint256) {
        Job memory job = _jobs[tokenId];
        //require you are the "recipient" of the nft or owner
        //TODO: ability to simplify be removing recipient in leu of owner?
        //TODO: allow for transfer function for orgs that spin up and down allowing for tranfsers?

        require(_ownerOf[tokenId] == msg.sender, "not the owner of the job");

        //if owner of job require the job is not claimed
        require(_claimedTokens[tokenId] == address(0), "job currently claimed");
        //not sure if this logic is correct not really that experienced with address(0)
        //and state allocation in solidity

        //if not claimed and owned by the txn sender
        //move funds to claimable from locked

        //move from reclaimable
        _reclaimableBalances[job.recipient] -=
            job.executerFee +
            job.recruiterFee;
        //move to claimable
        _claimableBalances[job.recipient] += job.recruiterFee + job.executerFee;

        //burn nft
        _burn(tokenId);
        return tokenId;
    }

    //TODO: monetary incentive for making this happen less often?
    //can a minter add a cost to unclaim?
    //can this be best handled implicitly through reputation systems?
    function unClaimJob(uint256 tokenId) public returns (uint256) {
        require(
            _claimedTokens[tokenId] == msg.sender,
            "you are not the claimer on this job"
        );

        Job memory job = _jobs[tokenId];
        uint256 _totalFee = job.executerFee + job.recruiterFee;

        //if the user is the claimer. delete claim and move capital back to reclaimable
        _lockedBlances[msg.sender] -= _totalFee;
        //TODO: should follow a patter for how we access recipient / owner etc.
        //sloppy right now
        _reclaimableBalances[job.recipient] += _totalFee;

        //unclaim nft
        delete _claimedTokens[tokenId];

        return tokenId;
    }

    /**
     * @dev Returns whether `tokenId` exists.
     *
     * Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.
     *
     * Tokens start existing when they are minted (`_mint`),
     * and stop existing when they are burned (`_burn`).
     */
    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return _ownerOf[tokenId] != address(0);
    }
}
