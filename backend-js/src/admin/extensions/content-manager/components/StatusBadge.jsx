import React from "react";

const recipeStateMap = {
  draft: { color: "#9e9e9e", label: "📝 En cours" },
  saved: { color: "#607d8b", label: "💾 Enregistrée" },
  submitted: { color: "#2196f3", label: "📤 Soumise" },
  approved: { color: "#4caf50", label: "✅ Approuvée" },
  ordered: { color: "#ff9800", label: "🛒 Commandée" },
  completed: { color: "#8bc34a", label: "🍽️ Complète" },
  archived: { color: "#795548", label: "📦 Archivée" },
  rejected: { color: "#f44336", label: "❌ Rejetée" },
};

export const RecipeStateBadge = ({ value }) => {
  const recipeState = recipeStateMap[value] || { color: "#ccc", label: value };

  return (
    <span
      style={{
        backgroundColor: recipeState.color,
        color: "white",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "0.85rem",
        fontWeight: "bold",
        display: "inline-block",
        minWidth: "120px",
        textAlign: "center",
      }}
    >
      {recipeState.label}
    </span>
  );
};
