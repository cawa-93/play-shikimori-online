import {clearString} from '../../src/helpers/clear-string.js'


describe('Clear the string function', () => {

	it('Empty string', () => {
		expect(clearString('')).toEqual('')
	})


	it('AniDUB', () => {
		expect(clearString('AniDUB')).toEqual('anidub')
	})

	it('AniDUB (Lelik_time & Lonely Dragon)', () => {
		expect(clearString('AniDUB (Lelik_time & Lonely Dragon)')).toEqual('anidubleliktimelonelydragon')
	})
})