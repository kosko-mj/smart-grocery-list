// Temporary hardcoded data to test the display
const sampleLists = [
    { id: 1, name: "Dinner Party" },
    { id: 2, name: "Costco Run" },
    { id: 3, name: "Weekly Groceries" }
];

function displayLists() {
    const container = document.getElementById('listsContainer');
    container.innerHTML = '';
    
    for (let list of sampleLists) {
        const listCard = document.createElement('div');
        listCard.className = 'list-card';
        
        const listName = document.createElement('div');
        listName.className = 'list-name';
        listName.textContent = list.name;
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'list-actions';
        
        const openBtn = document.createElement('button');
        openBtn.textContent = 'Open';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        
        actionsDiv.appendChild(openBtn);
        actionsDiv.appendChild(deleteBtn);
        
        listCard.appendChild(listName);
        listCard.appendChild(actionsDiv);
        
        container.appendChild(listCard);
    }
}

displayLists();