//product class
class Product {
  constructor(id, title, description, image, price) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.price = price;
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
function cardTemplate(id, title, description, image, price) {
  let mytemplate = document.querySelector("#myTemplate");
  let clone = mytemplate.content.cloneNode(true);
  let titleNode = clone.querySelector("#title-node");
  let descriptionNode = clone.querySelector("#description-node");
  let imageNode = clone.querySelector("#image-node");
  let priceNode = clone.querySelector("#price-node");
  let buyButton = clone.querySelector("#buy-node");

  titleNode.innerText = title;
  descriptionNode.innerText = description.substr(0,150)+"...";
  imageNode.src = image;
  priceNode.innerText = price;
  buyButton.value = id;
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
          json[i].price
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
  alert(e.value);
}
