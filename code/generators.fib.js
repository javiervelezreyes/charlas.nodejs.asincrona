function* fibonacci () {
	var a = 1;
	var b = 0;
	var aux;
    while (true) {
    	aux = a + b;
    	a   = b;
    	b   = aux;
    	var reset = yield b;
    	if (reset) {
    		a = 1;
    		b = 0;
    	}
    }
}

var fib = fibonacci ();
for (var index = 0; index < 10; index ++) {
	var nextFib = fib.next ();
	console.log (nextFib.value);
}

console.log (fib.next ().value);
console.log (fib.next (true).value);
console.log (fib.next ().value);
