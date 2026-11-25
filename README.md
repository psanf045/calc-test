# teste-fig-code

Calculadora simples para testar o **Code layer** do Figma ("Clone repository").

- React + Vite + TypeScript
- Tailwind 4 + [daisyUI 5](https://daisyui.com) para os componentes
- Banco: **IndexedDB** do navegador via [Dexie](https://dexie.org) (`src/db.ts`). Cada `=` grava a conta no histórico. Sem servidor, então roda em qualquer lugar que rode o front.

```bash
pnpm install
pnpm dev
```
