const currency = "€";
var shoppingCartObj = null;
var productsList=null;
var cartItemAmount = -1;
//product class
class Product {
  constructor(id, title, description, image, price, category) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.price = price;
    this.category = category;
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

class ProductItem {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }

}

function createProductItem(index,quantity){
    let productItem=new ProductItem(JSON.parse(getLocalData('PRODUCTS_LIST'))[index],quantity)
    return productItem;
}
//VISUAL
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
  descriptionNode.innerText = description.substr(0, 150) + "...";
  imageNode.src = image;
  priceNode.innerText = price + currency;
  buyButton.value = id;
  modalButton.dataset.title = title;
  modalButton.dataset.description = description;

  return clone;
}

//create HTML for product items in Shopping cart
function itemTemplate(product, quantity) {
  let mytemplate = document.querySelector("#product-item");
  let clone = mytemplate.content.cloneNode(true);
  let titleNode = clone.querySelector("#product-item-title");
  let idNode= clone.querySelector('#product-id');
  let imageNode = clone.querySelector("#product-item-image");
  let quantityNode = clone.querySelector("#product-item-quantity");
 let minusNode=clone.querySelector("#quantity-minus");
 let plusNode=clone.querySelector("#quantity-plus");
 let removeNode = clone.querySelector("#product-item-remove");

  titleNode.innerText = product.title;
  imageNode.src = product.image;
  quantityNode.innerText=quantity;
  quantityNode.id = "quantity-of-"+product.id;
  minusNode.id = "minus-"+product.id;
  plusNode.id = "plus-"+product.id;
  idNode.id=product.id;
  minusNode.value=product.id;
  plusNode.value=product.id;
  removeNode.dataset.productId=product.id;
  return clone;
}


//update shoppingCartHtml
function updateShoppingCartItemHTML(productId,newQuantity){
  $( "#quantity-of-"+productId ).text(newQuantity);
  updateTotalPrice();

}

//set categories names
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

//On click add item to cart
function addToCart(e) {
  //test to show it gets the id
  let iconText = document.getElementById("shopping-cart-icon").innerText;
  
  alert("Added to shopping cart " + e.value);
//end test

       let productItem=createProductItem(e.value-1,1);

      //this updates storage
      if(getItemIndex(productItem.product.id)>=0){
      updateItemQuantityByIndex(getItemIndex(productItem.product.id),1);
      
    //update the html
    }
      else{
      addItemToShoppingCart(productItem);

//this will go to a function update html shopping cart
      document
      .getElementById("shopping-cart")
      .appendChild(itemTemplate(productItem.product,productItem.quantity));

      document.getElementById("shopping-cart-icon").innerText = Number(iconText) + 1;
      productItemFunctionality(); 
    }
  
}
//change quantity from item

//Open the modal with info
$("#myModal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget);
  var title = button.data("title");
  var description = button.data("description");
  var modal = $(this);
  modal.find(".modal-title").text(title);
  modal.find(".modal-body").text(description);
});

//working with storage
//setting storage local data getter and setter
function getLocalData(name) {
  return localStorage.getItem(name);
}
function setLocalData(name, value) {
  return value != null
    ? localStorage.setItem(name, value)
    : localStorage.removeItem(name);
}
//set products: save to local storage, and print in HTML
function setAllProducts() {
  productsList=new Array();
  
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
  
          productsList.push(productItem);
          let element = productItem.createCard();
  
  
          document.getElementById("products").appendChild(element);
        }
        setLocalData("PRODUCTS_LIST", JSON.stringify(productsList));
      });
  
  }


//check storage for shopping cart object
function shoppingCartInit() {
  shoppingCartObj = new Array();
  cartItemAmount = 0;
  if (getLocalData("SHOPPING_CART") != null) {
    cartItemAmount = getLocalData("SHOPPING_CART_INDEX_COUNT");
    shoppingCartObj = JSON.parse(getLocalData("SHOPPING_CART"));

//update html
document.getElementById("shopping-cart-icon").innerText = cartItemAmount;
for(productIndex in shoppingCartObj){
      document
      .getElementById("shopping-cart")
      .appendChild(itemTemplate(shoppingCartObj[productIndex].product,shoppingCartObj[productIndex].quantity));
}

  } else {
    console.log("shopping cart not found in storage");
  }
  updateTotalPrice();
}

//add item to cart storage
function addItemToShoppingCart(productItem) {

    shoppingCartObj[cartItemAmount++] = productItem;
    setLocalData("SHOPPING_CART", JSON.stringify(shoppingCartObj));
    setLocalData("SHOPPING_CART_INDEX_COUNT", cartItemAmount);

}
//check if item exists
function getItemIndex(productId) {
  for (index in shoppingCartObj) {
    if (shoppingCartObj[index].product.id == productId)
      return index;
  }
  return -1;
}
function updateItemQuantityByIndex(index,amount) {
  shoppingCartObj[index].quantity = shoppingCartObj[index].quantity + amount;
  setLocalData("SHOPPING_CART", JSON.stringify(shoppingCartObj));
  setLocalData("SHOPPING_CART_INDEX_COUNT", cartItemAmount);

  //html update
  updateShoppingCartItemHTML(shoppingCartObj[index].product.id,shoppingCartObj[index].quantity);
 
}
function removeItemByIndex(index){
  let productItem=shoppingCartObj[index];
  cartItemAmount--;
  shoppingCartObj.splice( $.inArray(productItem, shoppingCartObj), 1 );
  setLocalData("SHOPPING_CART", JSON.stringify(shoppingCartObj));
  setLocalData("SHOPPING_CART_INDEX_COUNT", cartItemAmount);


  //UPDATE SHOPPING CART HTML
  
  $('#'+productItem.product.id).remove();
  document.getElementById("shopping-cart-icon").innerText = cartItemAmount;
for(productIndex in shoppingCartObj){
      document
      .getElementById("shopping-cart")
      .appendChild(itemTemplate(shoppingCartObj[productIndex].product,shoppingCartObj[productIndex].quantity));
}
updateTotalPrice();

}
function updateTotalPrice(){
  let totalPrice=0;
  for(index in shoppingCartObj){
totalPrice+=Number(shoppingCartObj[index].quantity)*Number(shoppingCartObj[index].product.price)

  }
  console.log(totalPrice)
  $('#shopping-cart-total-price').text(totalPrice.toFixed(2)+currency);
}


function productItemFunctionality(){
//change quantity of item using plus-minus buttons
$(document).ready(function(){
$('.quantity-minus').on('click',function(){
  let target=$('#quantity-of-'+$(this).val())
  if(target.text()>1){ 

//update
updateItemQuantityByIndex(getItemIndex($(this).val()),-1)

}
else{
  console.log("can't go to 0, user has to remove!")
}
})
$('.quantity-plus').on('click',function(){
  let target=$('#quantity-of-'+$(this).val())
  if(target.text()<50){ 

//update quantity and then totalprice
updateItemQuantityByIndex(getItemIndex($(this).val()),1)

}
else{
  alert("you can't buy more than 50 items!")
}
})
$('.remove-product-item').on('click', function(){
  let target=$(this).attr('data-product-id')
  removeItemByIndex(getItemIndex(target));
  console.log(target);
})
})
}