
fetch("http://localhost:3000/api/products").then(function(response) {
    response.text().then(function(text) {
        if (response.status === 200){
            const products = JSON.parse(text)
            for (let i=0; i<products.length; i++){
                /**
                 * récupération de la balise contenant les produits
                 * @type {HTMLElement}
                 */
                const items_html    = document.getElementById("items")
                const a             = document.createElement('a')
                const article       = document.createElement('article')
                const img           = document.createElement('img')
                const h3            = document.createElement('h3')
                const p             = document.createElement('p')

                a.href = "./product.html?"+products[i]._id
                items_html.append(a)

                a.append(article)

                img.src = products[i].imageUrl
                article.append(img)

                h3.textContent = products[i].name
                article.append(h3)

                p.textContent = products[i].description

                article.append(p)
            }
        }
    });
});


