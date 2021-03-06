//récupération de l'ID de l'article depuis l'URL
let id = location.search.substring(1);

//vérification qu'un ID est reçu puis appel à l'API permettant de récupérer un article précis avec l'ID
if (id !== "" && id !== undefined) {
    fetch("http://localhost:3000/api/products/" + id).then(function (response) {
        response.text().then(function (text) {
            if (response.status === 200) {

                const item = JSON.parse(text)
                const title = document.getElementById("title")
                const main_title = document.getElementById("main_title")
                const price = document.getElementById("price")
                const description = document.getElementById("description")
                const color_select = document.getElementById("colors")
                const item__img = document.getElementsByClassName("item__img")[0]
                const img = document.createElement("img")
                //remplissage des champs de la page avec les données reçues.
                title.textContent = item.name
                price.textContent = item.price
                main_title.textContent = item.name
                description.textContent = item.description
                img.src = item.imageUrl
                img.alt = item.altTxt
                item__img.append(img)
                //boucle pour afficher toutes les couleurs disponibles dans les options du select
                for (let i = 0; i < item.colors.length; i++) {
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
// captation de l'événement clic sur le bouton d'ajout au panier.
add_cart.addEventListener("click", () => {
    addToCart()

})

/**
 *
 * fonction qui se déclenche au clic sur le bouton ajouter au panier.
 * cette fonction récupère les informations de la page pour les ajouter au localstorage cart (panier)
 * -vérification que les champs couleur et quantité sont bien renseignés.
 * -vérification si l'article est déjà dans le panier :
 * --si oui : vérification si la couleur est identique. Si oui ajout à l'article existant.
 * --Si non : ajout de l'article dans le panier.
 *
 */
function addToCart() {
    const quantity = document.getElementById("quantity")
    const color = document.getElementById("colors")
    const name = document.getElementById("title")
    const description = document.getElementById("description")
    let in_cart = false

    //contrôle des champs vides
    if (color.value === "") {
        alert("Merci de sélectionner une couleur.")
    } else {
        if (quantity.value === "0" || quantity.value < 0 || isNaN(parseInt(quantity.value))) {
            alert("Merci de sélectionner une quantité valide.")
        } else {
            //contrôle que la quantité ne soit pas supérieure à 100
            if (quantity.value > 100) {
                alert("La quantité maximale par article est de 100.")
            }
            //récupération de l'article sélectionné
            //ternaire pour assigner une valeur de 100 en cas de dépassement de quantité.
            const new_item = [{
                "name": name.textContent,
                "description": description.textContent,
                "color": color.value,
                "quantity": (parseInt(quantity.value) > 100) ? 100 : parseInt(quantity.value),
                "id": id,
            }]
            //vérification si un panier existe déjà
            if (localStorage.getItem("cart") !== null) {
                const old_cart = JSON.parse(localStorage.getItem("cart"))
                //boucle sur le panier existant pour détécter les articles similaires
                old_cart.forEach(item => {
                    if (item.name === new_item[0].name) {
                        if (item.color === new_item[0].color) {
                            //si l'article sélectionné est déjà dans le panier avec la meme couleur, on additionne les
                            //quantités
                            //un contrôle est effectué pour limiter la quantité par article à 100
                            if ((item.quantity + new_item[0].quantity) > 100) {
                                alert("La quantité maximale par article est de 100")
                                item.quantity = 100
                                quantity.value = 100
                            } else {
                                item.quantity = item.quantity + new_item[0].quantity
                            }
                            //suppression et recréation du localstorage avec les nouvelles valeurs
                            localStorage.removeItem("cart")
                            localStorage.setItem("cart", JSON.stringify(old_cart))
                            //indication qu'un article similaire a été trouvé
                            in_cart = true
                        }
                    }
                })
                //si l'article sélectionné n'est pas déjà dans le panier, on l'ajoute.
                if (!in_cart) {
                    const cart = old_cart.concat(new_item)
                    //suppression et recréation du localstorage avec les nouvelles valeurs
                    localStorage.removeItem("cart")
                    localStorage.setItem("cart", JSON.stringify(cart))
                }
            } else {
                //Si le panier n'existe pas encore. Création du localstorage avec la valeur saisie.
                localStorage.setItem("cart", JSON.stringify(new_item))
            }
            const choose = confirm("Article ajouté ! , souhaitez-vous aller au panier ? ")
            if (choose) {
                document.location.href = ("./cart.html")
            }
        }
    }
}
