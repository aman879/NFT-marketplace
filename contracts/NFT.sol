// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage {
    address owner;
    uint256 tokenIdCounter;

    struct NFTDetails {
        uint256 price;
        string uri;
    }

    mapping(address => uint256[]) private balance;
    mapping(uint256 => NFTDetails) private NFTDetailsbyID;

    event NFTMinted(uint256 indexed tokenId, address indexed to, uint256 price, string uri);

    modifier onlyOwner {
        require(msg.sender == owner, "You are not onwer");
        _;
    }

    constructor() ERC721("Flower Token", "FTN") {
        owner = msg.sender;
    }

    function mint(address _to,uint256 _price, string memory _uri) external{
        tokenIdCounter++;
        uint256 tokenId = tokenIdCounter;

        balance[msg.sender].push(tokenId);
        NFTDetailsbyID[tokenId] = NFTDetails(_price, _uri);

        _mint(_to, tokenIdCounter);
        _setTokenURI(tokenIdCounter, _uri);

        emit NFTMinted(tokenId, _to, _price, _uri);
    }

    function getUserNFTs(address _of) public view returns (uint256[] memory) {
        return balance[_of];
    }

    function getCurrentTokenId() external view returns(uint256) {
        return tokenIdCounter;
    }

    function getNFtPrice(uint256 _id) external view returns(uint256) {
        return NFTDetailsbyID[_id].price;
    }

    function getUri(uint256 _id) external view returns(string memory) {
        return NFTDetailsbyID[_id].uri;
    }
}