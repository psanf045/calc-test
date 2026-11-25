// Avalia uma expressão com + − × ÷ respeitando a precedência, sem eval().
export function calcular(expr: string): number {
  const tokens = expr.match(/\d+(?:\.\d+)?|[+\-×÷]/g) ?? []
  if (tokens.length === 0) throw new Error('vazia')
  const nums: number[] = [Number(tokens[0])]
  const ops: string[] = []
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i]
    const n = Number(tokens[i + 1])
    if (Number.isNaN(n)) throw new Error('incompleta')
    if (op === '×') nums.push(nums.pop()! * n)
    else if (op === '÷') {
      if (n === 0) throw new Error('divisão por zero')
      nums.push(nums.pop()! / n)
    } else {
      ops.push(op)
      nums.push(n)
    }
  }
  let total = nums[0]
  ops.forEach((op, i) => (total = op === '+' ? total + nums[i + 1] : total - nums[i + 1]))
  return Math.round(total * 1e10) / 1e10
}
