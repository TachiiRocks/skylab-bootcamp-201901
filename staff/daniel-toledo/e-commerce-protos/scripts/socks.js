//var socks = new Socks('Calvin Klein', 42, 'black', 9.99);

function Socks(brand,size,color,price){
    Underwear.call(this,brand,size,color,price)
}

Socks.prototype=Object.create(Underwear.prototype)
Socks.prototype.constructor= Socks