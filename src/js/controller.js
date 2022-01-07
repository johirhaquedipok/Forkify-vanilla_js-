'use strict';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import recipeView from './view/recipeView';
import searchView from './view/searchView';
import resultsView from './view/resultsView';
import bookmarksView from './view/bookmarksView';
import paginationView from './view/paginationView';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    // 1. Loading recipes
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 0) Update Results view to mark selected search results
    resultsView.update(model.getSearchResultPage());

    bookmarksView.update(model.state.bookmarks);

    // 1) Loading Recipe
    await model.loadRecipe(id);

    const { recipe } = model.state;

    // 2. Rendering Recipe

    recipeView.render(model.state.recipe);
  } catch (err) {
    
    recipeView.renderError();
    console.error(err)
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1. search query
    const query = searchView.getQuery();
    if (!query) return;
    //2. Load serach result
    await model.loadSearchResults(query);

    // 3. render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    // 4. initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotoPage) {
  // 1. render new results
  resultsView.render(model.getSearchResultPage(gotoPage));

  // 2.  render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
