
function shoppingInit(){
  shoppingCartInit();
      setAllProducts();
}

/**
 * Function to create ProductItem
 * @param {index of productItem in shopingCartObj} index 
 * @param {quantity of products in product item*} quantity 
 * @returns  returns a productItem object
 */
function createProductItem(index, quantity) {
  let productItem = new ProductItem(
    JSON.parse(getLocalData("PRODUCTS_LIST"))[index],
    quantity
  );
  return productItem;
}
/**
 * gets products from database, stores them in local storage and "prints" them.
 * http://webacademy.se/fakestore/
 * ../backupData/backup2.json
 */
 function setAllProducts() {
  productsList = new Array();
  fetch('https://webacademy.se/fakestore/')
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
/**
 * creates a product html element and its contents by cloning a template
 */
function renderCard(id, title, description, image, price) {
  let mytemplate = document.querySelector("#myTemplate"),
   clone = mytemplate.content.cloneNode(true),
   titleNode = clone.querySelector("#title-node"),
 descriptionNode = clone.querySelector("#description-node"),
   imageNode = clone.querySelector("#image-node"),
   priceNode = clone.querySelector("#price-node"),
   buyButton = clone.querySelector("#buy-node"),
 modalButton = clone.querySelector("#modal-button")

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

/**
 * creates a product item html element and its contents by cloning a template
 */
function renderItem(product, quantity) {
  let mytemplate = document.querySelector("#product-item"),
   clone = mytemplate.content.cloneNode(true),
   titleNode = clone.querySelector("#product-item-title"),
   idNode = clone.querySelector("#product-id"),
   imageNode = clone.querySelector("#product-item-image"),
   quantityNode = clone.querySelector("#product-item-quantity"),
   minusNode = clone.querySelector("#quantity-minus"),
   plusNode = clone.querySelector("#quantity-plus"),
   removeNode = clone.querySelector("#product-item-remove")

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


/**
 * 
 * event listener for "buy" button, adds a product to shopping cart
 */
function addToCart(e) {

  let iconText = document.getElementById("shopping-cart-icon").innerText;
  let productItem = createProductItem(e.value - 1, 1);

 
  if (getItemIndex(productItem.product.id) >= 0) {
    updateItemQuantityByIndex(getItemIndex(productItem.product.id), 1);
  } else {
    addItemToShoppingCart(productItem);
    document
      .getElementById("shopping-cart")
      .appendChild(renderItem(productItem.product, productItem.quantity));
    document.getElementById("shopping-cart-icon").innerText =
      Number(iconText) + 1;
 
  }
}


/**
 * updates the shopping cart from the local storage
 */
function shoppingCartInit() {
  if(getLocalData("SHOPPING_CART_INDEX_COUNT")<0){
    clearShoppingCartData()
  }

  shopingCartObj = new Array();
  cartItemAmount = 0;
  if (getLocalData("SHOPPING_CART") != null) {
    cartItemAmount = getLocalData("SHOPPING_CART_INDEX_COUNT");
    shopingCartObj = JSON.parse(getLocalData("SHOPPING_CART"));

    document.getElementById("shopping-cart-icon").innerText = cartItemAmount<0?0:cartItemAmount;
    for (productIndex in shopingCartObj) {
      document
        .getElementById("shopping-cart")
        .appendChild(
          renderItem(
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

/**
 *   adds item to shoping cart and updates the total price
 */
function addItemToShoppingCart(productItem) {
  shopingCartObj[cartItemAmount++] = productItem;
  setLocalData("SHOPPING_CART", JSON.stringify(shopingCartObj));
  setLocalData("SHOPPING_CART_INDEX_COUNT", cartItemAmount);
  updateTotalPrice();
}

/**
 * 
 * returns the index of a product item in local storage shopping cart array
 */
function getItemIndex(productId) {
  for (index in shopingCartObj) {
    if (shopingCartObj[index].product.id == productId) return index;
  }
  return -1;
}

/**
 * updates quantity of a product item by given index and quantity (amount)
 */
function updateItemQuantityByIndex(index, amount) {
  console.log("index to: " + index + " amount " + amount);
  shopingCartObj[index].quantity = shopingCartObj[index].quantity + amount;
  setLocalData("SHOPPING_CART", JSON.stringify(shopingCartObj));
  setLocalData("SHOPPING_CART_INDEX_COUNT", cartItemAmount);

  updateShoppingCartItemQuantity(
    shopingCartObj[index].product.id,
    shopingCartObj[index].quantity
  );
}

/**
 * updates the quantity element of a product item
 */
 function updateShoppingCartItemQuantity(productId, newQuantity) {
  $("#quantity-of-" + productId).text(newQuantity);
  updateTotalPrice();
}

/**
 *  removes an item from shopping cart
 */
function removeItemByIndex(index) {
  
  let productItem = shopingCartObj[index];
  cartItemAmount--;
  shopingCartObj.splice(index, 1);

  setLocalData("SHOPPING_CART", JSON.stringify(shopingCartObj));
  setLocalData("SHOPPING_CART_INDEX_COUNT", cartItemAmount - 1);

  $("#" + productItem.product.id).remove();
  document.getElementById("shopping-cart-icon").innerText = cartItemAmount;

  updateTotalPrice();
}
/**
 * updates the total price HTML element, calculating from local storage
 */
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
/**
 * event listener to substract quantity of an item
 */
function substractQuantity(e) {
  const productId = e.dataset.productId;
  const indexOfItem = getItemIndex(productId);
  if (shopingCartObj[indexOfItem].quantity > 1) {
    updateItemQuantityByIndex(indexOfItem, -1);
  }
}
/**
 * event listener to add quantity of an item
 */
function sumQuantity(e) {
  const productId = e.dataset.productId;
  const indexOfItem = getItemIndex(productId);
  if (shopingCartObj[indexOfItem].quantity < 50) {
    updateItemQuantityByIndex(indexOfItem, 1);
  }
}
/**
 * event listener to remove item
 */
function removeItem(e) {
  const productId = e.dataset.productId;
  const indexOfItem = getItemIndex(productId);
  removeItemByIndex(indexOfItem);
}

/**
 * listens to "info" button and retrieves a modal with info
 */
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

/**
 * listens to buy button and retrieves a modal
 */

$("#added-modal").on("show.bs.modal", function (event) {

  var button = $(event.relatedTarget);
  var title = 'Added to cart';
  var description = button.data("title")+ ' has been added to your Shopping Cart!';
  var modal = $(this);
  modal.find(".modal-title").text(title);
  modal.find(".modal-body").text(description);
});

/**
 * listens to "check out" button and redirects to order.html 
 */
$('#check-out-button').click(function(){
  if(shopingCartObj.length>0)
     window.location.href='order.html'
    //TODO:add some message when cart is empty
     
  
})



