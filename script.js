const recipesContainer = document.getElementById("recipes");
const detailsContainer = document.getElementById("details");

function searchRecipes() {
    const query = document.getElementById("searchInput").value;

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(res => res.json())
        .then(data => {
            displayRecipes(data.meals);
        });
}


function displayRecipes(meals) {
    recipesContainer.innerHTML = "";
    detailsContainer.innerHTML = "";

    if (!meals) {
        recipesContainer.innerHTML = "<p>No recipes found</p>";
        return;
    }

    meals.forEach(meal => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p>${meal.strCategory}</p>
            <button onclick="showDetails('${meal.idMeal}')">
                View Recipe
            </button>
        `;

        recipesContainer.appendChild(div);
    });
}


function showDetails(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];

            detailsContainer.innerHTML = `
                <h2>${meal.strMeal}</h2>
                <img src="${meal.strMealThumb}" width="300">
                <p><b>Category:</b> ${meal.strCategory}</p>
                <p><b>Instructions:</b> ${meal.strInstructions}</p>
            `;
        });
}
