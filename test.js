const currency= "€";
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

  let imageNode = clone.querySelector("#product-item-image");

  let quantityNode = clone.querySelector("#product-item-quantity");

  titleNode.innerText = product.title;

  imageNode.src = product.image;

  quantityNode.value = quantity;
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
              document.getElementById("shopping-cart").appendChild(productItem.createProductItemCard());
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
