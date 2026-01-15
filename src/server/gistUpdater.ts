import type { GistData } from './gistService.js';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GIST_ID = process.env.GIST_ID || '';

if (!GITHUB_TOKEN || !GIST_ID) {
  console.warn('⚠️ GITHUB_TOKEN or GIST_ID not set. Gist updates will fail.');
}

export async function updateGist(data: GistData): Promise<boolean> {
  if (!GITHUB_TOKEN || !GIST_ID) {
    console.error('❌ Cannot update Gist: GITHUB_TOKEN or GIST_ID not configured');
    return false;
  }

  try {
    const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        files: {
          'gist-data.json': {
            content: JSON.stringify(data, null, 2)
          }
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to update Gist:', response.status, errorText);
      return false;
    }

    console.log('✅ Gist updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error updating Gist:', error);
    return false;
  }
}
