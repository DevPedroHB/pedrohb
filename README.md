# PedroHB

Quero integrar o Vitest em um monorepo Turborepo usando configurações compartilhadas usando "@vitest/ui" e "vite-tsconfig-paths".

pedrohb/
├─ apps/
│  ├─ web/
│  └─ api/           ← (usa Vitest)
├─ packages/
│  └─ core-ddd/      ← (usa Vitest)
└─ config/
   ├─ biome-config/
   ├─ typescript-config/
   └─ vitest-config/ ← (configurações de Vitest compartilhadas)
