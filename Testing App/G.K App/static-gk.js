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
