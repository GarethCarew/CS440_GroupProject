// these fields are always the same, so might as well
// make them global
const newItemText = document.getElementById("new_item_text");
const newItemButton = document.getElementById("new_item_button");

function request(endpoint, data, method, itemId) {

    let completeURL = "/archive/" + endpoint + "/" ;

    if (itemId){
        completeURL += itemId;
    } else {
        completeURL += data.list_id;
    }

    const headers = {'Content-Type': 'application/json'};

    let jsonData = JSON.stringify(data);

    fetch(completeURL, {
        method: method,
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

function finish_edit_item(id, list_id) {
    const updateEndpoint = "update"

    list_id = list_id.slice(1);

    const editText = document.getElementById("edit_text_" + id);
    const staticText = document.getElementById("static_text_" + id);
    const checkbox = document.getElementById("checkbox_" + id);
    const group = document.getElementById("group_" + id);

    if(checkbox.checked)
    {
        group.classList.add("completed")
    } else
    {
        group.classList.remove("completed");
    }

    const data = {
        name: editText.value,
        list_id: list_id,
        complete: checkbox.checked,
    };
    request(updateEndpoint, data, 'PUT', id);

    staticText.innerText = editText.value;

    cancel_edit_item(id);
}

function delete_item(id, list_id) {
    const deleteEndpoint = "delete"
    const data = {};
    list_id = list_id.slice(1);
    request(deleteEndpoint, data,'DELETE', id, );
}

function new_item(list_id) {
    const addEndpoint = "add"

    list_id = list_id.slice(1);

    const data = {
        name: newItemText.value,
        list_id: list_id,
        complete: false,
    };
    request(addEndpoint, data, 'POST');
}

function updateCheckbox(id, list_id) {
    finish_edit_item(id, list_id);
}