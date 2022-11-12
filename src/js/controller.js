import 'core-js/stable'; // Polyfilling
import 'regenerator-runtime/runtime'; // Polyfilling async/await

import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_SEC } from './config';

// Recipe controller
const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);
    // guard clause
    if (!id) return;

    // Render spinner
    recipeView.renderSpinner();

    // Mark search results
    resultsView.update(model.getSearchResultsPage());

    // Updating bookmark
    bookmarksView.update(model.state.bookmarks);

    // Load recipe
    await model.loadRecipe(id);

    // Render
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error);
    recipeView.renderError();
  }
};

// Search Controller
const controllerSearch = async () => {
  try {
    // Load Spinner
    resultsView.renderSpinner();

    // Get Query
    const query = searchView.getQuery();

    if (!query) return;

    // Load search recipes
    await model.loadSearchResults(query);

    // Render Results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // Render the initial pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

// Pagination Controller
const controllerPagination = page => {
  // Render New Results
  resultsView.render(model.getSearchResultsPage(page));

  // Render New pagination
  paginationView.render(model.state.search);
};

// Servings Controller
const controllerServings = serve => {
  // update the recipe servings (in state)
  model.updateServings(serve);
  // update the recipe view DOM algorithm
  recipeView.update(model.state.recipe);
};

// Bookmark Controller
const controllerBookmark = recipe => {
  // Add/remove bookmark
  !recipe.bookmarked
    ? model.addBookmark(recipe)
    : model.removeBookmark(recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controllerRenderBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async recipe => {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(recipe);
    // Render Recipe
    recipeView.render(model.state.recipe);

    // Render success
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

// Publisher subscriber pattern
const init = () => {
  bookmarksView.addHandlerRender(controllerRenderBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controllerServings);
  recipeView.addHandlerBookmark(controllerBookmark);
  searchView.addHandlerSearch(controllerSearch);
  paginationView.addHandlerPagination(controllerPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
