// Utility for uploading files to Backblaze B2
// Requires env vars in .env.local:
// B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_ID, B2_BUCKET_NAME

import axios from 'axios';

const B2_API_URL = 'https://api.backblazeb2.com/b2api/v2';

export async function uploadToBackblaze(file: File): Promise<string> {
  // Get credentials from env
  const keyId = process.env.B2_KEY_ID;
  const appKey = process.env.B2_APPLICATION_KEY;
  const bucketId = process.env.B2_BUCKET_ID;
  const bucketName = process.env.B2_BUCKET_NAME;
  if (!keyId || !appKey || !bucketId || !bucketName) {
    throw new Error('Missing Backblaze B2 credentials in .env.local');
  }

  // 1. Authorize account
  const authRes = await axios.get(`${B2_API_URL}/b2_authorize_account`, {
    auth: {username: keyId, password: appKey},
  });
  const {apiUrl, authorizationToken} = authRes.data;

  // 2. Get upload URL
  const uploadRes = await axios.post(
    `${apiUrl}/b2api/v2/b2_get_upload_url`,
    {bucketId},
    {headers: {Authorization: authorizationToken}},
  );
  const {uploadUrl, authorizationToken: uploadToken} = uploadRes.data;

  // 3. Upload file
  const fileName = `${Date.now()}-${file.name}`;
  const uploadFileRes = await axios.post(uploadUrl, file, {
    headers: {
      Authorization: uploadToken,
      'X-Bz-File-Name': encodeURIComponent(fileName),
      'Content-Type': file.type,
      'X-Bz-Content-Sha1': 'do_not_verify',
    },
  });

  // 4. Return public URL
  return `https://f${bucketId}.backblazeb2.com/file/${bucketName}/${fileName}`;
}
