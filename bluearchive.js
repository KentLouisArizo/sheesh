async function fetchAndDisplayCharacters() {
    const searchQuery = document.getElementById('search-bar').value.trim();
    const schoolFilter = document.getElementById('school-filter').value;
    let url = 'https://api-blue-archive.vercel.app/api/characters';
    if (searchQuery) {
        url += `?name=${encodeURIComponent(searchQuery)}`;
    }
    if (schoolFilter) {
        url += `${searchQuery ? '&' : '?'}school=${encodeURIComponent(schoolFilter)}`;
    }
    
    try {
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.message === 'success') {
            const characters = result.data;
            if (Array.isArray(characters)) {
                displayCharacters(characters);
            } else {
                console.error('Unexpected data format:', result);
            }
        } else {
            console.error('Error fetching character data:', result.message);
        }
    } catch (error) {
        console.error('Error fetching character data:', error);
    }
}

function displayCharacters(characters) {
    const container = document.getElementById('characters-container');
    container.innerHTML = '';
    
    characters.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.className = 'character-card';
        
        characterCard.innerHTML = `
            <img src="${character.photoUrl}" alt="${character.name}" class="character-photo">
            <h2 class="character-name">${character.name}</h2>
            <p class="character-school">${character.school}</p>
            <p class="character-birthday">Birthday: ${character.birthday}</p>
        `;
        
        container.appendChild(characterCard);
    });
}

document.getElementById('search-bar').addEventListener('input', fetchAndDisplayCharacters);
document.getElementById('school-filter').addEventListener('change', fetchAndDisplayCharacters);

// Initial fetch
fetchAndDisplayCharacters();
