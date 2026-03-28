// Returns list of the images, this is written by AI (Claude Haiku 4.5)
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  const galleryPath = join(process.cwd(), 'public/gallery');
  
  try {
    const files = await readdir(galleryPath);
    const images = files
      .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
      .sort();
    
    return Response.json(images);
  } catch (error) {
    return Response.json([], { status: 404 });
  }
}