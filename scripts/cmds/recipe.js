const axios = require('axios');

module.exports = {
  config: {
    name: "recipe",
    version: "1.0",
    author: "Nihan",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: ""
    },
    longDescription: {
      en: "al"
    },
    category: "system",
  },
  
  onStart: async function ({ api, event, args }) {
    const { threadID } = event;
    const searchTerm = args.join(" ");

    try {
      const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;

      const response = await axios.get(apiUrl);
      const recipes = response.data.meals;

      if (recipes) {
        const recipe = recipes[0];
        const message = `- Recipe: ${recipe.strMeal}\n  Category: ${recipe.strCategory}\n  Instructions: ${recipe.strInstructions}`;

        api.sendMessage(message, threadID);
      } else {
        api.sendMessage(`No recipe found for "${searchTerm}".`, threadID);
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      api.sendMessage("An error occurred while fetching the recipe.", threadID);
    }
  }
};