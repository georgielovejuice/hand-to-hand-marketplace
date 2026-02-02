export async function validateCredentials(parsedObject, userCollection, response) {
  const query = { username: { $eq: parsedObject.username } };

  const userWithMatchingUsername = await userCollection.findOne(query);

  if (!userWithMatchingUsername) {
    response.json({ validCredentials: "Username not found" });
    return;
  }

  if (parsedObject.hashedPassword === userWithMatchingUsername.hashedPassword) {
    response.json({ validCredentials: "OK" });
  } else {
    response.json({ validCredentials: "Incorrect password" });
  }
}

export async function registerUser(parsedObject, userCollection, response) {
  if (parsedObject.username === undefined)
    throw new SyntaxError("JSON missing username");
  if (parsedObject.fullname === undefined)
    throw new SyntaxError("JSON missing fullname");
  if (parsedObject.hashedPassword === undefined)
    throw new SyntaxError("JSON missing hashedPassword");

  const query = { username: { $eq: parsedObject.username } };
  const userWithMatchingUsername = await userCollection.findOne(query);

  if (userWithMatchingUsername) {
    response.json({ registerUserStatus: "Username already exists." });
    return;
  }

  const userDocument = {
    username: parsedObject.username,
    fullname: parsedObject.fullname,
    hashedPassword: parsedObject.hashedPassword,
  };

  const inserted = (await userCollection.insertOne(userDocument)).acknowledged;

  if (inserted) response.json({ registerUserStatus: "OK" });
  else response.json({ registerUserStatus: "Failed to write to database." });
}

export async function queryItems(parsedObject, itemCollection, response) {

  // ---- helpers ----
  function textToSearchTokens(str) {
    return new Set(
      str
        .trim()
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
    );
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
      if (
        hasIntersection(
          textToSearchTokens(item.name),
          searchTokens
        )
      ) {
        result.push(item);
        continue;
      }

      // categories
      const categoriesText = item.categories.join(" ");
      if (
        hasIntersection(
          textToSearchTokens(categoriesText),
          searchTokens
        )
      ) {
        result.push(item);
        continue;
      }

      // details
      if (
        hasIntersection(
          textToSearchTokens(item.details),
          searchTokens
        )
      ) {
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