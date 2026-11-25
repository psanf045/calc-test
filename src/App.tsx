import { useEffect, useState } from 'react'
import { calcular } from './calc'
import { db, type Calculo } from './db'

const OPS = ['+', '-', '×', '÷']
const TECLAS = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+']

export default function App() {
  const [expr, setExpr] = useState('')
  const [erro, setErro] = useState('')
  const [historico, setHistorico] = useState<Calculo[]>([])

  async function carregar() {
    setHistorico(await db.calculos.orderBy('criadoEm').reverse().limit(20).toArray())
  }
  useEffect(() => {
    carregar()
  }, [])

  async function igual() {
    try {
      const resultado = String(calcular(expr))
      await db.calculos.add({ expressao: expr, resultado, criadoEm: new Date() })
      setExpr(resultado)
      await carregar()
    } catch (e) {
      setErro(`Não deu pra calcular: ${(e as Error).message}`)
    }
  }

  function tecla(t: string) {
    setErro('')
    if (t === '=') return void igual()
    const ultimo = expr.at(-1) ?? ''
    if (OPS.includes(t)) {
      if (!expr) return
      setExpr(OPS.includes(ultimo) ? expr.slice(0, -1) + t : expr + t)
      return
    }
    if (t === '.') {
      const numeroAtual = expr.split(/[+\-×÷]/).at(-1) ?? ''
      if (numeroAtual.includes('.')) return
      setExpr(expr + (numeroAtual ? '.' : '0.'))
      return
    }
    setExpr(expr + t)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mapa: Record<string, string> = { '*': '×', '/': '÷', Enter: '=', ',': '.' }
      const k = mapa[e.key] ?? e.key
      if (TECLAS.includes(k)) tecla(k)
      else if (e.key === 'Backspace') setExpr((s) => s.slice(0, -1))
      else if (e.key === 'Escape') setExpr('')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  async function limparHistorico() {
    await db.calculos.clear()
    await carregar()
  }

  return (
    <main className="min-h-screen bg-base-200 p-4 sm:p-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 md:flex-row md:items-start">
        <div className="card w-full bg-base-100 shadow-xl md:w-80">
          <div className="card-body gap-4">
            <h1 className="card-title">Calculadora</h1>
            <div className="rounded-box bg-base-300 p-4 text-right font-mono text-3xl break-all min-h-16">
              {expr || '0'}
            </div>
            {erro && <div role="alert" className="alert alert-error alert-soft py-2 text-sm">{erro}</div>}
            <div className="grid grid-cols-4 gap-2">
              <button className="btn btn-error btn-soft col-span-2" onClick={() => { setExpr(''); setErro('') }}>C</button>
              <button className="btn btn-soft col-span-2" onClick={() => setExpr(expr.slice(0, -1))}>⌫</button>
              {TECLAS.map((t) => (
                <button
                  key={t}
                  className={`btn text-lg ${t === '=' ? 'btn-primary' : OPS.includes(t) ? 'btn-secondary btn-soft' : ''}`}
                  onClick={() => tecla(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card flex-1 bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title">Histórico</h2>
              <span className="badge badge-neutral">{historico.length}</span>
            </div>
            {historico.length === 0 ? (
              <p className="text-base-content/60">Nenhum cálculo ainda. Eles ficam gravados no banco do navegador.</p>
            ) : (
              <ul className="list">
                {historico.map((c) => (
                  <li key={c.id} className="list-row cursor-pointer hover:bg-base-200" onClick={() => setExpr(c.resultado)}>
                    <div className="list-col-grow font-mono">
                      {c.expressao} = <strong>{c.resultado}</strong>
                    </div>
                    <div className="text-xs text-base-content/60">
                      {c.criadoEm.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {historico.length > 0 && (
              <div className="card-actions justify-end">
                <button className="btn btn-ghost btn-sm" onClick={limparHistorico}>Limpar histórico</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
