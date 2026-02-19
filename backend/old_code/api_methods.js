export async function queryItems(parsedObject, itemCollection, response) {
  try {
    if (typeof parsedObject.searchBarText !== "string") {
      return response.status(400).json({ error: "Invalid search text" });
    }
    if (!(parsedObject.query instanceof Object)) {
      return response.status(400).json({ error: "Invalid query" });
    }

    const page = Math.max(1, parseInt(parsedObject.page) || 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    const searchTokens = textToSearchTokens(parsedObject.searchBarText);
    
    let pipeline = [
      { $match: parsedObject.query },
      { $sort: { createdAt: -1 } },
      { $facet: {
          metadata: [{ $count: "total" }],
          items: [{ $skip: skip }, { $limit: limit }]
        }
      }
    ];

    const result = await itemCollection.aggregate(pipeline).toArray();
    const [{ metadata, items }] = result;
    const total = metadata[0]?.total || 0;
    
    const filtered = searchTokens.size === 0 
      ? items 
      : items.filter(item => itemMatchesSearch(item, searchTokens));

    response.json({
      items: filtered,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Query error:", error);
    response.status(500).json({ error: "Search failed" });
  }
}

function textToSearchTokens(str) {
  return new Set(str.trim().toLowerCase().split(" ").filter(Boolean));
}

function itemMatchesSearch(item, searchTokens) {
  const nameTokens = textToSearchTokens(item.name || "");
  const categoryTokens = textToSearchTokens((item.categories || []).join(" "));
  const detailsTokens = textToSearchTokens(item.details || "");
  
  return hasIntersection(nameTokens, searchTokens) ||
         hasIntersection(categoryTokens, searchTokens) ||
         hasIntersection(detailsTokens, searchTokens);
}

function hasIntersection(setA, setB) {
  for (const val of setA) {
    if (setB.has(val)) return true;
  }
  return false;
}