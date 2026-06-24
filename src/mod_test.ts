import { assertEquals } from "jsr:@std/assert";
import { assertStringIncludes } from "jsr:@std/assert";
import { template } from "./mod.ts";

const userMessage = [{ role: "user", content: "Hi" }] as const;

Deno.test("kimi-k2.6 renders with correct tokens", () => {
  const result = template("kimi-k2.6").apply({
    messages: [...userMessage],
    add_generation_prompt: true,
  });
  assertStringIncludes(result, "<|im_user|>");
  assertStringIncludes(result, "<|im_assistant|>");
  assertStringIncludes(result, "<think>");
});

Deno.test("kimi-k2.6 supports thinking=false", () => {
  const result = template("kimi-k2.6").apply({
    messages: [...userMessage],
    add_generation_prompt: true,
    thinking: false,
  });
  assertStringIncludes(result, "<think></think>");
});

Deno.test("kimi-k2.7-code renders with correct tokens", () => {
  const result = template("kimi-k2.7-code").apply({
    messages: [...userMessage],
    add_generation_prompt: true,
  });
  assertStringIncludes(result, "<|im_user|>");
  assertStringIncludes(result, "<|im_assistant|>");
  assertStringIncludes(result, "<think>");
});

Deno.test("glm-5.2 renders with correct tokens", () => {
  const result = template("glm-5.2").apply({
    messages: [...userMessage],
    add_generation_prompt: true,
  });
  assertStringIncludes(result, "[gMASK]<sop>");
  assertStringIncludes(result, "<|user|>");
  assertStringIncludes(result, "<|assistant|>");
});

Deno.test("glm-5.2 supports reasoning_effort", () => {
  const result = template("glm-5.2").apply({
    messages: [...userMessage],
    add_generation_prompt: true,
    reasoning_effort: "high",
  });
  assertStringIncludes(result, "Reasoning Effort: High");
});

Deno.test("multi-turn conversation renders all messages", () => {
  const messages = [
    { role: "user", content: "Hello" },
    { role: "assistant", content: "Hi there!" },
    { role: "user", content: "How are you?" },
  ];
  const result = template("kimi-k2.6").apply({
    messages,
    add_generation_prompt: true,
  });
  const userCount = result.split("<|im_user|>").length - 1;
  assertEquals(userCount, 2);
  assertStringIncludes(result, "Hi there!");
});
