// Display all lists on the main page
async function loadLists() {
    const response = await fetch('http://localhost:5000/api/lists');
    const lists = await response.json();
    const container = document.getElementById('listsContainer');
    container.innerHTML = '';
    
    for (let list of lists) {
        const listCard = document.createElement('div');
        listCard.className = 'list-card';
        
        const listName = document.createElement('div');
        listName.className = 'list-name';
        listName.textContent = list.name;
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'list-actions';
        
        const openBtn = document.createElement('button');
        openBtn.textContent = 'Open';
        openBtn.addEventListener('click', () => openList(list.id, list.name));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteList(list.id));
        
        actionsDiv.appendChild(openBtn);
        actionsDiv.appendChild(deleteBtn);
        listCard.appendChild(listName);
        listCard.appendChild(actionsDiv);
        container.appendChild(listCard);
    }
}

// Open a list and show its items (replaces main view)
async function openList(listId, listName) {
    // Fetch items for this list
    const response = await fetch(`http://localhost:5000/api/lists/${listId}/items`);
    const items = await response.json();
    
    // Hide the main view, show the list view
    document.getElementById('mainView').style.display = 'none';
    document.getElementById('listView').style.display = 'block';
    document.getElementById('listTitle').textContent = listName;
    
    // Store current list ID for adding items
    window.currentListId = listId;
    
    // Display items
    const itemsContainer = document.getElementById('itemsContainer');
    itemsContainer.innerHTML = '';
    
    for (let item of items) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'list-card';
        itemDiv.innerHTML = `
            <span>${item.item_name} (x${item.quantity})</span>
            <button onclick="deleteItem(${item.id})">Delete</button>
        `;
        itemsContainer.appendChild(itemDiv);
    }
}

// Go back to main view
function backToLists() {
    document.getElementById('mainView').style.display = 'block';
    document.getElementById('listView').style.display = 'none';
    loadLists(); // Refresh main view
}

// Add item to current list
async function addItem() {
    const itemName = document.getElementById('newItemName').value.trim();
    const quantity = document.getElementById('newItemQuantity').value;
    
    if (!itemName) return;
    
    await fetch(`http://localhost:5000/api/lists/${window.currentListId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_name: itemName, quantity: parseInt(quantity) || 1 })
    });
    
    // Clear inputs and refresh
    document.getElementById('newItemName').value = '';
    document.getElementById('newItemQuantity').value = '1';
    openList(window.currentListId, document.getElementById('listTitle').textContent);
}

// Delete an item
async function deleteItem(itemId) {
    if (!confirm('Delete this item?')) return;
    
    await fetch(`http://localhost:5000/api/items/${itemId}`, {
        method: 'DELETE'
    });
    
    openList(window.currentListId, document.getElementById('listTitle').textContent);
}

// Delete a list
async function deleteList(listId) {
    if (!confirm('Delete this list and all its items?')) return;
    
    await fetch(`http://localhost:5000/api/lists/${listId}`, {
        method: 'DELETE'
    });
    
    loadLists();
}

// Create a new list
async function createList() {
    const input = document.getElementById('newListName');
    const name = input.value.trim();
    if (!name) return;
    
    await fetch('http://localhost:5000/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    
    input.value = '';
    loadLists();
}

// Connect buttons
document.getElementById('createListBtn').addEventListener('click', createList);
document.getElementById('backBtn').addEventListener('click', backToLists);
document.getElementById('addItemBtn').addEventListener('click', addItem);

// Load lists on page start
loadLists();