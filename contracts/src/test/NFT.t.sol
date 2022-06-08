// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import "ds-test/test.sol";
import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "../NFT.sol";

contract NFTTest is DSTest {
    using stdStorage for StdStorage;

    Vm private vm = Vm(HEVM_ADDRESS);
    NFT private nft;
    StdStorage private stdstore;

    function setUp() public {
        // Deploy NFT contract
        nft = new NFT("NFT_tutorial", "Loop");
    }

    function testMintPricePaid() public {
        nft.mintTo(address(1), "https://example.com/token/1");
    }

    function testFailMintToZeroAddress() public {
        nft.mintTo(address(0), "https://example.com/token/1");
    }

    function testNewMintOwnerRegistered() public {
        nft.mintTo(address(1), "https://example.com/token/1");
        uint256 slotOfNewOwner = stdstore
            .target(address(nft))
            .sig(nft.ownerOf.selector)
            .with_key(1)
            .find();

        uint160 ownerOfTokenIdOne = uint160(
            uint256(
                (vm.load(address(nft), bytes32(abi.encode(slotOfNewOwner))))
            )
        );
        assertEq(address(ownerOfTokenIdOne), address(1));
    }

    function testBalanceIncremented() public {
        nft.mintTo(address(1), "https://example.com/token/1");
        uint256 slotBalance = stdstore
            .target(address(nft))
            .sig(nft.balanceOf.selector)
            .with_key(address(1))
            .find();

        uint256 balanceFirstMint = uint256(
            vm.load(address(nft), bytes32(slotBalance))
        );
        assertEq(balanceFirstMint, 1);

        nft.mintTo(address(1), "https://example.com/token/1");
        uint256 balanceSecondMint = uint256(
            vm.load(address(nft), bytes32(slotBalance))
        );
        assertEq(balanceSecondMint, 2);
    }

    function testSafeContractReceiver() public {
        Receiver receiver = new Receiver();
        nft.mintTo(address(receiver), "https://example.com/token/1");
        uint256 slotBalance = stdstore
            .target(address(nft))
            .sig(nft.balanceOf.selector)
            .with_key(address(receiver))
            .find();

        uint256 balance = uint256(vm.load(address(nft), bytes32(slotBalance)));
        assertEq(balance, 1);
    }

    function testFailUnSafeContractReceiver() public {
        vm.etch(address(1), bytes("mock code"));
        nft.mintTo(address(1), "https://example.com/token/1");
    }
}

contract Receiver is ERC721TokenReceiver {
    function onERC721Received(
        address, // operator,
        address, //from,
        uint256, //id,
        bytes calldata // data
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}
