import { LoginForm } from "./LoginForm";
import { useGetRandomImage } from "../hooks/useGetRandomImage";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const { image, loading, error } = useGetRandomImage();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [image?.url]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div
        className={`flex flex-col gap-4 p-6 md:p-10 transition-transform  duration-700 ease-out
          ${
            imageLoaded
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          }`}
      >
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            Recipee
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      <div className="bg-white relative hidden lg:block overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Ładowanie zdjęcia...
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500">
            Błąd ładowania zdjęcia
          </div>
        )}

        {image && (
          <img
            src={image.url}
            alt="Random meal"
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale
              transition-transform  duration-700 ease-out
              ${
                imageLoaded
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0"
              }`}
            onLoad={() => setImageLoaded(true)}
          />
        )}
      </div>
    </div>
  );
}
