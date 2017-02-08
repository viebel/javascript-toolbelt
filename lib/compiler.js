
tokenizeCharacter = (type, value, input, current) =>
    (value === input[current]) ? [1, {type, value}] : [0, null]

tokenizeParenOpen = (input, current) => tokenizeCharacter('paren', '(', input, current)

tokenizeParenClose = (input, current) => tokenizeCharacter('paren', ')', input, current)

tokenizePattern = (type, pattern, input, current) => {
    let char = input[current];
    let consumedChars = 0;
    if (pattern.test(char)) {
        let value = '';
	while (char && pattern.test(char)) {
	    value += char;
	    consumedChars ++;
	    char = input[current + consumedChars];
	}
	return [consumedChars , { type, value }];
    }
    return [0, null]
}

tokenizeNumber = (input, current) => tokenizePattern("number", /[0-9]/, input, current)

tokenizeName = (input, current) => tokenizePattern("name", /[a-z]/i, input, current)

tokenizeString = (input, current) => {
    if (input[current] === '"') {
	let value = '';
	let consumedChars = 0;
	consumedChars ++;
	char = input[current + consumedChars];
	while (char !== '"') {
            if(char === undefined) {
	        throw new TypeError("unterminated string ");
	    }
	    value += char;
	    consumedChars ++;
	    char = input[current + consumedChars];
	}
	return [consumedChars + 1, { type: 'string', value }];
    }
    return [0, null]
}


skipWhiteSpace = (input, current) =>   (/\s/.test(input[current])) ? [1, null] : [0, null]

tokenizers = [skipWhiteSpace, tokenizeParenOpen, tokenizeParenClose, tokenizeString, tokenizeNumber, tokenizeName];

tokenize_code = (input) => {
    let current = 0;
    let tokens = [];
    while (current < input.length) {
	let tokenized = false;
	tokenizers.forEach(tokenizer_fn => {
	    if (tokenized) {return;}
	    let [consumedChars, token] = tokenizer_fn(input, current);
	    if(consumedChars !== 0) {
		tokenized = true;
		current += consumedChars;
	    }
	    if(token) {
		tokens.push(token);
	    }
	});
	if (!tokenized) {
	    throw new TypeError('I dont know what this character is: ' + char);
	}
    }
    return tokens;
}

parseNumber = (tokens, current) => [current + 1,
                                    {type: 'NumberLiteral',
				     value: tokens[current].value,
				    }]

parseString = (tokens, current) => [current + 1,
                                    {type: 'StringLiteral',
				     value: tokens[current].value,
				    }]

parseExpression =  (tokens, current)  => {
    let token = tokens[++current];
    let node = {
	type: 'CallExpression',
	name: token.value,
	params: [],
    };							
    token = tokens[++current];								  
    while (!(token.type === 'paren' && token.value ===')')) {
	[current, param] = parseToken(tokens, current);
	node.params.push(param);
	token = tokens[current];
    }									
    current++;
    return [current, node];
}

parseToken = (tokens, current) => {
    let token = tokens[current];
    if (token.type === 'number') {
	return parseNumber(tokens, current);
    }
    if (token.type === 'string') {
	return parseString(tokens, current);
    }
    if (token.type === 'paren' && token.value === '(') {
	return parseExpression(tokens, current);
    }
    throw new TypeError(token.type);
}

function parseProgram(tokens) {
    let current = 0;
    let ast = {
	type: 'Program',
	body: [],
    };
    let node = null;
    while (current < tokens.length) {
	[current, node] = parseToken(tokens, current);
	ast.body.push(node);
    }
    return ast;
}

emitNumber = node => node.value

emitString = node =>  `"${node.value}"`

emitProgram = node =>  node.body.map(exp => emitter(exp) + ";").join('\n');

emitExpression = node =>
    `${node.name}(${node.params.map(emitter).join(', ')})`

emitter = node => {
    switch (node.type) {
    case 'Program': return emitProgram(node); 
    case 'CallExpression': return emitExpression(node);
    case 'NumberLiteral': return emitNumber(node);
    case 'StringLiteral': return emitString(node); 
    default:
	throw new TypeError(node.type);
    }
}
