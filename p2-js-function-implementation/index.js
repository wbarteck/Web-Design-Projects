/*
 * Function 1: Return the string "hello world".
 * Yep - that's literally it.
 */

function helloWorld(){
    return "hello world";
}

/*
 * Function 2: Given a number (int or float), square it and convert to string.
 * Return the string.
 * Examples:
 *  5 -> '25'
 *  1.2 -> '1.44'
 */

function squareToString(num){
    return (num*num).toString();
}

/*
 * Function 3: Reverse a string. We will only give you strings as input.
 * Examples:
 *  'hello' -> 'olleh'
 *  'fdas' -> 'sadf'
 */

function reverseString(str){
		return str.split("").reverse().join("");
}

 /*
  * Function 4: Given a dictionary, compute the average length of the values.
  * If a value is an integer, covert it to a string, and use the length of the
  * converted string in your computation.
  * Example:
  *     {
  *         'hello': 'world',
  *         'ishaan': 'parikh',
  *         'sashi': 'thupu',
  *         2:'hi',
  *         3: 51
  *     }
  * ^ This will return 4.0.
  */

 function avgLenOfVals(dict){
    var avg = 0;
		var n = 0;
		for (var key in dict) {
			if (dict[key] != null) {
				avg = avg + dict[key].toString().length;
				n = n+1;
				b=false;
		 }
		}
		if (n>0 && avg>0)
			return avg / n;
		return 0;
 }

/*
 * Function 5: Given a string that has comma + whitespace
 *     separated values, and creates an array containing all the elements.
 *      Example:
 *          'hello, my,   name, is ,nelsOn' ->
 *          ['hello','my','name','is','nels0n']
 *      Then, apply the second argument of the function (another function)
 *      to each element in the array. Return this result.
 *      You will have to write your own tests to see if this function works.
 *
 */

function applyFunToArray(str, fun){
    var arr = str.match(/\b(\w+)\b/g);
		return fun(arr);
}

module.exports = {
    helloWorld: helloWorld,
    squareToString: squareToString,
    reverseString: reverseString,
    avgLenOfVals: avgLenOfVals,
    applyFunToArray: applyFunToArray
}
