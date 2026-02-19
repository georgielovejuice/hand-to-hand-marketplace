export async function uploadImageToS3({ token, apiUrl, purpose, file }) {
  if (!file) {
    throw new Error("No file provided");
  }

  const presignResponse = await fetch(`${apiUrl}/uploads/presign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token
    },
    body: JSON.stringify({
      purpose,
      contentType: file.type,
      fileName: file.name
    })
  });

  const presignBody = await presignResponse.json();
  if (!presignResponse.ok) {
    throw new Error(presignBody.message || "Failed to create upload URL");
  }

  const formData = new FormData();
  
  for (const [key, value] of Object.entries(presignBody.fields)) {
    formData.append(key, value);
  }

  formData.append("file", file);

  const uploadResponse = await fetch(presignBody.url, {
    method: "POST",
    body: formData
  });

  if (!uploadResponse.ok) {
    throw new Error("Image upload failed: " + uploadResponse.status);
  }

  return presignBody.key;
}
