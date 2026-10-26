import { definePlugin } from "@tau/plugins";
import { upload, validate } from "./upload";
import { createGithubForm } from "./form";

declare const __PLUGIN_META__: { id: string; name: string; version: string };

export default definePlugin({
  ...__PLUGIN_META__,
  create: () => ({
    activate(context) {
      context.upload.register({
        id: context.pluginId,
        name: __PLUGIN_META__.name,
        upload: (file, config, signal?: AbortSignal) =>
          upload(
            (input, init) => {
              const sourceSignal =
                init?.signal ?? (input instanceof Request ? input.signal : undefined);
              return context.fetch(input, {
                ...init,
                signal: AbortSignal.any([
                  context.signal,
                  ...(signal ? [signal] : []),
                  ...(sourceSignal ? [sourceSignal] : []),
                ]),
              });
            },
            file,
            config
          ),
      });
      context.settings.register({
        id: "upload",
        title: __PLUGIN_META__.name,
        target: "upload",
        form: (() => {
          const form = createGithubForm(context.fetch, { pathPlaceholder: "uploads", upload: true });
          return {
            ...form,
            beforeSave: async (values, signal) => {
              const prepared = await form.beforeSave!(values, signal);
              validate(prepared);
              return prepared;
            },
          };
        })(),
      });
    },
  }),
});
