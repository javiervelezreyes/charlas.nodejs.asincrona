var co = function (codeGen) {
    var code = codeGen ();
    function aux (thunk) {
        if (thunk.done) return thunk.value;
        else {
            thunk.value (function (error, data){
                aux (code.next (data));
            });
        }  
    }
    return function () {
        aux (code.next ());
    };
};

function add (x, y) {

    return function (callback) {

        callback (null, x + y);
    };
}

function sub (x, y) {

    return function (callback) {

        callback (null, x - y);
    };
}

co (function* (){
    var r1 = yield add (2,3);
    var r2 = yield sub (3,4);
    console.log (r1, r2);
})();

