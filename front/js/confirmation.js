let orderId = location.search.substring(1);

if (orderId !== ""){
    const order_dom = document.getElementById("orderId")
    order_dom.textContent = orderId
    if (localStorage.getItem("cart") !== ""){
        localStorage.clear()
    }
} else {
    document.location.href = "http://localhost:63342/P5_Mathieu_Durand_Kanap/front/html/index.html?";
}

