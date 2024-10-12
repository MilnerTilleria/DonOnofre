let productList = [];
let carrito = [];
let total = 0;

// Asegúrate de que la URL del WebSocket sea correcta para tu entorno
const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
const socketUrl = `${protocol}3ad2-2803-7d80-a401-7fee-948f-7e86-765a-b319.ngrok-free.app`;
const socket = new WebSocket(socketUrl);

// Escuchar los mensajes del WebSocket
socket.onmessage = function(event) {
    const data = JSON.parse(event.data);  // Asegurarse de que los datos sean JSON
    if (data.message === 'paid') {
        window.alert('pago exitoso')
        // Eliminar el carrito del localStorage
        localStorage.removeItem("carrito");
        carrito = [];
        total = 0;
        document.getElementById("checkout").innerHTML = `Pagar Gs. ${total}`;
        console.log('Carrito eliminado después del pago exitoso.');
    } 
};

// Función para añadir productos al carrito
function add(productId, precio) {
    const productoEnCarrito = carrito.find(item => item.productId === productId);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad += 1;
        productoEnCarrito.precioTotal += precio;
    } else {
        carrito.push({ productId, precio, cantidad: 1, precioTotal: precio });
    }

    total += precio;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    document.getElementById("checkout").innerHTML = `Pagar Gs. ${total}`;
    displayProducts(productList);
}

// Función para manejar el pago
async function pay() {
    try {
        const postData = {
            value: total, 
            products: carrito.map(item => ({
                id: item.productId,
                amount: item.cantidad
            })),
            label: `Pago de ${carrito.length} productos`
        };

        const response = await fetch("/api/pay", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        });

        const result = await response.json();

        if (result.payUrl) {
            redirectToPaymentPage(result.payUrl);
        } else {
            window.alert("El pago ha fallado. Puedes continuar con tu compra.");
        }
    } catch (error) {
        console.error("Error al procesar el pago:", error);
        window.alert("Hubo un error al procesar el pago.");
    }
}

function redirectToPaymentPage(payUrl) {
    window.open(payUrl, '_blank');
}

// Mostrar productos en la interfaz
function displayProducts(productList) {
    let productsHTML = '';
    productList.forEach(p => {
        let buttonHTML = ` <button class="button-add" onclick="add('${p.id}',${p.precio})">Añadir al carrito</button>`;
        if (p.stock <= 0) {
            buttonHTML = ` <button disabled class="button-add">Sin stock</button>`;
        }

        productsHTML += `
            <div class="articulos-card">
                <h5>${p.name}</h5>
                <img src="${p.img}">
                <h6>GS ${p.precio}</h6>
                ${buttonHTML}
            </div>`;
    });
    document.getElementById('articulos-container').innerHTML = productsHTML;
}

window.onload = async () => {
    try {
        // Cargar carrito desde localStorage
        const storedCart = localStorage.getItem("carrito");
        if (storedCart) {
            carrito = JSON.parse(storedCart);
            total = carrito.reduce((acc, item) => acc + item.precioTotal, 0);
            document.getElementById("checkout").innerHTML = `Pagar Gs. ${total}`;
            window.alert('Error en el pago, vuelva a intentarlo')
        }

        // Obtener la lista de productos desde la API
        const response = await fetch("/api/productos");
        const data = await response.json();

        if (data.productos && Array.isArray(data.productos)) {
            productList = data.productos;
            displayProducts(productList);
        }
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
};
