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
        //for the system, address, etc that mints the NFT
        //economic incentive for integration into 3rd party user tools like Asana, Github, Airtable, etc
        //maybe not store? would improve efficiency since payout is at mint
        //may also be not regularly used. Platforms could say "pay for enterprise with USD" and they just cover txn costs and
        //don't include a "creator fee" on the mint transactions they facilitate
        uint256 creatorFee; 
        //for the dao, guild, marketplace, human, contract etc that helps find the person who does the "work"
        //this will often be kept 0 because no payment may be included since this is just part of a salaried job
        //inspired by recruiter fee naming for zora asks
        uint256 recruiterFee;
        //for the entity doing the work. Built in way to hire 3rd parties native to the protocol
        //also often left at zero. For this may be a salaried job not an external one. 
        uint256 exectuterFee;
        //in future allow dif currencies for everything
        //at least at first blush that seems to be something people would want 
        address jobCurrency;
        //the date that something is claimable till. 
        //expressed as a blockstamp
        //unsure if this should actually exist
        //external contract could be set up to use oracle to "burn" this job if it is not completed by date
        uint256 deadline; 
    }

    // Custom URI for each token
    mapping(uint256 => string) private _tokenURIs;

    //royalties
    mapping(uint256 => Job) private _jobs; 

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}

    function mintTo(address recipient, string calldata newTokenURI)
        public
        payable
        returns (uint256)
    {
        //TODO: do we actually mint to a users address?
        //TODO: maybe we mint to the contract address? Or should these
        //TODO: how do we provide correct amount of funds, and check that they are accurate?
        uint256 newTokenId = ++currentTokenId;
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, newTokenURI);
        return newTokenId;
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
