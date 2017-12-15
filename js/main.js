// See the following on using objects as key/value dictionaries
// https://stackoverflow.com/questions/1208222/how-to-do-associative-array-hashing-in-javascript

var words = {  ".":popPrint, ".s":printStack, ">":greater, "<":lesser, "=":equal, "+":stackAdd, "-":stackSub, "*":stackMult, "/":stackDiv, "drop":drop, "swap":swap, "nip":nip, "over":over, "dup":dup, "tuck":tuck };


//making the terminal global for the benefit of popPrint and printStack functions
var terminal = new Terminal();
    terminal.setHeight("400px");
    terminal.blinkingCursor(true);

/** 
 * Your thoughtful comment here.
 */
 
var resetButton = $("#reset"); // resetButton now references 
                               // the HTML button with ID "reset"
                               
  
 
function emptyStack(stack) {
	while (stack.length > 0) {
		stack.pop();
		renderStack(stack);
	}
}



/**
 * Print a string out to the terminal, and update its scroll to the
 * bottom of the screen. You should call this so the screen is
 * properly scrolled.
 * @param {Terminal} terminal - The `terminal` object to write to
 * @param {string}   msg      - The message to print to the terminal
 */
function print(terminal, msg) {
    terminal.print(msg);
    $("#terminal").scrollTop($('#terminal')[0].scrollHeight + 40);
}


/** 
 * Sync up the HTML with the stack in memory
 * @param {Array[Number]} The stack to render
 */
function renderStack(stack) {
    $("#thestack").empty();
    stack.slice().reverse().forEach(function(element) {
        $("#thestack").append("<tr><td>" + element + "</td></tr>");
    });
};


//My functions!

function popPrint(stack) {
	var head = stack.pop();
    print(terminal, head);
}

function printStack(stack) {
	print(terminal, " <" + stack.length + "> " + stack.slice().join(" "));
}

function stackAdd(stack) {
	var first = stack.pop();
	var second = stack.pop();
	stack.push(first + second);
}

function stackSub(stack) {
	var first = stack.pop();
	var second = stack.pop();
	stack.push(first - second);
}

function stackMult(stack) {
	var first = stack.pop();
	var second = stack.pop();
	stack.push(first * second);
}

function stackDiv(stack) {
	var first = stack.pop();
	var second = stack.pop();
	stack.push(first / second);
}

function drop(stack) {
	stack.pop()
}

function swap(stack) {
	var first = stack.pop();
	var second = stack.pop();
	stack.push(first);
	stack.push(second);
}

function nip(stack) {
	var first = stack.pop();
	stack.pop();
	stack.push(first);
}

function dup(stack) {
	var top = stack.pop();
	stack.push(top);
	stack.push(top);
}

function over(stack) {
	var first = stack.pop();
	var second = stack.pop();
	stack.push(second);
	stack.push(first);
	stack.push(second);
}

function greater(stack) {
	var first = stack.pop();
	var second = stack.pop();
	if (first > second) {
		stack.push(-1)
	} else {
		stack.push(0)
	}
}

function lesser(stack) {
	var first = stack.pop();
	var second = stack.pop();
	if (first < second) {
		stack.push(-1)
	} else {
		stack.push(0)
	}
}

function equal(stack) {
	var first = stack.pop();
	var second = stack.pop();
	if (first == second) {
		stack.push(-1)
	} else {
		stack.push(0)
	}
}

function tuck(stack) {
	var first = stack.pop();
	var second = stack.pop();
	stack.push(first);
	stack.push(second);
	stack.push(first);
}

/** 
 * Process a user input, update the stack accordingly, write a
 * response out to some terminal.
 * @param {Array[Number]} stack - The stack to work on
 * @param {string} input - The string the user typed
 * @param {Terminal} terminal - The terminal object
 */
 

 
function process(stack, input, terminal) {
    // The user typed a number
    if (!(isNaN(Number(input)))) {
        print(terminal,"pushing " + Number(input));
        stack.push(Number(input));    
    } else if (input in words) {
    	words[input](stack);
    } else {
        print(terminal, ":-( Unrecognized input");
    }
    renderStack(stack);
};



function runRepl(terminal, stack) {
    terminal.input("Type a forth command:", function(line) {
        print(terminal, "User typed in: " + line);
        var array = line.trim().split(" ");
        var arrayLength = array.length;
        var i = 0;
        if (array[0] == ":") {
        	words[array[1]] = function(stack) {
        		var j = 2;
        		while (j < (arrayLength - 1)) {
        			process(stack, array[j], terminal);
        			j++;
        		}
        	}
        } else {
        	while (i < arrayLength) {
        		process(stack, array[i], terminal);
        		i++;
        	}
        }
    	runRepl(terminal, stack);
    })
}


// Whenever the page is finished loading, call this function. 
// See: https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function() {
    
    
    // Find the "terminal" object and change it to add the HTML that
    // represents the terminal to the end of it.
    $("#terminal").append(terminal.html);
    
    var stack = [];

    resetButton.click(function() { emptyStack(stack) });

    print(terminal, "Welcome to HaverForth! v0.1");
    print(terminal, "As you type, the stack (on the right) will be kept in sync");

    runRepl(terminal, stack);
});
