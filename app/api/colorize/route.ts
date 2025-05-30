import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function ensureDirectories() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const outputDir = path.join(process.cwd(), 'public', 'colorized');
  
  try {
    await mkdir(uploadDir, { recursive: true });
    await mkdir(outputDir, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDirectories();
    
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Generate unique filename
    const uniqueId = uuidv4();
    const fileExt = file.name.split('.').pop();
    const fileName = `${uniqueId}.${fileExt}`;
    
    // Save paths
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileName);
    const relativePath = `/uploads/${fileName}`;
    const outputFileName = `${uniqueId}_colorized.jpg`;
    const outputPath = path.join(process.cwd(), 'public', 'colorized', outputFileName);
    const outputRelativePath = `/colorized/${outputFileName}`;
    
    // Save the uploaded file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(uploadPath, buffer);
    
    // Run the Python script
    const pythonScript = path.join(process.cwd(), 'Colorizing-black-and-white-images-using-Python-master', 'colorize.py');
    const command = `python "${pythonScript}" --image "${uploadPath}" --output "${outputPath}"`;
    
    await execPromise(command);
    
    return NextResponse.json({ 
      originalImage: relativePath,
      colorizedImage: outputRelativePath
    });
    
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}