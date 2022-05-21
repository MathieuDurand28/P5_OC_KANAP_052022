if (localStorage.getItem("cart") !== null) {
    getCart()
}

function getCart() {
    const section = document.getElementById("cart__items")
    const cart = JSON.parse(localStorage.getItem("cart"))
    const total_quantity = document.getElementById("totalQuantity")
    const totalPrice = document.getElementById("totalPrice")
    let quantity = 0
    let price = 0

    cart.forEach(item => {
        fetch("http://localhost:3000/api/products/" + item.id).then(function (response) {
            response.text().then(function (text) {
                if (response.status === 200) {
                    const result = JSON.parse(text)
                    const article = document.createElement("article")

                    quantity += item.quantity
                    price += result.price
                    total_quantity.textContent = quantity
                    totalPrice.textContent = price

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
            })
        })
    })
}

function getCart_test() {
    const section = document.getElementById("cart__items")
    const article = document.createElement("article")
    const div_une = document.createElement("div")
    const div_deux = document.createElement("div")
    const div_trois = document.createElement("div")
    const div_quatre = document.createElement("div")
    const div_cinq = document.createElement("div")
    const div_six = document.createElement("div")
    const img = document.createElement("img")
    const h2 = document.createElement("h2")
    const p_un = document.createElement("p")
    const p_deux = document.createElement("p")
    const p_trois = document.createElement("p")
    const p_quatre = document.createElement("p")
    const input = document.createElement("input")
    const cart = JSON.parse(localStorage.getItem("cart"))


    cart.forEach(item => {
        fetch("http://localhost:3000/api/products/" + item.id).then(function (response) {
            response.text().then(function (text) {
                if (response.status === 200) {
                    const result = JSON.parse(text)

                    article.className = "cart__item"
                    article.dataset.id = item.id
                    article.dataset.color = item.color
                    section.append(article)

                    div_une.className = "cart__item__img"
                    article.append(div_une)

                    img.src = result.imageUrl
                    img.alt = item.altTxt
                    div_une.append(img)


                    div_deux.className = "cart__item__content"
                    article.append(div_deux)
                    div_trois.className = "cart__item__content__description"
                    div_deux.append(div_trois)

                    h2.textContent = item.name
                    div_trois.append(h2)

                    p_un.textContent = item.color
                    div_trois.append(p_un)

                    p_deux.textContent = result.price + " €"
                    div_trois.append(p_deux)

                    div_quatre.className = "cart__item__content__settings"
                    div_deux.append(div_quatre)

                    div_cinq.className = "cart__item__content__settings__quantity"
                    div_quatre.append(div_cinq)

                    p_trois.textContent = "Qté: "
                    div_cinq.append(p_trois)

                    input.className = "itemQuantity"
                    input.type = "number"
                    input.name = "itemQuantity"
                    input.min = "1"
                    input.max = "100"
                    input.value = item.quantity
                    div_cinq.append(input)

                    div_six.className = "cart__item__content__settings__delete"
                    div_quatre.append(div_six)

                    p_quatre.className = "deleteItem"
                    p_quatre.textContent = "Supprimer"

                    div_six.append(p_quatre)
                }
            })
        })

    })
}

