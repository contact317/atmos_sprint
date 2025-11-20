import React from "react";
import RequirementCreate from "./RequirementCreate";

/**
 * For now Update uses the same component but passes 'data' prop.
 * If you want a dedicated Update file with different behaviour, we can expand.
 */
export default function RequirementUpdate({ data, onClose }) {
  return <RequirementCreate data={data} onClose={onClose} />;
}
