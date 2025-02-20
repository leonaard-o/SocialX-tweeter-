"use server";

import { signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";

export async function doSocialLogin(formData: FormData) {
  const action = formData.get("action") as string;
  await signIn(action, { redirectTo: "/home" });
}

export async function doLogout() {
  await signOut({ redirectTo: "/" });
}

export async function doCredentialLogin(data: { email: string; password: string }) {
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // ✅ Se mantiene para manejar la redirección manualmente
      });
  
      if (!response || response.error) { // ✅ Se valida si `response` es null o contiene un error nuevo
        throw new Error(response?.error || "Invalid credentials"); // ✅ Se lanza un error con un mensaje adecuado
      }
  
      return response;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Login error:", err.message); // ✅ Se agrega log para depuración en consola
      } else {
        console.error("Login error:", err); // ✅ Se agrega log para depuración en consola
      }
      throw new Error("Authentication failed"); // ✅ Mensaje genérico para evitar exponer información sensible
    }
  }
  

export async function ensureUniqueUsername(username: string, maxAttempts = 5) {
  try {
    let attempts = 0;
    const baseUsername = username;
    let user = await prisma.user.findUnique({
      where: { username },
    });

    while (user && attempts < maxAttempts) {
      attempts++; // Incrementamos attempts en cada iteración
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      username = `${baseUsername}${randomNumber}`;
      user = await prisma.user.findUnique({
        where: { username },
      });
    }

    if (attempts >= maxAttempts) {
      throw new Error(
        `Unable to generate a unique username after ${maxAttempts} attempts.`
      );
    }
    return username;
  } catch (error) {
    throw error;
  }
}
