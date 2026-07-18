/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AGENT_MODE: 'static' | 'animated'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
