const heroImageMap = {
    abaddon: "https://www.dotabuff.com/images/heroes/abaddon.jpg",
    antimage: "https://www.dotabuff.com/images/heroes/antimage.jpg",
    // Add other heroes similarly
  };
  
  const fetchHeroesBtn = document.getElementById("fetchHeroesBtn");
  const searchInput = document.getElementById("searchInput");
  const heroContainer = document.getElementById("heroContainer");
  const primaryAttrFilter = document.getElementById("primaryAttrFilter");
  const attackTypeFilter = document.getElementById("attackTypeFilter");
  const roleFilter = document.getElementById("roleFilter");
  const loadingMessage = document.getElementById("loadingMessage");
  
  let allHeroes = [];
  let rolesSet = new Set();
  let debounceTimeout;
  
  function fetchAndDisplayHeroes() {
    heroContainer.innerHTML = "";
    loadingMessage.style.display = "block";
  
    fetch("https://api.opendota.com/api/heroes")
      .then((response) => response.json())
      .then((heroes) => {
        allHeroes = heroes;
        rolesSet.clear();
  
        heroes.forEach((hero) => {
          hero.roles.forEach((role) => rolesSet.add(role));
        });
  
        roleFilter.innerHTML = '<option value="">Role</option>';
        rolesSet.forEach((role) => {
          roleFilter.innerHTML += `<option value="${role}">${role}</option>`;
        });
  
        displayHeroes(heroes);
      })
      .catch((error) => {
        console.error("Error fetching hero data:", error);
        heroContainer.innerHTML = '<p style="color:red;">Failed to fetch hero data. Please try again later.</p>';
      })
      .finally(() => {
        loadingMessage.style.display = "none";
      });
  }
  
  function displayHeroes(heroes) {
    heroContainer.innerHTML = "";
  
    heroes.forEach((hero) => {
      const heroCard = document.createElement("div");
      heroCard.className = "hero-card";
  
      const heroImgUrl = heroImageMap[hero.name] || "https://via.placeholder.com/100?text=No+Image";
  
      heroCard.innerHTML = `
        <img src="${heroImgUrl}" alt="${hero.localized_name}">
        <div>
          <h3>${hero.localized_name}</h3>
          <p>Primary Attribute: ${hero.primary_attr}</p>
          <p>Attack Type: ${hero.attack_type}</p>
          <p>Roles: ${hero.roles.join(", ")}</p>
        </div>
      `;
  
      heroContainer.appendChild(heroCard);
    });
  }
  
  function filterHeroes() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const searchTerm = searchInput.value.toLowerCase();
      const primaryAttr = primaryAttrFilter.value;
      const attackType = attackTypeFilter.value;
      const role = roleFilter.value;
  
      const filteredHeroes = allHeroes.filter((hero) => {
        const matchesName = hero.localized_name.toLowerCase().includes(searchTerm);
        const matchesPrimaryAttr = primaryAttr ? hero.primary_attr === primaryAttr : true;
        const matchesAttackType = attackType ? hero.attack_type === attackType : true;
        const matchesRole = role ? hero.roles.includes(role) : true;
  
        return matchesName && matchesPrimaryAttr && matchesAttackType && matchesRole;
      });
  
      displayHeroes(filteredHeroes);
    }, 300);
  }
  
  fetchHeroesBtn.addEventListener("click", fetchAndDisplayHeroes);
  searchInput.addEventListener("input", filterHeroes);
  primaryAttrFilter.addEventListener("change", filterHeroes);
  attackTypeFilter.addEventListener("change", filterHeroes);
  roleFilter.addEventListener("change", filterHeroes);
  