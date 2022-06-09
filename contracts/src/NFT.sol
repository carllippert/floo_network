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

    //claimable balances
    mapping(address => uint256) private _claimableBalances;

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}

    function mintTo(
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

        //TODO: do we actually mint to a users address?
        //TODO: maybe we mint to the contract address? Or should these
        //TODO: how do we provide correct amount of funds, and check that they are accurate?
        uint256 _tokenId = ++currentTokenId;
        _safeMint(_recipient, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);

        //TODO: require that "payable" is sufficient to cover *exactly*
        //executer fee +
        //recruiter fee +
        //creator fee

        _jobs[_tokenId] = Job({
            recipient: _recipient,
            executerFee: _executerFee,
            creatorFee: _creatorFee,
            recruiterFee: _recruiterFee,
            deadline: _deadline
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
