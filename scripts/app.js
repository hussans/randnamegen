const nameContainer = document.getElementById('nameContainer');
const nameInput = document.getElementById('inputName');
const groupInput = document.getElementById('inputGroup');
const addNameBtn = document.getElementById('inputNameBtn');
const createGroupsBtn = document.getElementById('inputGroupBtn');

let names = JSON.parse(localStorage.getItem('names')) || [];

const modeDiv = document.createElement('div');
modeDiv.className = 'mode-selection';
modeDiv.innerHTML = 
`
    <label>
        <input type="radio" name="mode" value="size" checked> Group Size
    </label>
    <label>
        <input type="radio" name="mode" value="number"> Number of Groups
    </label>
`;
document.querySelector('.inputgroup-container').prepend(modeDiv);

addNameBtn.addEventListener('click', function() {
    const newName = nameInput.value.trim();
    if (newName && !names.includes(newName)) {
        names.push(newName);
        nameInput.value = '';
        saveNames();
        showNames();
    }
});

createGroupsBtn.addEventListener('click', function() {
    const number = parseInt(groupInput.value);
    const mode = document.querySelector('input[name="mode"]:checked').value;
    
    if (!number) {
        alert('Please enter a valid number');
        return;
    }
    
    const namesCopy = names.slice();
    const shuffledNames = [];
    
    while (namesCopy.length > 0) {
        const randomIndex = Math.floor(Math.random() * namesCopy.length);
        shuffledNames.push(namesCopy.splice(randomIndex, 1)[0]);
    }
    
    const groups = [];
    
    if (mode === 'size') {
        let currentGroup = [];
        for (let i = 0; i < shuffledNames.length; i++) {
            currentGroup.push(shuffledNames[i]);
            if (currentGroup.length === number) {
                groups.push(currentGroup);
                currentGroup = [];
            }
        }
        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }
    } else {
        const namesPerGroup = Math.ceil(shuffledNames.length / number);
        for (let i = 0; i < number; i++) {
            const start = i * namesPerGroup;
            const end = start + namesPerGroup;
            groups.push(shuffledNames.slice(start, end));
        }
    }
    
    showGroups(groups);
});

function showNames() {
    nameContainer.innerHTML = names.map((name, index) => 
        `<div class="name-item">
            ${name}
            <button class="delete-btn" data-index="${index}">×</button>
        </div>`
        ).join('') || '<p style="text-align: center; color: #aaa;"> no names added yet </p>';

    const deleteButtons = document.getElementsByClassName('delete-btn');
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            names.splice(index, 1);
            saveNames();
            showNames();
        });
    }
}

function showGroups(groups) {
    let groupsHTML = '';
    for (let i = 0; i < groups.length; i++) {
        groupsHTML += `
            <div class="group">
                <h3>Group ${i + 1}</h3>
                ${groups[i].join(', ')}
            </div>
        `;
    }
    nameContainer.innerHTML = groupsHTML;
}

function saveNames() {
    localStorage.setItem('names', JSON.stringify(names));
}

showNames();