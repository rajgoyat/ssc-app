// Combines category files for the Static GK quiz.
const staticGKCategories = {
  Rivers: staticRiversQuestions,
  Songs: staticSongsQuestions,
  History: staticHistoryQuestions,
  General: staticGeneralQuestions,
  Festival: staticFestivalQuestions,
  Polity: staticPolityQuestions,
  Economics: staticEconomicsQuestions,
  Biology: staticBiologyQuestions,
  TestQuestions: testQuestions,
  Book_Author: staticBooksAuthorsQuestions,
  Ramsar_Site: staticWetlandQuestions,
  Sports: staticSportsQuestions,
  Geography: staticGeographyQuestions,
  Dances: staticDanceQuestions,
  Gov_Schemes: staticGovSchemes,

};
const staticGKQuestions = Object.values(staticGKCategories).flat();

/* AUTO STATIC SOURCE START: staticComplete.js */
if (typeof staticStaticCompleteQuestions !== "undefined") {
  if (typeof staticGKQuestions !== "undefined" && Array.isArray(staticGKQuestions)) {
    staticStaticCompleteQuestions.forEach((item) => {
      if (!staticGKQuestions.some((question) => question && question.id === item.id)) {
        staticGKQuestions.push(item);
      }
    });
  }

  if (
    typeof staticGKCategories !== "undefined" &&
    staticGKCategories &&
    typeof staticGKCategories === "object"
  ) {
    staticGKCategories["Static Complete"] = staticStaticCompleteQuestions;
  }
}
/* AUTO STATIC SOURCE END: staticComplete.js */

/* AUTO STATIC SOURCE START: miliatry-exercises.js */
if (typeof staticMiliatryExercisesQuestions !== "undefined") {
  if (typeof staticGKQuestions !== "undefined" && Array.isArray(staticGKQuestions)) {
    staticMiliatryExercisesQuestions.forEach((item) => {
      if (!staticGKQuestions.some((question) => question && question.id === item.id)) {
        staticGKQuestions.push(item);
      }
    });
  }

  if (
    typeof staticGKCategories !== "undefined" &&
    staticGKCategories &&
    typeof staticGKCategories === "object"
  ) {
    staticGKCategories["Miliatry Exercises"] = staticMiliatryExercisesQuestions;
  }
}
/* AUTO STATIC SOURCE END: miliatry-exercises.js */

