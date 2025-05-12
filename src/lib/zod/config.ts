import { z } from "zod";

import { zodLocale } from "./locale/pt-br";

z.setErrorMap((issue) => {
  let m = zodLocale[issue.code] as string;

  if (issue.code === "invalid_type") {
    m = m.replace("{issue.expected}", issue.expected);
    m = m.replace("{issue.received}", issue.received);
  }

  if (issue.code === "invalid_literal") {
    m = m.replace("{issue.expected}", JSON.stringify(issue.expected));
  }

  if (issue.code === "unrecognized_keys") {
    m = m.replace("{issue.keys}", issue.keys.join(", "));
  }

  if (issue.code === "invalid_union_discriminator") {
    m = m.replace("{issue.options}", issue.options.join(", "));
  }

  if (issue.code === "invalid_enum_value") {
    m = m.replace("{issue.options}", issue.options.join(", "));
  }

  if (issue.code === "invalid_string" && m) {
    if (typeof issue.validation === "string") {
      m = zodLocale[issue.code]?.[issue.validation] || "String inválida.";
    }
  }

  if (issue.code === "too_small" && m) {
    m = zodLocale[issue.code]?.[issue.type] || "Valor muito pequeno.";
    m = m.replace("{issue.minimum}", issue.minimum.toString());
  }

  if (issue.code === "too_big" && m) {
    m = zodLocale[issue.code]?.[issue.type] || "Valor muito grande.";
    m = m.replace("{issue.maximum}", issue.maximum.toString());
  }

  if (issue.code === "custom") {
    m = m.replace("{issue.message}", issue.message || "");
  }

  if (issue.code === "not_multiple_of") {
    m = m.replace("{issue.multipleOf}", issue.multipleOf.toString());
  }

  return { message: m || "Erro de validação." };
});
