import { RuntimeLoader } from '@rive-app/canvas'
import wasmUrl from '@rive-app/canvas/rive.wasm?url'

// Must run before any Rive instance is created.
RuntimeLoader.setWasmUrl(wasmUrl)
