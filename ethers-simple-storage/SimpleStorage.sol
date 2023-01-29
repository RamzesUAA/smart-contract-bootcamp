// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SimpleStorage {
    uint256 public favoriteNumber;

    mapping(string => int256) public nameToFavoriteNumber;

    struct People {
        int favNum;
        string name;
    }

    People[] public people;

    function store(uint256 _favNum) public virtual {
        favoriteNumber = _favNum;
    }

    function retrive() public view returns (uint256) {
        return favoriteNumber;
    }

    function add() private pure returns (uint256) {
        return 1 + 1;
    }

    function addPerson(int256 favNum, string memory name) public {
        people.push(People(favNum, name));
        nameToFavoriteNumber[name] = favNum;
    }
}
