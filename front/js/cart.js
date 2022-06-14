/**
 * fonction qui récupère les données du localstorage cart (panier)
 * pour chaque article, l'API est réinterrogée pour récupérer l'image et le prix.
 * pour chaque article, le total prix et quantité est calculé
 */
async function getCart() {
    //contrôle si un panier est déjà existant
    if (localStorage.getItem("cart") !== null) {

        const section = document.getElementById("cart__items")
        const cart = JSON.parse(localStorage.getItem("cart"))
        //boucle sur les éléments du panier.
        await cart.forEach(item => {
            //appel à l'API pour récupérer les images et les prix.
            fetch("http://localhost:3000/api/products/" + item.id).then(function (response) {
                response.text().then(function (text) {
                    if (response.status === 200) {
                        const result = JSON.parse(text)
                        const article = document.createElement("article")

                        article.className = "cart__item"
                        article.dataset.id = item.id
                        article.dataset.color = item.color
                        section.append(article)

                        article.innerHTML = `
                        <div class="cart__item__img">\n
                          <img src=${result.imageUrl} alt=${result.altTxt}>\n
                        </div>\n
                        <div class="cart__item__content">\n
                          <div class="cart__item__content__description">\n
                            <h2>${item.name}</h2>\n
                            <p>${item.color}</p>\n
                            <p>${result.price} €</p>\n
                          </div>\n
                          <div class="cart__item__content__settings">\n
                            <div class="cart__item__content__settings__quantity">\n
                              <p>Qté : </p>\n
                              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${item.quantity}>\n
                            </div>\n
                            <div class="cart__item__content__settings__delete">\n
                              <p class="deleteItem">Supprimer</p>\n
                            </div>\n
                          </div>\n
                        </div>\n`
                    }
                    const delete_button = document.getElementsByClassName('deleteItem')
                    const quantity_selector = document.querySelectorAll('.itemQuantity')
                    const delete_item = () => {
                        const button = this.event.target
                        //on remonte jusqu'au 4eme parent qui contient les informations ID et COLOR
                        const id = button.parentNode.parentNode.parentNode.parentNode
                        removeItem(id.dataset.id, id.dataset.color)
                    }
                    const quantity_item = () => {
                        const input = this.event.target
                        //on remonte jusqu'au 4eme parent qui contient les informations ID et COLOR et QUANTITY
                        const id = input.parentNode.parentNode.parentNode.parentNode
                        const quantity = this.event.target.value
                        quantityChange(id.dataset.id, id.dataset.color, quantity,input)
                    }


                    //pour chaque class, surveillance de l'event click
                    for (let i = 0; i < delete_button.length; i++) {
                        delete_button[i].addEventListener('click', delete_item, false);
                    }
                    //pour chaque class, surveillance de l'event change
                    for (let i = 0; i < quantity_selector.length; i++) {
                        quantity_selector[i].addEventListener('change', quantity_item, false);
                    }
                })
            })
        })
    } else {
        //si le panier est vide, on cache la partie "commander"
        const order = document.getElementsByClassName("cart__order")[0]
        order.style.display = "none"
    }
    amountCalculator()
}

/**
 * fonction qui calcul les totaux du panier.
 * À chaque changement de quantité, cette fonction est rappelée.
 */
function amountCalculator() {
    if (localStorage.getItem("cart") !== null) {
        const cart = JSON.parse(localStorage.getItem("cart"))
        const total_quantity = document.getElementById("totalQuantity")
        const totalPrice = document.getElementById("totalPrice")
        let quantity = 0
        let price = 0

        cart.forEach(item => {
            fetch("http://localhost:3000/api/products/" + item.id).then(function (response) {
                response.text().then(function (text) {
                    const result = JSON.parse(text)
                    quantity += item.quantity
                    price += item.quantity * result.price
                    total_quantity.textContent = quantity
                    totalPrice.textContent = price
                })
            })
        })
    }
}

/**
 * fonction qui prend en paramétres :
 * @param id
 * @param color
 * Cette fonction permet de trouver l'article voulant être supprimé et le retire du localstorage
 * rechargement de page à la fin pour actualiser le panier.
 */
function removeItem(id, color) {
    if (localStorage.getItem("cart") !== null) {
        const items = JSON.parse(localStorage.getItem("cart"))
        items.forEach(item => {
            if (id === item.id && color === item.color) {
                const item_id = items.indexOf(item)
                items.splice(item_id, 1)
                localStorage.clear()
                localStorage.setItem("cart", JSON.stringify(items))
                location.reload()
            }
        })
    }
}

/**
 * fonction qui prend en paramétres :
 * @param id
 * @param color
 * @param quantity
 * cette fonction permet de mettre à jour les quantités des articles.
 * au changement de l'input, le localstorage est mis à jour
 * appel de la fonction amountCalculator pour actualiser les totaux en bas de page.
 * @param input
 */
function quantityChange(id, color, quantity,input) {
    if (localStorage.getItem("cart") !== null) {
        const items = JSON.parse(localStorage.getItem("cart"))
        items.forEach(item => {
            if (id === item.id && color === item.color) {
                if (quantity=== "0" || quantity < 0 || isNaN(parseInt(quantity))){
                    input.value = item.quantity
                  alert("la quantité saisie n'est pas valide.")
                } else {
                    item.quantity = parseInt(quantity)
                    localStorage.clear()
                    localStorage.setItem("cart", JSON.stringify(items))
                    amountCalculator()
                }
            }
        })
    }
}

/**
 * Fonction de contrôle des champs du formulaire à l'aide de regex.
 * Si les champs sont tous biens remplis et conformes, la fonction renvoi un tableau de données.
 * @returns {{valid: boolean}|{valid: boolean, data: {firstName: FormDataEntryValue, lastName: FormDataEntryValue, address: FormDataEntryValue, city: FormDataEntryValue, email: FormDataEntryValue}}}
 */
const checking_fields = () => {

    const Formulaire = document.getElementsByClassName('cart__order__form')[0];
    const formData = new FormData(Formulaire);
    let valid = true

    const field_name = [
        "firstName",
        "lastName",
        "address",
        "city",
        "email"
    ]

    const string_regex = /^[A-Z]+$/i
    const alpha_regex = /^[a-zA-Z\d\s]*$/
    const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    const dictionnary = {
        "firstName": "Prénom",
        "lastName": "Nom",
        "address": 'Adresse',
        "city": "Ville",
        "email": "Email"
    }

    for (let i = 0; i < field_name.length; i++) {
        let regex = ""

        if (field_name[i] === "firstName" || field_name[i] === "lastName" || field_name[i] === "city") {
            regex = string_regex
        }
        if (field_name[i] === "address") {
            regex = alpha_regex
        }
        if (field_name[i] === "email") {
            regex = email_regex
        }

        if (regex !== "") {
            if (!regex.test(formData.get(field_name[i]).toString())) {
                alert("Le champ " + dictionnary[field_name[i]] + " n'est pas au bon format. ")
                valid = false
            }
        } else {
            valid = false
        }
    }

    return !valid
        ? {"valid": false}
        : {
            "valid": true, "data": {
                "firstName": formData.get("firstName"),
                "lastName": formData.get("lastName"),
                "address": formData.get("address"),
                "city": formData.get("city"),
                "email": formData.get("email")
            }
        }
}

/**
 * Code s'exécutant après la fin du traitement getCart.
 * cette partie surveille l'événement clic sur le bouton "commander" en bas de page.
 * Un appel à la fonction checking_fields permet de confirmer que les champs sont conformes.
 * Une fois vérifié par le retour positif de la fonction, appel de l'API de commande
 * avec les données panier + données utilisateurs saisies dans le formulaire.
 */
getCart().then(r => {
    const button_order = document.getElementById("order")

    button_order.addEventListener("click", (event) => {
        event.preventDefault()
        const valid_datas = checking_fields()

        if (valid_datas.valid) {
            let product_ID = [];

            if (localStorage.getItem("cart") !== null || localStorage.getItem("cart").length === 0) {
                const itemsList = JSON.parse(localStorage.getItem("cart"))
                itemsList.forEach(item => {
                    product_ID.push(item.id)
                })
            } else {
                alert("votre panier est vide")
            }

            let dataReceived = "";

            const contact = {
                "firstName": valid_datas.data["firstName"],
                "lastName": valid_datas.data["lastName"],
                "address": valid_datas.data["address"],
                "city": valid_datas.data["city"],
                "email": valid_datas.data["email"]
            }
            alert(contact)
            const dataToSend = JSON.stringify({
                "contact": contact,
                "products": product_ID
            });

            fetch("http://localhost:3000/api/products/order", {
                method: 'POST',
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                },
                mode: "cors",
                body: dataToSend
            })
                .then(resp => resp.json())
                .then(data => {
                    document.location.href = "./confirmation.html?"
                        + data.orderId;
                })
        }

    })

})




