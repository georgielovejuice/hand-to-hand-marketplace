import mongoClient from "../database.js";

async function setupIndexes() {
  try {
    await mongoClient.connect();
    
    const userDB = mongoClient.db("User");
    const itemDB = mongoClient.db("Item");
    
    console.log("Creating database indexes...");
    
    // User indexes
    await userDB.collection("User").createIndex({ email: 1 }, { unique: true });
    console.log("✓ User.email index");
    
    // Item indexes - critical for browse performance
    await itemDB.collection("Item").createIndex({ userId: 1 });
    console.log("✓ Item.userId index");
    
    await itemDB.collection("Item").createIndex({ categories: 1 });
    console.log("✓ Item.categories index");
    
    await itemDB.collection("Item").createIndex({ createdAt: -1 });
    console.log("✓ Item.createdAt index");
    
    console.log("All indexes created successfully\n");
    process.exit(0);
  } catch (error) {
    console.error("Index creation failed:", error.message);
    process.exit(1);
  }
}

setupIndexes();
