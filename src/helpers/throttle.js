/**
 * Функция «тормозилка», которая возвращает обёртку, передающую вызов f не чаще, чем раз в ms миллисекунд
 *
 * @param {Function} func Вынкция для исполнения
 * @param {number} ms не чаще, чем раз в ms миллисекунд
 *
 * @see https://learn.javascript.ru/task/throttle
 */
export function throttle(func, ms) {

	var isThrottled = false,
	    savedArgs,
	    savedThis


	function wrapper() {

		if (isThrottled) { // (2)
			savedArgs = arguments
			savedThis = this
			return
		}

		func.apply(this, arguments) // (1)

		isThrottled = true

		setTimeout(function () {
			isThrottled = false // (3)
			if (savedArgs) {
				wrapper.apply(savedThis, savedArgs)
				savedArgs = savedThis = null
			}
		}, ms)
	}


	return wrapper
}


export default throttle