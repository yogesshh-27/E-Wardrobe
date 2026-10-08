import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@backend/security/auth';
import { FolderCreateSchema } from '@backend/security/validation';
import { getUserFolders, createFolder } from '@backend/folders/folderService';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    const folders = await getUserFolders(session.userId);
    return NextResponse.json({ success: true, data: folders });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.statusCode || 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    const body = await req.json();
    const validated = FolderCreateSchema.parse(body);

    const newFolder = await createFolder(session.userId, validated.name, validated.icon);
    return NextResponse.json({ success: true, data: newFolder }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.statusCode || 400 }
    );
  }
}
