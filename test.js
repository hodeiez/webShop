//few start variables
const currency = "€";
var shopingCartObj = null;
var productsList = null;
var cartItemAmount = -1;
const deliveryCosts=15;
const taxesBase=12;

//created two custom classes, not necessary but it makes the code more readable for me
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

function createProductItem(index, quantity) {
  let productItem = new ProductItem(
    JSON.parse(getLocalData("PRODUCTS_LIST"))[index],
    quantity
  );
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
  buyButton.dataset.title=title;
  modalButton.dataset.title = title;
  modalButton.dataset.description = description;
  modalButton.dataset.image=image;

  return clone;
}

//create HTML for product items in Shopping cart
function itemTemplate(product, quantity) {
  let mytemplate = document.querySelector("#product-item");
  let clone = mytemplate.content.cloneNode(true);
  let titleNode = clone.querySelector("#product-item-title");
  let idNode = clone.querySelector("#product-id");
  let imageNode = clone.querySelector("#product-item-image");
  let quantityNode = clone.querySelector("#product-item-quantity");
  let minusNode = clone.querySelector("#quantity-minus");
  let plusNode = clone.querySelector("#quantity-plus");
  let removeNode = clone.querySelector("#product-item-remove");

  titleNode.innerText = product.title;
  imageNode.src = product.image;
  quantityNode.innerText = quantity;
  quantityNode.id = "quantity-of-" + product.id;
  minusNode.id = "minus-" + product.id;
  plusNode.id = "plus-" + product.id;
  idNode.id = product.id;

  plusNode.dataset.productId = product.id;
  minusNode.dataset.productId = product.id;
  removeNode.dataset.productId = product.id;

  minusNode.setAttribute("onclick", "substractQuantity(this);");
  plusNode.setAttribute("onclick", "sumQuantity(this);");
  removeNode.setAttribute("onclick", "removeItem(this);");

  return clone;
}

//update shoppingCartHtml
function updateShoppingCartItemHTML(productId, newQuantity) {
  $("#quantity-of-" + productId).text(newQuantity);
  updateTotalPrice();
}

//set categories names
function setCategories() {
  //let categories = [];
  fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((json) => {
      json.forEach((item) => {
        let element = document.createElement("li");
        element.className = "nav-item";
        element.innerText = item;
        element.className = "list-group-item";
        document.getElementById("categories").appendChild(element);
      });
    });
}

//On click add item to cart
function addToCart(e) {

  let iconText = document.getElementById("shopping-cart-icon").innerText;

  let productItem = createProductItem(e.value - 1, 1);

  //this updates storage
  if (getItemIndex(productItem.product.id) >= 0) {
    updateItemQuantityByIndex(getItemIndex(productItem.product.id), 1);

    //update the html
  } else {
    addItemToShoppingCart(productItem);

    //this will go to a function update html shopping cart
    document
      .getElementById("shopping-cart")
      .appendChild(itemTemplate(productItem.product, productItem.quantity));

    document.getElementById("shopping-cart-icon").innerText =
      Number(iconText) + 1;
 
  }
}
//change quantity from item



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
function clearShoppingCartData(){
    localStorage.removeItem("SHOPPING_CART_INDEX_COUNT");
    localStorage.removeItem("SHOPPING_CART");
}
//set products: save to local storage, and print in HTML
function setAllProducts() {
  productsList = new Array();

  // let categories = [];
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((json) => {
      json.forEach((product) => {
        let productItem = new Product(
          product.id,
          product.title,
          product.description,
          product.image,
          product.price,
          product.category
        );

        productsList.push(productItem);
        let element = productItem.createCard();
        document.getElementById("products").appendChild(element);
      });

      setLocalData("PRODUCTS_LIST", JSON.stringify(productsList));
    });
}

//check storage for shopping cart object
function shoppingCartInit() {
  if(getLocalData("SHOPPING_CART_INDEX_COUNT")<0){
    clearShoppingCartData()
  }
  shopingCartObj = new Array();
  cartItemAmount = 0;
  if (getLocalData("SHOPPING_CART") != null) {
    cartItemAmount = getLocalData("SHOPPING_CART_INDEX_COUNT");
    shopingCartObj = JSON.parse(getLocalData("SHOPPING_CART"));

    //update html
    document.getElementById("shopping-cart-icon").innerText = cartItemAmount<0?0:cartItemAmount;
    for (productIndex in shopingCartObj) {
      document
        .getElementById("shopping-cart")
        .appendChild(
          itemTemplate(
            shopingCartObj[productIndex].product,
            shopingCartObj[productIndex].quantity
          )
        );
    }
  } else {
    console.log("shopping cart not found in storage");
  }
  updateTotalPrice();
}

//add item to cart storage
function addItemToShoppingCart(productItem) {
  console.log(cartItemAmount);
  shopingCartObj[cartItemAmount++] = productItem;
  setLocalData("SHOPPING_CART", JSON.stringify(shopingCartObj));
  setLocalData("SHOPPING_CART_INDEX_COUNT", cartItemAmount);
  updateTotalPrice();
}

//check if item exists
function getItemIndex(productId) {
  for (index in shopingCartObj) {
    if (shopingCartObj[index].product.id == productId) return index;
  }
  return -1;
}


function updateItemQuantityByIndex(index, amount) {
  console.log("index to: " + index + " amount " + amount);
  shopingCartObj[index].quantity = shopingCartObj[index].quantity + amount;
  setLocalData("SHOPPING_CART", JSON.stringify(shopingCartObj));
  setLocalData("SHOPPING_CART_INDEX_COUNT", cartItemAmount);

  //html update
  updateShoppingCartItemHTML(
    shopingCartObj[index].product.id,
    shopingCartObj[index].quantity
  );
}
function removeItemByIndex(index) {
  console.log("index: " + index);

  let productItem = shopingCartObj[index];
  cartItemAmount--;

  shopingCartObj.splice(index, 1);

  setLocalData("SHOPPING_CART", JSON.stringify(shopingCartObj));
  setLocalData("SHOPPING_CART_INDEX_COUNT", cartItemAmount - 1);

  //UPDATE SHOPPING CART HTML

  $("#" + productItem.product.id).remove();
  document.getElementById("shopping-cart-icon").innerText = cartItemAmount;

  updateTotalPrice();
}

function updateTotalPrice() {
  let totalPrice = 0;
  for (index in shopingCartObj) {
    totalPrice +=
      Number(shopingCartObj[index].quantity) *
      Number(shopingCartObj[index].product.price);
  }
  console.log(totalPrice);
  $("#shopping-cart-total-price").text(totalPrice.toFixed(2) + currency);
}

function substractQuantity(e) {
  const productId = e.dataset.productId;
  const indexOfItem = getItemIndex(productId);
  if (shopingCartObj[indexOfItem].quantity > 1) {
    updateItemQuantityByIndex(indexOfItem, -1);
  }
}
function sumQuantity(e) {
  const productId = e.dataset.productId;
  const indexOfItem = getItemIndex(productId);
  if (shopingCartObj[indexOfItem].quantity < 50) {
    updateItemQuantityByIndex(indexOfItem, 1);
  }
}
function removeItem(e) {
  const productId = e.dataset.productId;
  const indexOfItem = getItemIndex(productId);
  removeItemByIndex(indexOfItem);
}
//Open the modal with info
$("#info-modal").on("show.bs.modal", function (event) {
  var button = $(event.relatedTarget);
  var title = button.data("title");
  var description = button.data("description");
  var image=button.data("image");
  var modal = $(this);
  modal.find(".modal-title").text(title);
  modal.find(".modal-body").text(description);
  modal.find(".modal-image").attr("src",image);
});
$("#added-modal").on("show.bs.modal", function (event) {
  console.log('fired')
  var button = $(event.relatedTarget);
  var title = 'Added to cart';
  var description = button.data("title")+ ' has been added to your Shopping Cart!';
  var modal = $(this);
  modal.find(".modal-title").text(title);
  modal.find(".modal-body").text(description);
});
$('#check-out-button').click(function(){
  if(shopingCartObj.length>0)
     window.location.href='order.html'
    //will add some message  when cart is empty
     
  
})
function orderInit(){
  shopingCartObj = JSON.parse(getLocalData("SHOPPING_CART"));
  fillOrderTable()

}

function fillOrderTable(){
  let basePrice=0;
 shopingCartObj.forEach(element=>{
    basePrice+=(element.product.price * element.quantity)
  })
  let taxesPrice=((basePrice/100)*taxesBase).toFixed(2)
  fillOrderRow()
  $('#taxes-number').text(taxesPrice+currency)
  $('#costs-number').text(deliveryCosts+currency)
  $('#total-price').text(Number(basePrice)+Number(taxesPrice)+Number(deliveryCosts) + currency)



}
function fillOrderRow(){
 
  shopingCartObj.forEach(item=>{
    
let template=$('#product-row').contents().clone();
template.find('#product-title-table').text(item.product.title)
template.find('#product-quantity-table').text(item.quantity)
template.find('#product-price-table').text(item.product.price)
template.find('#product-sum-table').text(Number(item.product.price)*item.quantity)
console.log(template)
$('#order-table-body').prepend(template)
})

}
