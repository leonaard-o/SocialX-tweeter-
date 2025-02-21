import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { username: string } } // ✅ Desestructuración correcta
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Not authenticated", status: "error" },
        { status: 401 }
      );
    }

    if (!params?.username) { // ✅ Validación más segura
      return NextResponse.json(
        { message: "Username must be provided", status: "error" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username: params.username,
      },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        email: true,
        dateOfBirth: true,
        emailVerified: true,
        coverImage: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
        followingIds: true,
        hasNotification: true,
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found", status: "error" },
        { status: 404 }
      );
    }

    const followersCount = await prisma.user.count({
      where: {
        followingIds: {
          has: existingUser.id,
        },
      },
    });

    return NextResponse.json({
      message: "User retrieved successfully",
      status: "success",
      data: { ...existingUser, followersCount },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        status: "error",
      },
      { status: 500 }
    );
  }
}
