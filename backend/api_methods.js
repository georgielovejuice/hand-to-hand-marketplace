export async function queryItems(parsedObject, itemCollection, response) {
	/*
	Endpoint for returning search/query for Browse Page.
	First it filters items using mongo DB query with the .query attribute;
	then if the .searchBarText is empty, it returns the Items Objects from the query directly.
	If .searchBarText is not empty, every word in it is searched against an item's title, category or details text,
	an item which does not have any word matching to .searchBarText is discarded, others are returned.
	
	Expected parsedObject = {
		searchBarText: str,
		query: {
			(argument for mongoDB .find )
		}
	}
		
	Responds with:
	- HTTP status 200 with {
		[
			{
				...Database Item object which conforms to the client query
			}
			...
		]
	}
	
	- HTTP status 500 for undocumented errors
	
	May throw undocumented exceptions
	*/

  // ---- helpers ----
  function textToSearchTokens(str) {
    return new Set(str.trim().toLowerCase().split(" ").filter(Boolean));
	}

  function hasIntersection(setA, setB) {
    for (const val of setA) {
      if (setB.has(val)) return true;
    }
    return false;
  }

  function returnItemsHavingSearchTokens(items, searchTokens) {
    const result = [];

    for (const item of items) {
      // name
      if (hasIntersection(textToSearchTokens(item.name), searchTokens)){
        result.push(item);
        continue;
      }

      // categories
      const categoriesText = item.categories.join(" ");
      if (hasIntersection(textToSearchTokens(categoriesText), searchTokens)) {
        result.push(item);
        continue;
      }

      // details
      if (hasIntersection(textToSearchTokens(item.details), searchTokens)) {
        result.push(item);
      }
    }

    return result;
  }

  // ---- validation ----
  if (typeof parsedObject.searchBarText !== "string")
    throw new SyntaxError("searchBarText must be string");

  if (!(parsedObject.query instanceof Object))
    throw new SyntaxError("query must be an object");

  // ---- fetch items ----
  const cursor = itemCollection.find(parsedObject.query);
  const items = [];

  for await (const item of cursor) {
    if (typeof item.name !== "string") continue;
    if (!(item.categories instanceof Array)) continue;
    if (typeof item.details !== "string") continue;

    let invalidCategory = false;
    for (const c of item.categories) {
      if (typeof c !== "string") {
        invalidCategory = true;
        continue;
      }
    }
    if (invalidCategory) continue;

    items.push(item);
  }

  // ---- search ----
  const searchTokens = textToSearchTokens(parsedObject.searchBarText);

  if (searchTokens.size === 0) {
    response.json({ items });
  } else {
    response.json({
      items: returnItemsHavingSearchTokens(items, searchTokens),
    });
  }
}