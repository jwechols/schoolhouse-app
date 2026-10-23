// Test-only resolve hook: lets plain node import extensionless .ts siblings.
import { registerHooks } from "node:module";
registerHooks({
  resolve(spec, ctx, next) {
    try { return next(spec, ctx); } catch (e) {
      if (spec.startsWith(".") && !/\.[a-z]+$/.test(spec)) return next(spec + ".ts", ctx);
      throw e;
    }
  },
});
