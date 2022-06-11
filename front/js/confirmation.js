//récupération de la donnée en URL
let orderId = location.search.substring(1);

// si l'ID n'est pas vide, on l'affiche dans le champ correspondant.
if (orderId !== ""){
    const order_dom = document.getElementById("orderId")
    order_dom.textContent = orderId
    if (localStorage.getItem("cart") !== ""){
        localStorage.clear()
    }
} else {
    //Si aucun ID n'est présent dans l'url, renvoi vers la page principale.
    document.location.href = "./index.html";
}

