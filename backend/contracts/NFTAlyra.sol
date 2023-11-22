// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "./ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Alyra is ERC721A, Ownable {


    // Hidden ipfs://bafybeig4rb5srzxkwfmfg4qmdqv5eiqutg6pa4uqzaqwwonhmd2cgg5gl4/
    // ipfs://bafybeib5tuh4bbwv37rop7unui54qmqcnhi3ggty6ao4p7shmjncxgzkyu/

    using Strings for uint;
    uint8 private constant MAX_SUPPLY = 50;
    uint8 private constant AMOUNT_NFT_PER_WALLET = 2;
    uint256 private constant PRICE_PER_NFT = 0.02 ether;
    string public baseURI; // ipfs://CID/

    bytes32 public merkleRoot;

    mapping(address => uint256) amountNFTsMintedPerWallet;

    constructor(bytes32 _merkleRoot, string memory _baseURI) Ownable(msg.sender) ERC721A("Alyra", "ALY") {
        baseURI = _baseURI;
        merkleRoot = _merkleRoot;
    }

    function mint(uint256 _quantity, bytes32[] calldata _proof) external payable {
        require(isWhitelisted(msg.sender, _proof), "Not Whislisted");
        require(amountNFTsMintedPerWallet[msg.sender] + _quantity <= AMOUNT_NFT_PER_WALLET, "You cannot mint more than 2 NFTs");
        require(totalSupply() + _quantity <= MAX_SUPPLY, "Max supply exceeded");
        require(msg.value >= PRICE_PER_NFT * _quantity, "Not enough funds");
        amountNFTsMintedPerWallet[msg.sender] += _quantity;
        _safeMint(msg.sender, _quantity);
    }

    // Reveal
    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function tokenURI(uint _tokenId) public view virtual override(ERC721A) returns(string memory) {
        // 0 => ipfs://CID/0.json
        // 1 => ipfs://CID/1.json
        // 2 => ipfs://CID/2.json
        require(_exists(_tokenId), "URI query for nonexistent token");

        // "ipfs://CID/" + _tokenId + ".json"
        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }

    /**
    * @notice Check if an address is whitelisted or not
    *
    * @param _account The account checked
    * @param _proof The Merkle Proof
    *
    * @return bool return true if the address is whitelisted, false otherwise
    */
    function isWhitelisted(address _account, bytes32[] calldata _proof) internal view returns(bool) {
        return MerkleProof.verify(_proof, merkleRoot, keccak256(abi.encodePacked(_account)));
    }

    function withdraw() external onlyOwner {
        (bool success,) = msg.sender.call{value: address(this).balance}("");
        require(success, "oh no :'(((((");
    }
}