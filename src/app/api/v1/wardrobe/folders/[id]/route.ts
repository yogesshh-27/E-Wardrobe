import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@backend/security/auth';
import { FolderUpdateSchema } from '@backend/security/validation';
import { updateFolder, deleteFolder } from '@backend/folders/folderService';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    const body = await req.json();
    const validated = FolderUpdateSchema.parse(body);

    const updated = await updateFolder(session.userId, id, validated);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.statusCode || 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    await deleteFolder(session.userId, id);
    return NextResponse.json({ success: true, message: 'Folder deleted successfully' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.statusCode || 400 }
    );
  }
}
