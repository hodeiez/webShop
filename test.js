function setCategories(){
    let categories = [];
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((json) => {
        for (let i = 0; i < json.length; i++) {
          categories.push(json[i]);
          let element=document.createElement('li');
          element.className="nav-item";
          element.innerText=json[i];
          element.className="list-group-item";
         document.getElementById("categories").appendChild(element);
          
        }
      });
      
}

function setAllProducts(){
    let categories = [];
    fetch('https://fakestoreapi.com/products')
            .then(res=>res.json())
            .then(json=>{
                for (let i = 0; i < json.length; i++) {
                  categories.push(json[i]);
                  let element=document.createElement('div');

                  element.innerHTML ='<div class="card" style="width: 18rem;"><img src="'
                  +json[i].image+'" class="card-img-top" alt="..." height="250rem"><div class="card-body"><h5 class="card-title">'
                  +json[i].title+'</h5><p class="card-text">'
                  +json[i].description+'</p><div class="row"><a onClick="addToCart('
                  +json[i].id+');" href="#" class="btn btn-dark col">buy</a><div class="col"><h4>'
                  +json[i].price+'$</h4></div></div></div></div></div>';
           
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
