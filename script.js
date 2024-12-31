function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("show");
}

const searchBox = document.getElementById('search-item');
const searchBtn = document.getElementById('search-btn');
const recipeContainer = document.getElementById('recipe-container');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');
const recipeDetailsContent = document.querySelector('.recipe-details-content');

const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<p>Fetching Recipes...</p>";
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        recipeContainer.innerHTML = "";

        if (!response.meals) {
            recipeContainer.innerHTML = "<p>No recipes found. Please try a different search!</p>";
            return;
        }

        response.meals.forEach(meal => {
            let recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p>${meal.strCategory}</p>
            `;
            let button = document.createElement('button');
            button.textContent = "View Recipe";
            button.classList.add('view-recipe-btn');
            recipeDiv.appendChild(button);

            button.addEventListener('click', () => {
                openRecipePopUp(meal);
            });

            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        console.error("Error fetching recipes:", error);
        recipeContainer.innerHTML = "<p>Error fetching recipes. Please try again later.</p>";
    }
};

searchBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (searchInput) {
        fetchRecipes(searchInput);
    } else {
        recipeContainer.innerHTML = "<p>Please enter a dish name to search!</p>";
    }
});

const openRecipePopUp = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul>${fetchIngredients(meal)}</ul>
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="popup-image">
    `;
    recipeDetailsContent.parentElement.style.display = "flex"; // Use flex for centering
};

recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
});


const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) { // Corrected index starting from 1
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient && ingredient.trim() !== "") {
            const measure = meal[`strMeasure${i}`] || "";
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
};
