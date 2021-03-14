const currency= "€";
var shoppingCartObj=null;
var cartItemAmount=-1;
//product class 
class Product {
  constructor(id, title, description, image, price,category) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.price = price;
    this.category=category;
  }
  createCard() {
    return cardTemplate(
      this.id,
      this.title,
      this.description,
      this.image,
      this.price
    );
  }
}

class ProductItem{
  constructor(product,quantity){
    this.product=product;
    this.quantity=quantity;
  }
  getProductId(){
    return product.id;
  }
  setProductQ(quantity){
    this.quantity=quantity;
  }
  createProductItemCard(){
    return itemTemplate(
      this.product, this.quantity
      );
  }
}
//create HTML for product cards
function cardTemplate(id, title, description, image, price) {
  let mytemplate = document.querySelector("#myTemplate");
  let clone = mytemplate.content.cloneNode(true);
  let titleNode = clone.querySelector("#title-node");
  let descriptionNode = clone.querySelector("#description-node");
  let imageNode = clone.querySelector("#image-node");
  let priceNode = clone.querySelector("#price-node");
  let buyButton = clone.querySelector("#buy-node");
  let modalButton = clone.querySelector("#modal-button");

  titleNode.innerText = title;
  descriptionNode.innerText = description.substr(0,150)+"...";
  imageNode.src = image;
  priceNode.innerText = price+currency;
  buyButton.value = id;
  modalButton.dataset.title = title;
  modalButton.dataset.description=description;

  return clone;
}

//create HTML for product items in Shopping cart
function itemTemplate(product,quantity) {
  let mytemplate = document.querySelector("#product-item");
  let clone = mytemplate.content.cloneNode(true);
  let titleNode = clone.querySelector("#product-item-title");
 // let idNode= clone.querySelector('#product-id');
  let imageNode = clone.querySelector("#product-item-image");
  let quantityNode = clone.querySelector("#product-item-quantity");

  titleNode.innerText = product.title;
  imageNode.src = product.image;
  quantityNode.value = quantity;
  //idNode.data=product.id;
  return clone;
}

function setCategories() {
  //let categories = [];
  fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((json) => {
      for (let i = 0; i < json.length; i++) {
        //   categories.push(json[i]);
        let element = document.createElement("li");
        element.className = "nav-item";
        element.innerText = json[i];
        element.className = "list-group-item";
        document.getElementById("categories").appendChild(element);
      }
    });
}

function setAllProducts() {
  // let categories = [];
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((json) => {
      for (let i = 0; i < json.length; i++) {
        let productItem = new Product(
          json[i].id,
          json[i].title,
          json[i].description,
          json[i].image,
          json[i].price,
          json[i].category
        );
        let element = productItem.createCard();
        document.getElementById("products").appendChild(element);
      }
    });

  //get all products
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((json) => console.log(json));
}
function addToCart(e) {
  //test to show it gets the id
  let iconText=document.getElementById("shopping-cart-icon").innerText;
  let counter=Number(iconText) + 1;
  document.getElementById("shopping-cart-icon").innerText=counter;
  alert("Added to shopping cart "+ e.value);

let selectedId=e.value;

  fetch('https://fakestoreapi.com/products/'+selectedId)
            .then(res=>res.json())
            .then(json=>{
              
              let productItem=new ProductItem(new Product(json.id,json.title,json.description,json.image,json.price,json.category),1); 
             
             //this will go to a function update html shopping cart
              document.getElementById("shopping-cart").appendChild(productItem.createProductItemCard());
             //this updates storage
              addItemToShoppingCart(productItem);
              });


}

$('#myModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget)
  var title = button.data('title')
  var description = button.data('description')
  var modal = $(this)
  modal.find('.modal-title').text(title)
  modal.find('.modal-body').text(description)
})

//working with storage
//setting storage local data getter and setter
function getLocalData(name){
  return localStorage.getItem(name)
}
function setLocalData(name,value){
  return (value!=null)?localStorage.setItem(name,value):localStorage.removeItem(name)
}
//check storage for shopping cart object
function shoppingCartInit(){
shoppingCartObj=new Array();
cartItemAmount=0
if(getLocalData('SHOPPING_CART')!=null){
  cartItemAmount=getLocalData('SHOPPING_CART_AMOUNT');
  shoppingCartObj=JSON.parse(getLocalData('SHOPPING_CART'));
}
else{
  console.log('shopping cart not found in storage')
}
}

//add item to cart storage
function addItemToShoppingCart(productItem){
  let updateItem=false;
  //if item exists add quantity
  for(index in shoppingCartObj){
    if(shoppingCartObj[index].getProductId==productItem.getProductId){
      shoppingCartObj[index].setProductQ(shoppingCartObj[index].quantity+1);
      updateItem=true;
    }
    else{
updateItem=false;
    }
  }

  if(updateItem==true){
    setLocalData('SHOPPING_CART',JSON.stringify(shoppingCartObj));
    setLocalData('SHOPPING_CART_AMOUNT',cartItemAmount);
  }
  else{
    shoppingCartObj[cartItemAmount++]=productItem
      setLocalData('SHOPPING_CART',JSON.stringify(shoppingCartObj));
      setLocalData('SHOPPING_CART_AMOUNT',cartItemAmount);
    
  }


}
