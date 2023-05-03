const CarSales = artifacts.require('CarSales.sol')

module.exports = function (deployer) {
    deployer.deploy(CarSales)
}