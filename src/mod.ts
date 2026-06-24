import { Template } from "@huggingface/jinja";
import kimiK26Source from "../templates/kimi-k2.6.jinja" with { type: "text" };
import kimiK27CodeSource from "../templates/kimi-k2.7-code.jinja" with {
  type: "text",
};
import glm52Source from "../templates/glm-5.2.jinja" with { type: "text" };

export type Message = {
  role: string;
  content: string | null;
  [k: string]: unknown;
};

interface BaseConfig {
  messages: Message[];
  add_generation_prompt?: boolean;
}

export interface KimiK26Config extends BaseConfig {
  tools?: unknown[];
  tools_ts_str?: string;
  thinking?: boolean;
  preserve_thinking?: boolean;
}

export interface KimiK27CodeConfig extends BaseConfig {
  tools?: unknown[];
  tools_ts_str?: string;
}

export interface Glm52Config extends BaseConfig {
  tools?: unknown[];
  enable_thinking?: boolean;
  reasoning_effort?: "high" | "max";
  clear_thinking?: boolean;
}

export type TemplateMap = {
  "kimi-k2.6": KimiK26Config;
  "kimi-k2.7-code": KimiK27CodeConfig;
  "glm-5.2": Glm52Config;
};

const sources: Record<keyof TemplateMap, string> = {
  "kimi-k2.6": kimiK26Source,
  "kimi-k2.7-code": kimiK27CodeSource,
  "glm-5.2": glm52Source,
};

export function template<M extends keyof TemplateMap>(
  model: M,
): { apply(config: TemplateMap[M]): string } {
  const source = sources[model];
  return {
    apply(config) {
      const tmpl = new Template(source);
      return tmpl.render(config as unknown as Record<string, unknown>);
    },
  };
}
