/* ---------- GET MY ITEMS ---------- */
export async function getMyItems(token, API_URL, setError) {
  let res;
  setError("");
  try{
    res = await fetch(`${API_URL}/myitems`, {
      headers: {
        authorization: token
      }
    });
  }catch(err){
    if(err instanceof TypeError){
      setError("Lost connection to server.");
      return null;
    }
    throw err;
  }
  
  try{
    const objectfromResponse = await res.json();
    if(!res.ok){
      setError(objectfromResponse.message || `Received HTTP status ${res.status} from server.`);
      return null;
    }
    
    return objectfromResponse;
  }catch(err){
    if(err instanceof TypeError){
      setError("Could not decode response from server.");
      return null;
    }
    if(err instanceof SyntaxError){
      setError("Could not parse JSON from server.");
      return null;
    }
    throw err;
  }
}

/* ---------- CREATE ITEM ---------- */
export async function createItem(token, item, API_URL) {
  const res = await fetch(`${API_URL}/myitems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token
    },
    body: JSON.stringify(item)
  });

  return res.json();
}

/* ---------- UPDATE ITEM ---------- */
export async function updateItem(token, id, item, API_URL) {
  const res = await fetch(`${API_URL}/myitems/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: token
    },
    body: JSON.stringify(item)
  });

  return res.json();
}

/* ---------- DELETE ITEM ---------- */
export async function deleteItem(token, id, API_URL) {
  let res;
  try{
    res = await fetch(`${API_URL}/myitems/${id}`, {
      method: "DELETE",
      headers: {
        authorization: token
      }
    });
  }catch(err){
    if(err instanceof TypeError)
      return "Could not delete item. Lost connection to server.";
    throw err;    
  }
  
  if(res.ok) return '';
  
  return `Could not delete item.  Received HTTP status ${res.status} from server.`;
}
