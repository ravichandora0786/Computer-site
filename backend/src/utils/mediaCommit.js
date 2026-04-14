import fs from 'fs';
import path from 'path';

/**
 * Commits media files from temp storage to a permanent target folder.
 * Parsses the HTML content for /media/temp/ URLs, moves them, and updates the HTML.
 * @param {string} htmlContent - The raw HTML content from the editor.
 * @param {string} targetSubFolder - The permanent subfolder (e.g., 'lesson_content').
 * @returns {string} - The updated HTML content with permanent URLs.
 */
export const commitMedia = (htmlContent, targetSubFolder = 'lesson_content') => {
  if (!htmlContent) return htmlContent;

  const tempFolder = path.join(process.cwd(), 'public', 'media', 'temp');
  const targetFolder = path.join(process.cwd(), 'public', 'media', targetSubFolder);

  // Ensure target folder exists
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  // Regex to find all /media/temp/ URLs from both <img> and <video> tags
  const tempUrlRegex = /\/media\/temp\/([a-zA-Z0-9.\-_]+)/g;
  let match;
  
  // Sanitize absolute URLs to relative paths (e.g., strip http://localhost:5000)
  // This cleans up existing data and ensures portability
  let updatedHtml = htmlContent.replace(/https?:\/\/[a-zA-Z0-9.-]+(:\d+)?\/media\//g, '/media/');

  while ((match = tempUrlRegex.exec(htmlContent)) !== null) {
    const fileName = match[1];
    const tempFilePath = path.join(tempFolder, fileName);
    const targetFilePath = path.join(targetFolder, fileName);

    if (fs.existsSync(tempFilePath)) {
      try {
        // Move the file
        fs.renameSync(tempFilePath, targetFilePath);
        
        // Update the URL in the HTML string
        const oldUrl = `/media/temp/${fileName}`;
        const newUrl = `/media/${targetSubFolder}/${fileName}`;
        
        // Use replace all occurences if multiple tags use the same source (though unlikely in this flow)
        updatedHtml = updatedHtml.split(oldUrl).join(newUrl);
        
        console.log(`Committed media: ${fileName} -> ${targetSubFolder}`);
      } catch (err) {
        console.error(`Failed to commit media file ${fileName}:`, err);
      }
    }
  }

  return updatedHtml;
};

/**
 * Identifies and deletes files that were in the old HTML but are missing in the new one.
 * @param {string} oldHtml - The previous version of the HTML.
 * @param {string} newHtml - The updated version of the HTML.
 * @param {string} targetSubFolder - The permanent subfolder (e.g., 'lesson_content').
 */
export const cleanupOrphanedMedia = (oldHtml, newHtml, targetSubFolder = 'lesson_content') => {
  if (!oldHtml) return;
  const finalHtml = newHtml || "";

  // Regex to find all matching media URLs in the permanent folder (works for img src and video src)
  const mediaUrlRegex = new RegExp(`\\/media\\/` + targetSubFolder + `\\/([a-zA-Z0-9.\\-_]+)`, 'g');
  
  const oldFiles = new Set();
  let match;
  while ((match = mediaUrlRegex.exec(oldHtml)) !== null) {
    oldFiles.add(match[1]); // match[1] is the filename
  }

  const newFiles = new Set();
  while ((match = mediaUrlRegex.exec(finalHtml)) !== null) {
    newFiles.add(match[1]);
  }

  // Files in old but NOT in new
  const orphanedFiles = [...oldFiles].filter(file => !newFiles.has(file));

  orphanedFiles.forEach(fileName => {
    try {
      const filePath = path.join(process.cwd(), 'public', 'media', targetSubFolder, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Physically purged replaced media: ${fileName} from ${targetSubFolder}`);
      }
    } catch (err) {
      console.error(`Failed to purge replaced media file ${fileName}:`, err);
    }
  });
};
