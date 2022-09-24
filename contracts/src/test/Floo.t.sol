// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import "ds-test/test.sol";
import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "../Floo.sol";

contract FlooTest is DSTest {
    using stdStorage for StdStorage;

    Vm private vm = Vm(HEVM_ADDRESS);
    Floo private floo;
    StdStorage private stdstore;

    function setUp() public {
        // Deploy floo contract
        floo = new Floo("MLS", "Loop");
    }

    function testMintPricePaid() public {
        floo.mintTo(address(0), address(1), "https://example.com/token/1", 0, 0, 0, 0);
    }

    function testFailMintToZeroAddress() public {
        floo.mintTo(address(0), address(0), "https://example.com/token/1", 0, 0, 0, 0);
    }

    function testNewMintOwnerRegistered() public {
        floo.mintTo(address(0), address(1), "https://example.com/token/1", 0, 0, 0, 0);
        uint256 slotOfNewOwner = stdstore
            .target(address(floo))
            .sig(floo.ownerOf.selector)
            .with_key(1)
            .find();

        uint160 ownerOfTokenIdOne = uint160(
            uint256(
                (vm.load(address(floo), bytes32(abi.encode(slotOfNewOwner))))
            )
        );
        assertEq(address(ownerOfTokenIdOne), address(1));
    }

    function testBalanceIncremented() public {
        floo.mintTo(address(0), address(1), "https://example.com/token/1", 0, 0, 0, 0);
        uint256 slotBalance = stdstore
            .target(address(floo))
            .sig(floo.balanceOf.selector)
            .with_key(address(1))
            .find();

        uint256 balanceFirstMint = uint256(
            vm.load(address(floo), bytes32(slotBalance))
        );
        assertEq(balanceFirstMint, 1);

        floo.mintTo(address(0), address(1), "https://example.com/token/1", 0, 0, 0, 0);
        uint256 balanceSecondMint = uint256(
            vm.load(address(floo), bytes32(slotBalance))
        );
        assertEq(balanceSecondMint, 2);
    }

    function testSafeContractReceiver() public {
        Receiver receiver = new Receiver();
        floo.mintTo(
            address(0),
            address(receiver),
            "https://example.com/token/1",
            0,
            0,
            0,
            0
        );
        uint256 slotBalance = stdstore
            .target(address(floo))
            .sig(floo.balanceOf.selector)
            .with_key(address(receiver))
            .find();

        uint256 balance = uint256(vm.load(address(floo), bytes32(slotBalance)));
        assertEq(balance, 1);
    }

    function testFailUnSafeContractReceiver() public {
        vm.etch(address(1), bytes("mock code"));
        floo.mintTo(address(0), address(1), "https://example.com/token/1", 0, 0, 0, 0);
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
