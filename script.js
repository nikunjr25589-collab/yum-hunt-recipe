const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const filterCategory = document.getElementById("filterCategory");
const sortOption = document.getElementById("sortOption");
const container = document.getElementById("recipes");
const toggleTheme = document.getElementById("toggleTheme");

let allMeals = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


fetchAllRecipes();

function fetchAllRecipes() {
  const letters = ["a", "b", "c", "d", "e"];

  Promise.all(
    letters.map(letter =>
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${letter}`)
        .then(res => res.json())
    )
  )
  .then(results => {
    allMeals = results.flatMap(r => r.meals || []);
    applyAll();
  })
  .catch(() => {
    container.innerHTML = "<p>Error loading data</p>";
  });
}


function applyAll() {
  let data = [...allMeals];

  const searchText = searchInput.value.toLowerCase();
  data = data.filter(meal =>
    meal.strMeal.toLowerCase().includes(searchText)
  );

  if (filterCategory.value !== "all") {
    data = data.filter(meal =>
      meal.strCategory.toLowerCase().includes(filterCategory.value.toLowerCase())
    );
  }

  if (sortOption.value === "asc") {
    data = [...data].sort((a, b) => a.strMeal.localeCompare(b.strMeal));
  } else if (sortOption.value === "desc") {
    data = [...data].sort((a, b) => b.strMeal.localeCompare(a.strMeal));
  }

  displayRecipes(data);
}


function displayRecipes(meals) {
  if (meals.length === 0) {
    container.innerHTML = "<p>No recipes found</p>";
    return;
  }

  container.innerHTML = meals.map(meal => `
    <div class="recipe">
      <img src="${meal.strMealThumb}" />
      <h3>${meal.strMeal}</h3>
      <p>${meal.strCategory}</p>
      <button onclick="toggleFavorite('${meal.idMeal}')">
        ${favorites.includes(meal.idMeal) ? "❤️" : "🤍"}
      </button>
    </div>
  `).join("");
}


function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(fav => fav !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  applyAll();
}


searchInput.addEventListener("input", applyAll);
searchBtn.addEventListener("click", applyAll);
filterCategory.addEventListener("change", applyAll);
sortOption.addEventListener("change", applyAll);


toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});


if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}