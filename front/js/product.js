//récupération de l'ID de l'article depuis l'URL
let id = location.search.substring(1);
//vérification qu'un ID est reçu puis appel à l'API permettant de récupérer un article précis avec l'ID
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
                //remplissage des champs de la page avec les données reçues.
                title.textContent = item.name
                price.textContent = item.price
                main_title.textContent = item.name
                description.textContent = item.description
                //boucle pour afficher toutes les couleurs disponibles dans les options du select
                for (let i=0; i < item.colors.length; i++){
                    const option = document.createElement("option")
                    option.textContent = item.colors[i]
                    option.value = item.colors[i]
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

/**
 * fonction qui se déclenche au clic sur le bouton ajouter au panier.
 * cette fonction récupére les informations de la page pour les ajouter au localstorage cart (panier)
 * vérification que les champs couleur et quantité sont biens renseignés.
 */
function addToCart(){
    const quantity = document.getElementById("quantity")
    const color = document.getElementById("colors")
    const name = document.getElementById("title")
    const description = document.getElementById("description")

    if (color.value === "") {
        alert("Merci de sélectionner une couleur")
    } else{
        if (quantity.value === "0"){
            alert("Merci de sélectionner une quantité")
        } else{
            const new_item = [{
                "name": name.textContent,
                "description": description.textContent,
                "color": color.value,
                "quantity": quantity.value
            }]

            if (localStorage.getItem("cart") !== null){
                const old_cart = JSON.parse(localStorage.getItem("cart"))
                old_cart.push(new_item)
                localStorage.removeItem("cart")
                localStorage.setItem("cart", JSON.stringify(old_cart))
            } else {
                localStorage.setItem("cart", JSON.stringify(new_item))
            }
        }
    }

    console.log(JSON.parse(localStorage.getItem("cart")))
}
