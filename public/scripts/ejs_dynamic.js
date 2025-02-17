// these fields are always the same, so might as well
// make them global
const newItemText = document.getElementById("new_item_text");
const newItemButton = document.getElementById("new_item_button");

function post(endpoint, data, itemId) {

    let completeURL = "/" + endpoint;

    if (itemId) completeURL += "/" + itemId;

    const headers = {'Content-Type': 'application/json'};

    let jsonData = JSON.stringify(data);

    fetch(completeURL, {
        method: 'POST',
        headers: headers,
        body: jsonData
    })

        .then(response => {
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            window.location.reload();
            return;
        })

        .catch(error => {
            console.error('Fetch error:', error);
        });
}

function start_edit_item(id) {
    const staticText = document.getElementById("static_text_" + id);
    const editText = document.getElementById("edit_text_" + id);

    const startEditButton = document.getElementById("start_edit_button_" + id);
    const finishEditButton = document.getElementById("finish_edit_button_" + id);
    const cancelEditButton = document.getElementById("cancel_edit_button_" + id);
    const deleteButton = document.getElementById("delete_button_" + id);

    const newItemText = document.getElementById("new_item_text");
    const newItemButton = document.getElementById("new_item_button");

    // hide static stuff
    staticText.classList.add("d-none");
    startEditButton.classList.add("d-none");
    deleteButton.classList.add("d-none");

    // show dynamic stuff
    editText.classList.remove("d-none");
    finishEditButton.classList.remove("d-none");
    cancelEditButton.classList.remove("d-none");

    //disable new item box
    newItemText.classList.add("disabled");
    newItemButton.classList.add("disabled");
    newItemText.disabled = true;
    newItemButton.disabled = true;
}

function cancel_edit_item(id) {
    const staticText = document.getElementById("static_text_" + id);
    const editText = document.getElementById("edit_text_" + id);

    const startEditButton = document.getElementById("start_edit_button_" + id);
    const finishEditButton = document.getElementById("finish_edit_button_" + id);
    const cancelEditButton = document.getElementById("cancel_edit_button_" + id);
    const deleteButton = document.getElementById("delete_button_" + id);

    const newItemText = document.getElementById("new_item_text");
    const newItemButton = document.getElementById("new_item_button");

    // show static stuff
    staticText.classList.remove("d-none");
    startEditButton.classList.remove("d-none");
    deleteButton.classList.remove("d-none");

    // hide dynamic stuff
    editText.classList.add("d-none");
    finishEditButton.classList.add("d-none");
    cancelEditButton.classList.add("d-none");

    // enable new item box
    newItemText.classList.remove("disabled");
    newItemButton.classList.remove("disabled");
    newItemText.disabled = false;
    newItemButton.disabled = false;
}

function finish_edit_item(id) {
    const updateEndpoint = "update"
    const editText = document.getElementById("edit_text_" + id);
    const data = {
        name: editText.value
    };
    post(updateEndpoint, data, id);
}

function delete_item(id) {
    const deleteEndpoint = "delete"
    const data = {};
    post(deleteEndpoint, data, id);
}

function new_item(id) {
    const addEndpoint = "add"
    const data = {
        name: newItemText.value
    };
    post(addEndpoint, data);
}