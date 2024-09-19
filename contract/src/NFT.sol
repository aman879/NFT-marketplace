    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.4;

    import "@openzeppelin/contracts/utils/Counters.sol";
    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
    import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

    contract NFT is ERC721URIStorage {
        address owner;
        uint256 tokenIdCounter;

        mapping(address => uint256[]) private balance;

        modifier onlyOwner {
            require(msg.sender == owner, "You are not onwer");
            _;
        }

        constructor() ERC721("Flower Token", "FTN") {
            owner = msg.sender;
        }

        function mint(address _to, string memory _uri) external returns (uint256){
            tokenIdCounter++;
            uint256 tokenId = tokenIdCounter;

            _mint(_to, tokenIdCounter);
            _setTokenURI(tokenIdCounter, _uri);

            balance[msg.sender].push(tokenId);

            return tokenId;
        }

        function getUserNFTs() public view returns (uint256[] memory) {
            return balance[msg.sender];
        }

        function getCurrentTokenId() external view returns(uint256) {
            return tokenIdCounter;
        }
    }