import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";

export async function DELETE(
  request: NextRequest,
  context: any
): Promise<NextResponse> {
  const { params } = context as { params: { notificationId: string } };
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const notifId = parseInt(params.notificationId);
    if (isNaN(notifId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.notification.deleteMany({
      where: {
        id: notifId,
        userId: parseInt(session.user.id),
      },
    });

    return NextResponse.json({ message: "Notificación eliminada" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
