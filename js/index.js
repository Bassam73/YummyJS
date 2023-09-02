/*global Functions*/
$(document).ready(function () {
  $(".loading-screen").fadeOut(300);
  $("body").css("overflow", "visible");
});
async function getApi(name) {
  let response;
  let data;
  if (name.length != 1) {
    response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
    );

    data = await response.json();
  } else {
    response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${name}`
    );

    data = await response.json();
  }

  displayMeals(data.meals, "home-content");
}

function displayMeals(meals, elementID) {
  let cartona = ``;
  if (meals != null) {
    for (let i = 0; i < meals.length; i++) {
      cartona += `<div class="col-md-3" id='meal' onclick="(getIdApi('${meals[i].idMeal}'))" >
        <div class="content rounded-2">
        <img src="${meals[i].strMealThumb}" class="w-100" alt="" />
          <div class="meal-layer">
            <h3>${meals[i].strMeal}</h3>
          </div>
        </div>
      </div>`;
    }
  }
  $(`#${elementID}`).html(cartona);
}

async function getIdApi(id) {
  $(".meal-details-loading-screen").fadeIn(500);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let data = await response.json();

  $(".meal-details-loading-screen").fadeOut(500);
  displayMealDetails(data.meals[0]);
}

function displayMealDetails(meal) {
  displayAllNone();

  $("#meal-details").css("display", "block");
  let z = 1;
  let ingredients = ``;
  for (let i = 0; i < 50; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `
    <div class="recipes-span rounded-2">${meal[`strMeasure${i}`]} ${
        meal[`strIngredient${i}`]
      }</div>
    `;
    }
  }
  let tag;
  if (meal.strTags) {
    let text = meal.strTags;
    tag = text.split(",");
  } else {
    tag = [];
  }

  let tags = ``;
  for (let i = 0; i < tag.length; i++) {
    tags += `
      <div class="tags-span p-2 rounded-2">${tag[i]}</div>`;
  }
  let cartona = `
  <div class="col-md-4">
            <img
              src="${meal.strMealThumb}"
              class="w-100 rounded-3"
              alt=""
            />
            <h2>${meal.strMeal}</h2>
          </div>
          <div class="col-md-8">
            <h2>instructions</h2>
            <p>
            ${meal.strInstructions}
            </p>
            <h2>Area : ${meal.strArea}</h2>
            <h2>Category : ${meal.strCategory}</h2>
            <h2>Recipes :</h2>
            <div class="recipes-span-list d-flex flex-wrap my-3">
            ${ingredients}
            </div>

            <h2>Tags :</h2>
            <div class="tags-span-list d-flex my-3 ms-2">
            ${tags}
            </div>
            <div class="buttons my-4">
             <a href="${meal.strSource}" target="_blank"> <button class="btn btn-success" >Source</button> </a>
             <a target="_blank" href="${meal.strYoutube}"><button class="btn btn-danger">youtube</button> </a> 
            </div>
          </div>`;
  $("#meal-details-content").html(cartona);
}

/*-------------------------------Nav-Bar----------------------------*/
let toggleNav = 0;
let width = $(".nav-content").width();
function closeNav(width) {
  $("#side-nav").animate({ left: `-${width}` }, 500);
  $("#Toggle-Nav").removeClass("fa-2x fa-x");
  $("#Toggle-Nav").addClass("fa-bars fa-2x");
  for (let i = 1; i <= 5; i++) {
    $(`.nav-list${i}`).removeClass(
      `animate__animated animate__fadeInUpBig animate__delay-${i}s`
    );
  }
  toggleNav = 0;
}
function openNav() {
  $("#side-nav").animate({ left: `0` }, 500);
  $("#Toggle-Nav").removeClass("fa-bars fa-2x");
  $("#Toggle-Nav").addClass("fa-2x fa-x");
  $(".nav-list1").addClass("animate__animated animate__fadeInUpBig");
  for (let i = 1; i <= 5; i++) {
    $(`.nav-list${i}`).addClass(
      `animate__animated animate__fadeInUpBig animate__delay-${i}s`
    );
  }
  toggleNav = 1;
}

$("#Toggle-Nav").click(function () {
  if (toggleNav == 1) {
    closeNav(width);
  } else {
    openNav();
  }
});
function displayAllNone() {
  $("#Home").css("display", "none");
  $("#search-section").css("display", "none");
  $("#categories-section").css("display", "none");
  $("#category-based-section").css("display", "none");
  $("#meal-details").css("display", "none");
  $("#area-based-section").css("display", "none");
  $("#area-section").css("display", "none");
  $("#ingredients-section").css("display", "none");
  $("#ingredients-based-section").css("display", "none");
  $("#contact-us").css("display", "none");
}

/*Home*/
getApi("", "home-content");

/*---------------------------------Category--------------------------------*/
async function getCategoryApi() {
  $(".category-loading-screen").fadeIn(500);
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let data = await response.json();

  diplayCategories(data.categories);
  $(".category-loading-screen").fadeOut(500);
}
function getCategoryMeal(category) {
  displayAllNone();

  $("#category-based-section").css("display", "block");

  getMealsByCategoryApi(category);
  closeNav(width);
}

$("#categories").click(function () {
  displayAllNone();
  $("#categories-section").css("display", "block");
  closeNav(width);
  getCategoryApi();
});

function diplayCategories(categories) {
  let cartona = ``;
  for (let i = 0; i < categories.length; i++) {
    cartona += `
    <div
    id="category-element"
    class="col-md-3 position-relative rounded-2 overflow-hidden category-card"
    onclick="getCategoryMeal('${categories[i].strCategory}')"
  >
    <img src="${categories[i].strCategoryThumb}" class="w-100" alt="" />
    <div class="category-layer rounded-2">
      <h2>${categories[i].strCategory}</h2>
      <p class="col-md-11 m-auto">
      ${categories[i].strCategoryDescription}
      </p>
    </div>
  </div>
    
    
    `;
  }
  $(".category-content").html(cartona);
}

async function getMealsByCategoryApi(categoryName) {
  $(".category-based-loading-screen").fadeIn(500);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
  );
  let data = await response.json();

  displayMeals(data.meals, "category-based-content");
  $(".category-based-loading-screen").fadeOut(500);
}
/*---------------------------------Search--------------------------------*/
async function getSearchApi(name) {
  $(".search-loading-screen").fadeIn(500);
  if (name.length != 1) {
    response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
    );

    data = await response.json();
  } else {
    response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${name}`
    );

    data = await response.json();
  }

  displayMeals(data.meals, "search-content");
  $(".search-loading-screen").fadeOut(500);
}

$("#search").click(function () {
  $(".search-loading-screen").fadeOut(5);
  displayAllNone();
  $("#search-section").css("display", "block");
  closeNav(width);
});

$("#nameSearch").keyup(function () {
  let name = $("#nameSearch").val();

  getSearchApi(name);
});
$("#letterSearch").keyup(function () {
  let letter = $("#letterSearch").val();

  getSearchApi(letter);
});

$("#meal").click(function (e) {});

/*---------------------------------Area--------------------------------*/
$("#area").click(function () {
  displayAllNone();
  $("#area-section").css("display", "block");
  getAreaApi();
  closeNav(width);
});

async function getAreaApi() {
  $(".area-loading-screen").fadeIn(500);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await response.json();

  displayAreas(data.meals);
  $(".area-loading-screen").fadeOut(500);
}
function displayAreas(Areas) {
  let cartona = ``;
  for (let i = 0; i < Areas.length; i++) {
    cartona += `
    <div class="col-md-3" onclick="getMealsArea('${Areas[i].strArea}')">
    <i class="fa-solid fa-house-laptop fa-4x"></i>
    <h3>${Areas[i].strArea}</h3>
  </div>
    
    
    `;
  }
  $("#area-content").html(cartona);
}

async function getMealsByArea(name) {
  $(".area-based-loading-screen").fadeIn(500);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${name}`
  );
  let data = await response.json();

  displayMeals(data.meals, "area-based-content");
  $("#area-based-section").css("display", "block");
  $(".area-based-loading-screen").fadeOut(500);
}
function getMealsArea(area) {
  displayAllNone();

  $("#area-based-section").css("display", "block");

  getMealsByArea(area);
  closeNav(width);
}

/*---------------------------------Ingredients--------------------------------*/
$("#ingredients").click(function () {
  displayAllNone();
  $("#ingredients-section").css("display", "block");
  getIngredientsApi();
  closeNav(width);
});
async function getIngredientsApi() {
  $(".ingredients-section-loading-screen").fadeIn(500);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await response.json();

  displayingredients(data.meals.slice(0, 20));
  $(".ingredients-section-loading-screen").fadeOut(500);
}

function displayingredients(ingredients) {
  let cartona = ``;

  for (var i = 0; i < ingredients.length; i++) {
    cartona += `
    <div class="col-md-3" onclick="getMealsIngredients('${
      ingredients[i].strIngredient
    }')"
    >
      <i class="fa-solid fa-drumstick-bite fa-4x"></i>
      <h3>${ingredients[i].strIngredient}</h3>
      <p>
        ${ingredients[i].strDescription.split(" ").slice(0, 20).join(" ")}
      </p>
  </div>
    
    
    `;
  }
  $("#ingredients-content").html(cartona);
}

async function getMealsByingredients(name) {
  $(".ingredients-based-loading-screen").fadeIn(500);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${name}`
  );
  let data = await response.json();

  displayMeals(data.meals, "ingredients-based-content");
  // $("#ingredients-based-section").css("display", "block");
  $(".ingredients-based-loading-screen").fadeOut(500);
}
function getMealsIngredients(ingredients) {
  displayAllNone();

  $("#ingredients-based-section").css("display", "block");

  getMealsByingredients(ingredients);
  closeNav(width);
}
/* Contact Us */
$("#contact").click(function () {
  displayAllNone();
  $("#contact-us").css("display", "flex");
  closeNav(width);
});

$("#userName").keyup(function () {
  let value = $(this).val();
  let regex = /^[a-z ,.'-]+$/i;
  let validation = regex.test(value);

  if (validation == false) {
    $("#user-name-alert").css("display", "block");
  } else {
    $("#user-name-alert").css("display", "none");
  }
});
$("#email").keyup(function () {
  let value = $(this).val();
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let validation = regex.test(value);

  if (validation == false) {
    $("#email-alert").css("display", "block");
  } else {
    $("#email-alert").css("display", "none");
  }
});

$("#phoneNumber").keyup(function () {
  let value = $(this).val();
  let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  let validation = regex.test(value);

  if (validation == false) {
    $("#phone-alert").css("display", "block");
  } else {
    $("#phone-alert").css("display", "none");
  }
});
$("#age").keyup(function () {
  let value = $(this).val();
  if (value >= 0 && value <= 150) {
    $("#age-alert").css("display", "none");
  } else {
    $("#age-alert").css("display", "block");
  }
});

$("#userPassword").keyup(function () {
  let value = $(this).val();
  let regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  let validation = regex.test(value);
  console.log(validation);
  if (validation == false) {
    $("#password-alert").css("display", "block");
  } else {
    $("#password-alert").css("display", "none");
  }
});
$("#userRePassword").keyup(function () {
  let passwordValue = $("#userPassword").val();
  let rePasswordValue = $("#userRePassword").val();
  if (rePasswordValue == passwordValue) {
    $("#repassword-alert").css("display", "none");
  } else {
    $("#repassword-alert").css("display", "block");
  }
});
