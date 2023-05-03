// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CarSales {
    struct Car {
        address owner;
        string model;
        uint256 price;
        uint256 index;
    }

    mapping(uint256 => Car) public cars;
    uint256 public carIndex;

    event CarAdded(uint256 indexed id, address indexed owner,string model, uint256 price);
    event CarSold(uint256 indexed id, address indexed seller, address indexed buyer, uint256 price);

    function addCar( string memory _model, uint256 _price) public {
        cars[carIndex] = Car(msg.sender, _model, _price, carIndex);
        emit CarAdded(carIndex, msg.sender, _model, _price);
        carIndex++;
    }

    function sellCar(uint256 _id, address _buyer) public payable {
        require(cars[_id].owner == msg.sender, "Only car owner can sell the car.");
        require(msg.value == cars[_id].price, "Sent value does not match car price.");

        address payable carOwner = payable(cars[_id].owner);
        carOwner.transfer(msg.value);
        cars[_id].owner = _buyer;
        // cars[_id].sold = true;

        emit CarSold(_id, msg.sender, _buyer, msg.value);
    }

}