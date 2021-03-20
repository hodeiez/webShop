/**
 * gets data from localstorage, fills up the table wiht the data and initiates forma validation
 */
 function orderInit(){
  
    shopingCartObj = JSON.parse(getLocalData("SHOPPING_CART"));
    fillOrderTable()
    formValidation()
  }
  /**
   * fill up table with data and calculates the price from shopingCartObj (a copy of local storage SHOPPING CART)
   */
  function fillOrderTable(){
    let basePrice=0;
   shopingCartObj.forEach(element=>{
      basePrice+=(element.product.price * element.quantity)
    })
    let taxesPrice=((basePrice/100)*taxesBase).toFixed(2)
    fillOrderRow()
    $('#taxes-number').text(taxesPrice+currency)
    $('#costs-number').text(deliveryCosts+currency)
    $('#total-price').text((Number(basePrice)+Number(taxesPrice)+Number(deliveryCosts)).toFixed(2) + currency)
  
  
  
  }
  /**
   * Fills up the rows with the title,quantity, price and sum price of a product
   */
  function fillOrderRow(){
   
    shopingCartObj.forEach(item=>{
      
  let template=$('#product-row').contents().clone();
  template.find('#product-title-table').text(item.product.title)
  template.find('#product-quantity-table').text(item.quantity)
  template.find('#product-price-table').text(item.product.price)
  template.find('#product-sum-table').text(Number(item.product.price)*item.quantity)
  $('#order-table-body').prepend(template)
  })
  
  }
  /**
   * validates the form using Jquery.validate() plugin
   */
  function formValidation(){
    let $nameField = $("#name-form"),
    $surnameField = $("#surname-form"),
    $emailField = $("#email-form"),
    $phoneField = $("#phone-form"),
    $addressField = $("#address-form"),
    $cityField = $("#city-form"),
    $zipField = $("#zip-form"),
    $submit = $("#submit");
    let messages=(name,charNumber)=>'Fill up your '+name+', at least '+charNumber+' characters'
  let requiredMes=(name)=>name+' is required'
  $('#confirmation-form').validate({
  submitHandler:()=> {$('#dialog').modal(),
  $('#submit').attr('disabled',true),
    clearShoppingCartData()},
  
  rules:{
  
    name:{
      required:true, minlength:2
    },
    surname:{
      required:true, minlength:2
    },
    address:{
      required:true,minlength:3
    },
    city:{
      required:true
    },
    email:{
      required:true,
      email:true
    },
    phone:{
      required:true,
      number:true,
      minlength:9
    },
    zip:{
      required:true,
      minlength:5
    }
  
  },
  messages:{
  name:{
      minlength: messages($nameField.attr('name'), '2')
    },
    surname:{
     minlength: messages($surnameField.attr('name'),'2')
    },
    address:{
      minlength: messages($addressField.attr('name'), '3')
    },
    city:{
      required:requiredMes($cityField.attr('name'))
    },
    email:{
     
      email:requiredMes($emailField.attr('name'))+ ' and has to have this format: name@domain.com'
    },
    phone:{
      
      minlength:messages($phoneField.attr('name'),'9')
    },
    zip:{
     
      minlength:messages($zipField.attr('name'),'5')
    }
  }
  
  
  })
  }