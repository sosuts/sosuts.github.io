const { Client } = require("@notionhq/client");
// require("dotenv").config();

const handler = async (event) => {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const databaseId = process.env.NOTION_DATABASE_ID;
  const response = await notion.databases.query({
    database_id: databaseId,
  });
  // extract title column from the response
  const titles = response.results.map(
    (page) => page.properties.Title.title[0].text.content,
  );
  const subTitles = response.results.map(
    (page) => page.properties.Subtitle.rich_text[0].text.content,
  );

  // concat title and subtitle. remove the string "undefined"
  const titleAndSubTitle = titles.map((title, index) => {
    const subTitle = subTitles[index] || "";
    const mixedTitle = `${title} - ${subTitle}`;
    // remove the string " - undefined"
    return mixedTitle.replace(" - undefined", "");
  });
  return {
    statusCode: 200,
    // return title and subtitle as JSON with utf-8
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ 1: 2, firstName: titleAndSubTitle[1] }),
  };
};

// const notion = new Client({ auth: process.env.NOTION_API_KEY });

// // Get the Notion database with arrow function
// (async () => {
//   const databaseId = process.env.NOTION_DATABASE_ID;
//   const response = await notion.databases.query({
//     database_id: databaseId,
//   });
//   // extract title column from the response
//   const titles = response.results.map(
//     (page) => page.properties.Title.title[0].text.content,
//   );
//   const subTitles = response.results.map(
//     (page) => page.properties.Subtitle.rich_text[0].text.content,
//   );

//   // concat title and subtitle. remove the string "undefined"
//   const titleAndSubTitle = titles.map((title, index) => {
//     const subTitle = subTitles[index] || "";
//     const mixedTitle = `${title} - ${subTitle}`;
//     // remove the string " - undefined"
//     return mixedTitle.replace(" - undefined", "");
//   });
//   console.log(JSON.stringify(titleAndSubTitle, null, 2));
//   // console.log(JSON.stringify(response.results, null, 2));
// })();

// // async function getNotionDatabase() {
// //   const databaseId = process.env.NOTION_DATABASE_ID;
// //   const response = await notion.databases.query({
// //     database_id: databaseId,
// //   });
// //   return response.results;
// // }

// // getNotionDatabase().then((response) => {
// //   console.log(JSON.stringify(response, null, 2));
// // });

module.exports = { handler };
