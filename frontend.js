
function loadItems(myItems) {
    // Find the element “col” in HTML
    var CardItem = document.getElementById("col");

    var checkboxes = [];
    var cards = [];

    // Read every movie from the array
    for (var i = 0; i<myItems.movies.length; i++){
        let title = myItems.name;
        let year = myItems.price;
        let url = myItems.imageUrl;

        let checkbox = "checkbox" + i.toString();
        let card = "card" + i.toString();

        let AddCardItem = document.createElement("div");
        // add class = “col” to new division for Bootstrap
        AddCardItem.classList.add("col");

        AddCardItem.innerHTML = `
        <input type="checkbox" id=${checkbox} class="form-check-input" checked>
        <label for=${checkbox} class="form-check-label">Show Image ${i+1}</label>

        <div id=${card} class="card shadow-sm">
        <img src=${url} class="card-img-top" alt="..."></img>
        <div class="card-body">
            <p class="card-text"> <strong>${title}</strong>, ${year}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                        <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                    </div>
                    <small class="text-body-secondary">9 mins</small>
                </div>
            </div>
        </div>
        `;

        CardItem.appendChild(AddCardItem);

        let cbox = document.getElementById(checkbox);
        checkboxes.push(cbox);
        let ccard = document.getElementById(card);
        cards.push(ccard);

        console.log(checkbox);
        console.log(card); 
    }
    console.log(checkboxes);
    console.log(cards); 

    checkboxes.forEach((checkboxParam, index) => {
        console.log(index);
        checkboxParam.addEventListener('change', () => {
            if (checkboxParam.checked) {
                cards[index].style.display = 'block'; // Show the card
            } else {
                cards[index].style.display = 'none'; // Hide the card
            }
        });
    });
}

function deleteOneItem() {
    // Fetch the value from the input field
    let id = document.getElementById("deleteItemById").value;
    console.log(id);
    fetch(`http://localhost:8081/deleteItem/${id}`, {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(
    { "id":id}
    )
    })
    .then(response => response.json())
    .then(deleteThisItem => {deleteOneItemById(deleteThisItem)});
}
function updateOneItem() {
    // Fetch the value from the input field
    let id = document.getElementById("updateItemById").value;
    console.log(id);
    fetch(`http://localhost:8081/updateItem/${id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(
            {
                "name": "Item test",
                "price": 100.90,
                "description": "I item is one example of an image for my exercise",
                "imageUrl": "https://PLACEHOLDER.org/"                              // NOTE: No idea how frontend works or why this is here.
            }
        )
    })
    .then(response => response.json())
    .then(updateThisItem => {updateOneItemById(updateThisItem)});
}