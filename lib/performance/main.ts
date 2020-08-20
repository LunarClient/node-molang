//@ts-ignore
import Molang from 'molangjs'
import { execute, clearCache } from '../main'
import { setEnv } from '../env'

const iterations = 10000
const expression =
	'variable.hand_bob = query.life_time < 0.01 ? 0.0 : variable.hand_bob + ((query.is_on_ground && query.is_alive ? math.clamp(math.sqrt(math.pow(query.position_delta(0), 2.0) + math.pow(query.position_delta(2), 2.0)), 0.0, 0.1) : 0.0) - variable.hand_bob) * 0.02;'

const env = {
	'variable.hand_bob': 0,
	'query.life_time': () => 0.1,
	'query.is_on_ground': () => true,
	'query.is_alive': () => true,
	'query.position_delta': () => 2,
}

setEnv(env)
console.log('-- MOLANG --')
console.time('[PARSE & EXECUTE] Raw Performance')
for (let i = 0; i < iterations; i++) {
	execute(expression, false, true)
}
console.timeEnd('[PARSE & EXECUTE] Raw Performance')
clearCache()
console.time('[PARSE & EXECUTE] Default Performance')
for (let i = 0; i < iterations; i++) {
	execute(expression, true, true)
}
console.timeEnd('[PARSE & EXECUTE] Default Performance')
console.time('[EXECUTE] Performance')
for (let i = 0; i < iterations; i++) {
	execute(expression, true, true)
}
console.timeEnd('[EXECUTE] Performance')

console.log('-- MOLANGJS --')
Molang.cache_enabled = false
console.time('[PARSE & EXECUTE] Raw Performance')
for (let i = 0; i < iterations; i++) {
	Molang.parse(expression, env)
}
console.timeEnd('[PARSE & EXECUTE] Raw Performance')
Molang.cache_enabled = true
console.time('[PARSE & EXECUTE] Default Performance')
for (let i = 0; i < iterations; i++) {
	Molang.parse(expression, env)
}
console.timeEnd('[PARSE & EXECUTE] Default Performance')