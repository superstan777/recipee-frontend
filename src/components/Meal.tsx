import React from "react";

interface MealProps {
  meal_type: string | null;
  name: string | null;
  image: string | null;
}

export const Meal: React.FC<MealProps> = ({ meal_type, name, image }) => {
  return (
    <div
      className="meal-card"
      style={{
        position: "relative",
        width: "280px",
        height: "360px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: "#f0f0f0",
      }}
    >
      {/* Zdjęcie jako tło */}
      {image && (
        <img
          src={image}
          alt={name || "Meal"}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            top: 0,
            left: 0,
          }}
        />
      )}

      {/* meal_type na górze */}
      {meal_type && (
        <p
          style={{
            position: "absolute",
            top: "10px",
            left: "12px",
            padding: "4px 8px",
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            fontSize: "0.85rem",
            fontWeight: "600",
            borderRadius: "6px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {meal_type}
        </p>
      )}

      {/* Biały overlay na dole */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "33%", // 1/3 wysokości
          background: "rgba(255,255,255,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          boxSizing: "border-box",
        }}
      >
        {name && (
          <h3
            style={{
              color: "#222",
              fontSize: "1rem",
              fontWeight: "600",
              textAlign: "center",
              margin: 0,
            }}
          >
            {name}
          </h3>
        )}
      </div>
    </div>
  );
};
