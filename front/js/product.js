let id = location.search.substring(1);

if (id !== "" && id !== undefined){
    fetch("http://localhost:3000/api/products/"+id).then(function(response) {
        response.text().then(function(text) {
            if (response.status === 200){

                const item = JSON.parse(text)
                const title = document.getElementById("title")
                const main_title = document.getElementById("main_title")
                const price = document.getElementById("price")
                const description = document.getElementById("description")
                const color_select = document.getElementById("colors")

                title.textContent = item.name
                price.textContent = item.price
                main_title.textContent = item.name
                description.textContent = item.description

                for (let i=0; i < item.colors.length; i++){
                    const option = document.createElement("option")
                    option.textContent = item.colors[i]
                    color_select.append(option)
                }
            }
        });
    });
}


const add_cart = document.getElementById("addToCart")

add_cart.addEventListener("click", () => {
   addToCart()

})

function addToCart(){
    const quantity = document.getElementById("quantity")
    const color = document.getElementById("colors")
    const name = document.getElementById("title")
    const description = document.getElementById("description")

    localStorage.setItem("cart", JSON.stringify({
        "name": name.textContent,
        "description": description.textContent,
        "color": color.value,
        "quantity": quantity.value
    }))
    console.log(JSON.parse(localStorage.getItem("cart")))
}
