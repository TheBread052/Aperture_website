//modal gestion

//modal 1
const modal = document.getElementById('buyModal');
const modalItemName = document.getElementById('modalItemName');
const modalQuantity = document.getElementById('modalQuantity');
const totalPriceText = document.getElementById("totalPriceText");
const confirmBuy = document.getElementById('confirmBuy');
const closeModal = document.querySelector('.close');
const modalImage = document.getElementById('modalObjectImage');

//modal 2
const confirmModal = document.getElementById('confirmModal');
const confirmText = document.getElementById('confirmText');
const finalConfirm = document.getElementById('finalConfirm');
const cancelConfirm = document.getElementById('cancelConfirm');

//modal's variable
let selectedItemKey = null;
let selectedObject = null;
let selectedQuantityText = null;

//get data.json data
fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('objectPage');

        for (let key in data) {
            const object = data[key];

            //creation of a <div> for each object
            const div = document.createElement('div');
            div.className = "article";

            //creation of containers
            const TextDiv = document.createElement('div');
            TextDiv.className = "textDiv";

            const PictureDiv = document.createElement('div');
            PictureDiv.className = "pictureDiv";

            //get values from data.json
            const nom = document.createElement('p');
            nom.textContent = `Name: ${object.name}`;

            const desc = document.createElement('p');
            desc.innerHTML = object.description.replace(/\n/g, '<br>');

            const valeur = document.createElement('p');
            valeur.textContent = `Price: ${object.value}$`;

            const Quantity = document.createElement('p');
            Quantity.textContent = `Quantity: ${object.quantity}`;

            //creation of a buy button
            const buyButton = document.createElement('button');
            buyButton.textContent = "buy";
            buyButton.className = "buttonModal"
            buyButton.addEventListener('click', () => {
                selectedItemKey = key;
                selectedObject = object;
                selectedQuantityText = Quantity;

                modalItemName.textContent = `Article: ${object.name}`;
                modalQuantity.value = 1;
                totalPriceText.textContent = `final price: ${object.value}$`;

                if (object.picture != null) {
                    modalImage.src = object.picture;
                } else {
                    modalImage.src = "png_files/imgPlaceHolder.png";
                }

                modal.style.display = 'block';
            });

            //add all cumpend in div
            TextDiv.appendChild(nom);
            TextDiv.appendChild(desc);
            TextDiv.appendChild(valeur);
            TextDiv.appendChild(Quantity);
            TextDiv.appendChild(buyButton);

            //add object picture
            const Picture = document.createElement('img');

            if (object.picture != null) {
                Picture.src = object.picture;

            } else {
                
                Picture.src = "png_files/imgPlaceHolder.png";
                
                
            }

            PictureDiv.appendChild(Picture);

            //building the object
            div.appendChild(TextDiv);
            div.appendChild(PictureDiv);

            //add the object in the container
            container.appendChild(div);
        }

    })
    .catch(error => console.error('Erreur lors de la récupération des données :', error));


//updated price in the modal 1
modalQuantity.addEventListener('input', () => {
    const qty = parseInt(modalQuantity.value, 10);
    if (!isNaN(qty) && qty > 0) {
        const total = qty * selectedObject.value;
        totalPriceText.textContent = `finale price: ${total}$`;
    } else {
        totalPriceText.textContent = `finale price: 0$`;
    }
});

//close the modal 1
closeModal.onclick = () => {
    modal.style.display = 'none';
};

//close the modal 2
cancelConfirm.onclick = () => {
    confirmModal.style.display = 'none';
};

//purchase manager
confirmBuy.onclick = () => {
    const quantity = parseInt(modalQuantity.value, 10);

    if (isNaN(quantity) || quantity <= 0) {
        alert("invalid quantity");
        return;
    }

    if (quantity > selectedObject.quantity) {
        alert("not enought stock!");
        return;
    }

    //show modal 2
    confirmText.textContent = `Do you really want to purchase ${quantity} ${selectedObject.name} for a total price of ${quantity * selectedObject.value}$ ?`;
    confirmModal.style.display = 'block';
}

finalConfirm.onclick = () => {
    const quantity = parseInt(modalQuantity.value, 10);

    fetch('/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemKey: selectedItemKey, quantity: quantity })
    })
    .then(response => response.json())
    .then(data => {
        alert(`Success pruchase of ${quantity} ${selectedObject.name} !`);
        selectedObject.quantity -= quantity;
        selectedQuantityText.textContent = `Quantity: ${selectedObject.quantity}`;
        modal.style.display = 'none';
        confirmModal.style.display = 'none';
    })
    .catch(error => {
        console.error('Erreur lors de l’achat :', error);
        alert("Error during purchase!");
        confirmModal.style.display = 'none';
    });
};