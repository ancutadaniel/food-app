import { API_KEY, API_URL, RES_PER_PAGE } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = data => {
  const { recipe } = data.data;

  // Format response and store state
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    // optional add a key if exist, and spread object {key:recipe.key} => key: recipe.key
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async id => {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);

    // mark recipe as bookmarked
    if (state.bookmarks.some(item => item.id === id)) {
      state.recipe.bookmarked = true;
    } else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        title: rec.title,
        publisher: rec.publisher,
        // optional add a key if exist, and spread object {key:recipe.key} => key: recipe.key
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

// Pagination
export const getSearchResultsPage = (page = state.search.page) => {
  // Keep track of page
  state.search.page = page;

  const start = (page - 1) * RES_PER_PAGE; // 0;
  const end = page * RES_PER_PAGE; // 9;

  return state.search.results.slice(start, end);
};

export const updateServings = servings => {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * servings) / state.recipe.servings;
  });

  state.recipe.servings = servings;
};

export const addBookmark = recipe => {
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistData();
};

export const removeBookmark = id => {
  const index = state.bookmarks.findIndex(item => item.id === id);

  state.bookmarks.splice(index, 1);
  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistData();
};

const persistData = () =>
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));

const init = () => {
  const getBookmarks = JSON.parse(localStorage.getItem('bookmarks'));

  if (getBookmarks) {
    state.bookmarks = getBookmarks;
  }
};
init();

// Uploading Recipe
export const uploadRecipe = async newRecipe => {
  try {
    // Transform data
    const ingredients = Object.entries(newRecipe)
      .filter(el => el.at(0).startsWith('ingredient') && el.at(1) !== '')
      .map(ing => {
        const ingArray = ing
          .at(1)
          .split(',')
          .map(el => el.trim());
        if (ingArray.length !== 3)
          throw new Error(
            `Wrong ingredient format, please use correct format ⛔️`
          );

        const [quantity, unit, description] = ingArray;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    // Send data
  } catch (error) {
    throw error;
  }
};

const clearBookmarks = () => {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
