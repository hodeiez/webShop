class Product {
  constructor(id, title, description, image, price) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.image = image;
    this.price = price;
  }
  createCard (){
    return cardTemplate(this.id,this.title,this.description,this.image,this.price);
  }
}
function cardTemplate(id,title,description,image,price){
  
return '<div class="card" style="width: 18rem;">'+
  '<img src="'+image+'" class="card-img-top" alt="'+description+'" height="250rem">'+
    '<div class="card-body">'+
      '<h5 class="card-title">'+title+'</h5>'+
      '<p class="card-text">'+description+'</p>'+
      '<div class="row">'+
        '<a onClick="addToCart('+id+');" href="#" class="btn btn-dark col">buy</a>'+
        '<div class="col">'+
          '<h4>'+price+'$</h4>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</div>' ;}


function setCategories(){
    //let categories = [];
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((json) => {
        for (let i = 0; i < json.length; i++) {
       //   categories.push(json[i]);
          let element=document.createElement('li');
          element.className="nav-item";
          element.innerText=json[i];
          element.className="list-group-item";
         document.getElementById("categories").appendChild(element);
          
        }
      });
      
}

function setAllProducts(){
   // let categories = [];
    fetch('https://fakestoreapi.com/products')
            .then(res=>res.json())
            .then(json=>{
                for (let i = 0; i < json.length; i++) {
                //  categories.push(json[i]);
                  let element=document.createElement('div');
                  let productItem=new Product(json[i].id, json[i].title, json[i].description, json[i].image, json[i].price)
                  
                  //element.innerHTML=cardTemplate(productItem.id,productItem.title,productItem.description,productItem.image,productItem.price);

                  element.innerHTML=productItem.createCard();
                 
           
                  element.className=" card-body";
                 document.getElementById("products").appendChild(element);
                  
                }
              });

              //get all products
              fetch('https://fakestoreapi.com/products')
            .then(res=>res.json())
            .then(json=>console.log(json));
}
function addToCart(string){
    alert(string);
}
