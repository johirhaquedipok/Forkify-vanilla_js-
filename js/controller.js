import * as model from './model.js'
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import resultsView from './view/resultsView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    
    if (!id) return;

    recipeView.renderSpinner();

    // 1.load recipe
    await model.loadRecipe(id);

    // 2. Rendering Recipe

    recipeView.render(model.state.recipe)
  }
  catch (err) {
    recipeView.renderError()
  }
};

const controlSearchResults = async function () {
  try {

    resultsView.renderSpinner();
    // 1. get search query

    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load Serach result
    await model.loadSearchResults(query);

    // 3. render results
    console.log(model.state.search.results);
    resultsView.render(model.state.search.results);
  } 
  catch (err) {
    console.log(err)
  }
};

 const init = function () {
   recipeView.addHandlerRender(controlRecipes);
   searchView.addHandlerSearch(controlSearchResults);
 };

 init();