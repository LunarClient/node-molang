var MoLang=function(e){"use strict";const t={"!":"BANG","!=":"NOT_EQUALS","&&":"AND","(":"LEFT_PARENT",")":"RIGHT_PARENT","*":"ASTERISK","+":"PLUS",",":"COMMA","-":"MINUS","/":"SLASH",":":"COLON",";":"SEMICOLON","<":"SMALLER","<=":"SMALLER_OR_EQUALS","=":"ASSIGN","==":"EQUALS",">":"GREATER",">=":"GREATER_OR_EQUALS","?":"QUESTION","??":"NULLISH_COALESCING","[":"ARRAY_LEFT","]":"ARRAY_RIGHT","{":"CURLY_LEFT","||":"OR","}":"CURLY_RIGHT"},s=new Set(["return","continue","break","for_each","loop","false","true"]);class r{constructor(e,t,s,r){this.type=e,this.text=t,this.startColumn=s,this.startLine=r}getType(){return this.type}getText(){return this.text}getPosition(){return{startColumn:this.startColumn,startLineNumber:this.startLine,endColumn:this.startColumn+this.text.length,endLineNumber:this.startLine}}}class i{constructor(e){this.i=0,this.currentColumn=0,this.currentLine=0,this.lastColumns=0,this.keywordTokens=e?new Set([...s,...e]):s}init(e){this.currentLine=0,this.currentColumn=0,this.lastColumns=0,this.i=0,this.expression=e}next(){for(this.currentColumn=this.i-this.lastColumns;this.i<this.expression.length&&(" "===this.expression[this.i]||"\t"===this.expression[this.i]||"\n"===this.expression[this.i]);)"\n"===this.expression[this.i]&&(this.currentLine++,this.currentColumn=0,this.lastColumns=this.i+1),this.i++;if("#"===this.expression[this.i]){const e=this.expression.indexOf("\n",this.i+1);return this.i=-1===e?this.expression.length:e,this.currentLine++,this.lastColumns=this.i+1,this.currentColumn=0,this.next()}let e=this.i+1<this.expression.length?t[this.expression[this.i]+this.expression[this.i+1]]:void 0;if(e)return this.i++,new r(e,this.expression[this.i-1]+this.expression[this.i++],this.currentColumn,this.currentLine);if(e=t[this.expression[this.i]],e)return new r(e,this.expression[this.i++],this.currentColumn,this.currentLine);if(this.isLetter(this.expression[this.i])){let e=this.i+1;for(;e<this.expression.length&&(this.isLetter(this.expression[e])||this.isNumber(this.expression[e])||"_"===this.expression[e]||"."===this.expression[e]);)e++;const t=this.expression.substring(this.i,e).toLowerCase();return this.i=e,new r(this.keywordTokens.has(t)?t.toUpperCase():"NAME",t,this.currentColumn,this.currentLine)}if(this.isNumber(this.expression[this.i])){let e=this.i+1,t=!1;for(;e<this.expression.length&&(this.isNumber(this.expression[e])||"."===this.expression[e]&&!t);)"."===this.expression[e]&&(t=!0),e++;const s=new r("NUMBER",this.expression.substring(this.i,e),this.currentColumn,this.currentLine);return this.i=e,s}if("'"===this.expression[this.i]){let e=this.i+1;for(;e<this.expression.length&&"'"!==this.expression[e];)e++;e++;const t=new r("STRING",this.expression.substring(this.i,e),this.currentColumn,this.currentLine);return this.i=e,t}return this.hasNext()?(this.i++,this.next()):new r("EOF","",this.currentColumn,this.currentLine)}hasNext(){return this.i<this.expression.length}isLetter(e){return e>="a"&&e<="z"||e>="A"&&e<="Z"}isNumber(e){return e>="0"&&e<="9"}}const n=(e,t)=>e+Math.random()*(t-e),o=(e,t)=>Math.round(e+Math.random()*(t-e)),a={"math.abs":Math.abs,"math.acos":Math.acos,"math.asin":Math.asin,"math.atan":Math.atan,"math.atan2":Math.atan2,"math.ceil":Math.ceil,"math.clamp":(e,t,s)=>"number"!=typeof e||Number.isNaN(e)?t:e>s?s:e<t?t:e,"math.cos":Math.cos,"math.die_roll":(e,t,s)=>{let r=0;for(;0<e;)r+=n(t,s);return r},"math.die_roll_integer":(e,t,s)=>{let r=0;for(;0<e;)r+=o(t,s);return r},"math.exp":Math.exp,"math.floor":Math.floor,"math.hermite_blend":e=>3*e^2-2*e^3,"math.lerp":(e,t,s)=>(s<0?s=0:s>1&&(s=1),e+(t-e)*s),"math.lerp_rotate":(e,t,s)=>{const r=e=>((e+180)%360+180)%360;if((e=r(e))>(t=r(t))){let s=e;e=t,t=s}return t-e>180?r(t+s*(360-(t-e))):e+s*(t-e)},"math.ln":Math.log,"math.max":Math.max,"math.min":Math.min,"math.mod":(e,t)=>e%t,"math.pi":Math.PI,"math.pow":Math.pow,"math.random":n,"math.random_integer":o,"math.round":Math.round,"math.sin":Math.sin,"math.sqrt":Math.sqrt,"math.trunc":Math.trunc};class h{constructor(e){this.initialKeys=new Set,this.env={...a,...this.flattenEnv(e)}}flattenEnv(e,t="",s={}){for(let r in e){if("."===r[1])switch(r[0]){case"q":r="query"+r.substring(1,r.length);break;case"t":r="temp"+r.substring(1,r.length);break;case"v":r="variable"+r.substring(1,r.length);break;case"c":r="context"+r.substring(1,r.length);break;case"f":r="function"+r.substring(1,r.length)}"object"!=typeof e[r]||Array.isArray(e[r])?(s[`${t}${r}`]=e[r],this.initialKeys.add(`${t}${r}`)):this.flattenEnv(e[r],`${t}${r}.`,s)}return s}setAt(e,t){if("."===e[1])switch(e[0]){case"q":e="query"+e.substring(1,e.length);break;case"t":e="temp"+e.substring(1,e.length);break;case"v":e="variable"+e.substring(1,e.length);break;case"c":e="context"+e.substring(1,e.length);break;case"f":e="function"+e.substring(1,e.length)}return this.env[e]=t}getFrom(e){if("."===e[1])switch(e[0]){case"q":e="query"+e.substring(1,e.length);break;case"t":e="temp"+e.substring(1,e.length);break;case"v":e="variable"+e.substring(1,e.length);break;case"c":e="context"+e.substring(1,e.length);break;case"f":e="function"+e.substring(1,e.length)}return this.env[e]}isInitialKey(e){if("."===e[1])switch(e[0]){case"q":e="query"+e.substring(1,e.length);break;case"t":e="temp"+e.substring(1,e.length);break;case"v":e="variable"+e.substring(1,e.length);break;case"c":e="context"+e.substring(1,e.length);break;case"f":e="function"+e.substring(1,e.length)}return this.initialKeys.has(e)}}class c{toString(){return""+this.eval()}walk(e,t=new Set){let s=e(this)??this;return s.iterate(e,t),s}iterate(e,t){for(let s=0;s<this.allExpressions.length;s++){const r=this.allExpressions[s];if(t.has(r))continue;t.add(r);const i=e(r)??r;i!==r&&t.has(i)||(t.add(i),this.setExpressionAt(s,i),i.iterate(e,t))}}}class u extends c{constructor(e){super(),this.value=e,this.type="NumberExpression"}get allExpressions(){return[]}setExpressionAt(){}isStatic(){return!0}eval(){return this.value}}class p extends c{constructor(e,t,s,r){super(),this.left=e,this.right=t,this.operator=s,this.evalHelper=r,this.type="GenericOperatorExpression"}get allExpressions(){return[this.left,this.right]}setExpressionAt(e,t){0===e?this.left=t:1===e&&(this.right=t)}isStatic(){return this.left.isStatic()&&this.right.isStatic()}eval(){return this.evalHelper(this.left,this.right)}toString(){return`${this.left.toString()}${this.operator}${this.right.toString()}`}}class l{constructor(e=0){this.precedence=e}parse(e,t,s){const r=e.parseExpression(this.precedence),i=s.getText();switch(i){case"+":return new p(t,r,i,(e,t)=>{const s=e.eval(),r=t.eval();if("number"!=typeof s&&"boolean"!=typeof s||"number"!=typeof r&&"boolean"!=typeof r)throw new Error(`Cannot use numeric operators for expression "${s} ${i} ${r}"`);return s+r});case"-":return new p(t,r,i,(e,t)=>{const s=e.eval(),r=t.eval();if("number"!=typeof s&&"boolean"!=typeof s||"number"!=typeof r&&"boolean"!=typeof r)throw new Error(`Cannot use numeric operators for expression "${s} ${i} ${r}"`);return s-r});case"*":return new p(t,r,i,(e,t)=>{const s=e.eval(),r=t.eval();if("number"!=typeof s&&"boolean"!=typeof s||"number"!=typeof r&&"boolean"!=typeof r)throw new Error(`Cannot use numeric operators for expression "${s} ${i} ${r}"`);return s*r});case"/":return new p(t,r,i,(e,t)=>{const s=e.eval(),r=t.eval();if("number"!=typeof s&&"boolean"!=typeof s||"number"!=typeof r&&"boolean"!=typeof r)throw new Error(`Cannot use numeric operators for expression "${s} ${i} ${r}"`);return s/r});case"&&":return new p(t,r,i,(e,t)=>e.eval()&&t.eval());case"||":return new p(t,r,i,(e,t)=>e.eval()||t.eval());case"<":return new p(t,r,i,(e,t)=>e.eval()<t.eval());case"<=":return new p(t,r,i,(e,t)=>e.eval()<=t.eval());case">":return new p(t,r,i,(e,t)=>e.eval()>t.eval());case">=":return new p(t,r,i,(e,t)=>e.eval()>=t.eval());case"==":return new p(t,r,i,(e,t)=>e.eval()===t.eval());case"!=":return new p(t,r,i,(e,t)=>e.eval()!==t.eval());case"??":return new p(t,r,i,(e,t)=>e.eval()??t.eval());case"=":return new p(t,r,i,(e,t)=>{if(e.setPointer)return e.setPointer(t.eval()),0;throw Error("Cannot assign to "+e.type)});default:throw new Error("Operator not implemented")}}}var x;!function(e){e[e.SCOPE=1]="SCOPE",e[e.STATEMENT=2]="STATEMENT",e[e.PROPERTY_ACCESS=3]="PROPERTY_ACCESS",e[e.ARRAY_ACCESS=4]="ARRAY_ACCESS",e[e.ASSIGNMENT=5]="ASSIGNMENT",e[e.CONDITIONAL=6]="CONDITIONAL",e[e.NULLISH_COALESCING=7]="NULLISH_COALESCING",e[e.AND=8]="AND",e[e.OR=9]="OR",e[e.COMPARE=10]="COMPARE",e[e.SUM=11]="SUM",e[e.PRODUCT=12]="PRODUCT",e[e.EXPONENT=13]="EXPONENT",e[e.PREFIX=14]="PREFIX",e[e.POSTFIX=15]="POSTFIX",e[e.FUNCTION=16]="FUNCTION"}(x||(x={}));class E extends c{constructor(e,t){super(),this.tokenType=e,this.expression=t,this.type="PrefixExpression"}get allExpressions(){return[this.expression]}setExpressionAt(e,t){this.expression=t}isStatic(){return this.expression.isStatic()}eval(){const e=this.expression.eval();if("number"!=typeof e)throw new Error(`Cannot use "${this.tokenType}" operator in front of ${typeof e} "${e}"`);switch(this.tokenType){case"MINUS":return-e;case"BANG":return!e}}toString(){switch(this.tokenType){case"MINUS":return"-"+this.expression.toString();case"BANG":return"!"+this.expression.toString()}throw new Error(`Unknown prefix operator: "${this.tokenType}"`)}}class g{constructor(e=0){this.precedence=e}parse(e,t){return new E(t.getType(),e.parseExpression(this.precedence))}}class f{constructor(e=0){this.precedence=e}parse(e,t){return new u(Number(t.getText()))}}class m extends c{constructor(e,t,s=!1){super(),this.env=e,this.name=t,this.isFunctionCall=s,this.type="NameExpression"}get allExpressions(){return[]}setExpressionAt(){}isStatic(){return!1}setPointer(e){this.env.setAt(this.name,e)}setFunctionCall(e=!0){this.isFunctionCall=e}setName(e){this.name=e}eval(){const e=this.env.getFrom(this.name);return this.isFunctionCall||"function"!=typeof e?e:e()}toString(){return this.name}}class w extends c{constructor(e,t=!1){super(),this.value=e,this.isReturn=t,this.type="StaticExpression"}get allExpressions(){return[]}setExpressionAt(){}isStatic(){return!0}eval(){return this.value}}class S{constructor(e=0){this.precedence=e}parse(e,t){const s=t.getText();if(e.config.partialResolveOnParse&&e.executionEnv.isInitialKey(s))if(e.match("ASSIGN",!1));else{const t=e.executionEnv.getFrom(s);if(void 0!==t)return new w(t)}return new m(e.executionEnv,s)}}class v extends c{constructor(e,t){super(),this.expression=e,this.brackets=t,this.type="GroupExpression"}get allExpressions(){return[this.expression]}setExpressionAt(e,t){this.expression=t}isStatic(){return this.expression.isStatic()}get isReturn(){return this.expression.isReturn}eval(){return this.expression.eval()}toString(){return`${this.brackets[0]}${this.expression.toString()}${this.brackets[1]}`}}class C{constructor(e=0){this.precedence=e}parse(e,t){const s=e.parseExpression(this.precedence);return e.consume("RIGHT_PARENT"),e.config.keepGroups&&e.config.useOptimizer&&!s.isStatic()?new v(s,"()"):s}}class d extends c{constructor(e,t,s){super(),this.leftExpression=e,this.thenExpression=t,this.elseExpression=s,this.type="TernaryExpression"}get allExpressions(){return this.leftExpression.isStatic()?[this.leftExpression,this.leftExpression.eval()?this.thenExpression:this.elseExpression]:[this.leftExpression,this.thenExpression,this.elseExpression]}setExpressionAt(e,t){0===e?this.leftExpression=t:1===e?this.thenExpression=t:2===e&&(this.elseExpression=t)}get isReturn(){return this.leftResult?this.thenExpression.isReturn:this.elseExpression.isReturn}get isContinue(){return this.leftResult?this.thenExpression.isContinue:this.elseExpression.isContinue}get isBreak(){return this.leftResult?this.thenExpression.isBreak:this.elseExpression.isBreak}isStatic(){return this.leftExpression.isStatic()&&this.thenExpression.isStatic()&&this.elseExpression.isStatic()}eval(){return this.leftResult=this.leftExpression.eval(),this.leftResult?this.thenExpression.eval():this.elseExpression.eval()}toString(){return`${this.leftExpression.toString()}?${this.thenExpression.toString()}:${this.elseExpression.toString()}`}}class R{constructor(e=0){this.precedence=e,this.exprName="Ternary"}parse(e,t,s){let r,i=e.parseExpression(this.precedence);return r=e.match("COLON")?e.parseExpression(this.precedence):new u(0),e.config.useOptimizer&&t.isStatic()?t.eval()?i:r:new d(t,i,r)}}class A extends c{constructor(e){super(),this.expression=e,this.type="ReturnExpression",this.isReturn=!0}get allExpressions(){return[this.expression]}setExpressionAt(e,t){this.expression=t}isStatic(){return!1}eval(){return this.expression.eval()}toString(){return"return "+this.expression.toString()}}class T{constructor(e=0){this.precedence=e}parse(e,t){const s=e.parseExpression(x.STATEMENT+1);return new A(e.match("SEMICOLON",!1)?s:new u(0))}}class N extends c{constructor(e){super(),this.expressions=e,this.type="StatementExpression",this.didReturn=!1,this.wasLoopBroken=!1,this.wasLoopContinued=!1}get allExpressions(){return this.expressions}setExpressionAt(e,t){this.expressions[e]=t}get isReturn(){return this.didReturn}get isBreak(){return!!this.wasLoopBroken&&(this.wasLoopBroken=!1,!0)}get isContinue(){return!!this.wasLoopContinued&&(this.wasLoopContinued=!1,!0)}isStatic(){let e=0;for(;e<this.expressions.length;){if(!this.expressions[e].isStatic())return!1;e++}return!0}eval(){this.didReturn=!1,this.wasLoopBroken=!1,this.wasLoopContinued=!1;let e=0;for(;e<this.expressions.length;){let t=this.expressions[e].eval();if(this.expressions[e].isReturn)return this.didReturn=!0,t;if(this.expressions[e].isContinue)return void(this.wasLoopContinued=!0);if(this.expressions[e].isBreak)return void(this.wasLoopBroken=!0);e++}return 0}getExpression(){return this.expressions[0]}toString(){let e="";for(const t of this.expressions)e+=t.toString()+";";return e}}class b{constructor(e=0){this.precedence=e}parse(e,t,s){if(t.isReturn)return e.match("SEMICOLON"),e.config.useOptimizer&&t.isStatic()&&(t=new w(t.eval())),new N([t]);let r=[t];if(!e.match("CURLY_RIGHT",!1))do{let t=e.parseExpression(this.precedence);if(e.config.useOptimizer&&t.isStatic()){if(e.config.useAgressiveStaticOptimizer&&!t.isReturn)continue;t=new w(t.eval(),t.isReturn)}r.push(t)}while(e.match("SEMICOLON")&&!e.match("EOF")&&!e.match("CURLY_RIGHT",!1));e.match("SEMICOLON");const i=new N(r);return e.config.useOptimizer&&i.isStatic()?new w(i.eval(),i.isReturn):i}}class y extends c{constructor(e){super(),this.name=e,this.type="StringExpression"}get allExpressions(){return[]}setExpressionAt(){}isStatic(){return!0}eval(){return this.name.substring(1,this.name.length-1)}toString(){return this.name}}class L{constructor(e=0){this.precedence=e}parse(e,t){return new y(t.getText())}}class I extends c{constructor(e,t){super(),this.name=e,this.args=t,this.type="FunctionExpression"}get allExpressions(){return[this.name,...this.args]}setExpressionAt(e,t){0===e?this.name=t:e>0&&(this.args[e-1]=t)}isStatic(){return!1}eval(){const e=[];let t=0;for(;t<this.args.length;)e.push(this.args[t++].eval());const s=this.name.eval();if("function"!=typeof s)throw new Error(this.name.toString()+" is not callable!");return s(...e)}toString(){let e=this.name.toString()+"(";for(let t=0;t<this.args.length;t++)e+=`${this.args[t].toString()}${t+1<this.args.length?",":""}`;return e+")"}}class O{constructor(e=0){this.precedence=e}parse(e,t,s){const r=[];if(!t.setFunctionCall)throw new Error(t.type+" is not callable!");if(t.setFunctionCall(!0),!e.match("RIGHT_PARENT")){do{r.push(e.parseExpression())}while(e.match("COMMA"));e.consume("RIGHT_PARENT")}return new I(t,r)}}class P extends c{constructor(e,t){super(),this.name=e,this.lookup=t,this.type="ArrayAccessExpression"}get allExpressions(){return[this.name,this.lookup]}setExpressionAt(e,t){0===e?this.name=t:1===e&&(this.lookup=t)}isStatic(){return!1}setPointer(e){this.name.eval()[this.lookup.eval()]=e}eval(){return this.name.eval()[this.lookup.eval()]}toString(){return`[${this.lookup.toString()}]`}}class k{constructor(e=0){this.precedence=e}parse(e,t,s){const r=e.parseExpression(this.precedence-1);if(!t.setPointer)throw new Error(`"${t.eval()}" is not an array`);if(!e.match("ARRAY_RIGHT"))throw new Error(`No closing bracket for opening bracket "[${r.eval()}"`);return new P(t,r)}}class M{constructor(e=0){this.precedence=e}parse(e,t){let s=e.parseExpression(this.precedence);return e.consume("CURLY_RIGHT"),e.config.keepGroups?new v(s,"{}"):s}}class _ extends c{constructor(e,t){super(),this.count=e,this.expression=t,this.type="LoopExpression"}get allExpressions(){return[this.count,this.expression]}setExpressionAt(e,t){0===e?this.count=t:1===e&&(this.expression=t)}get isReturn(){return this.expression.isReturn}isStatic(){return this.count.isStatic()&&this.expression.isStatic()}eval(){const e=Number(this.count.eval());if(Number.isNaN(e))throw new Error(`First loop() argument must be of type number, received "${typeof this.count.eval()}"`);if(e>1024)throw new Error(`Cannot loop more than 1024x times, received "${e}"`);let t=0;for(;t<e;){t++;const e=this.expression.eval();if(this.expression.isBreak)break;if(!this.expression.isContinue&&this.expression.isReturn)return e}return 0}toString(){return`loop(${this.count.toString()},${this.expression.toString()})`}}class ${constructor(e=0){this.precedence=e}parse(e,t){e.consume("LEFT_PARENT");const s=[];if(e.match("RIGHT_PARENT"))throw new Error("loop() called without arguments");do{s.push(e.parseExpression())}while(e.match("COMMA"));if(e.consume("RIGHT_PARENT"),2!==s.length)throw new Error("There must be exactly two loop() arguments; found "+s.length);return new _(s[0],s[1])}}class U extends c{constructor(e,t,s){if(super(),this.variable=e,this.arrayExpression=t,this.expression=s,this.type="ForEachExpression",!this.variable.setPointer)throw new Error(`First for_each() argument must be a variable, received "${typeof this.variable.eval()}"`)}get isReturn(){return this.expression.isReturn}get allExpressions(){return[this.variable,this.arrayExpression,this.expression]}setExpressionAt(e,t){0===e?this.variable=t:1===e?this.arrayExpression=t:2===e&&(this.expression=t)}isStatic(){return this.variable.isStatic()&&this.arrayExpression.isStatic()&&this.expression.isStatic()}eval(){const e=this.arrayExpression.eval();if(!Array.isArray(e))throw new Error(`Second for_each() argument must be an array, received "${typeof e}"`);let t=0;for(;t<e.length;){this.variable.setPointer?.(e[t++]);const s=this.expression.eval();if(this.expression.isBreak)break;if(!this.expression.isContinue&&this.expression.isReturn)return s}return 0}toString(){return`loop(${this.variable.toString()},${this.arrayExpression.toString()},${this.expression.toString()})`}}class F{constructor(e=0){this.precedence=e}parse(e,t){e.consume("LEFT_PARENT");const s=[];if(e.match("RIGHT_PARENT"))throw new Error("for_each() called without arguments");do{s.push(e.parseExpression())}while(e.match("COMMA"));if(e.consume("RIGHT_PARENT"),3!==s.length)throw new Error("There must be exactly three for_each() arguments; found "+s.length);return new U(s[0],s[1],s[2])}}class G extends c{constructor(){super(),this.type="ContinueExpression",this.isContinue=!0}get allExpressions(){return[]}setExpressionAt(){}isStatic(){return!1}eval(){return 0}toString(){return"continue"}}class H{constructor(e=0){this.precedence=e}parse(e,t){return new G}}class B extends c{constructor(){super(),this.type="BreakExpression",this.isBreak=!0}get allExpressions(){return[]}setExpressionAt(){}isStatic(){return!1}eval(){return 0}isString(){return"break"}}class z{constructor(e=0){this.precedence=e}parse(e,t){return new B}}class Y extends c{constructor(e){super(),this.value=e,this.type="BooleanExpression"}get allExpressions(){return[]}setExpressionAt(){}isStatic(){return!0}eval(){return this.value}}class D{constructor(e=0){this.precedence=e}parse(e,t){return new Y("true"===t.getText())}}class q extends class{constructor(e){this.config=e,this.prefixParselets=new Map,this.infixParselets=new Map,this.readTokens=[],this.lastConsumed=new r("SOF","",0,0),this.tokenIterator=new i}updateConfig(e){this.config=e}init(e){this.tokenIterator.init(e),this.lastConsumed=new r("SOF","",0,0),this.readTokens=[]}setTokenizer(e){this.tokenIterator=e}setExecutionEnvironment(e){this.executionEnv=e}parseExpression(e=0){let t=this.consume();if("EOF"===t.getType())return new u(0);const s=this.prefixParselets.get(t.getType());if(!s)throw new Error(`Cannot parse ${t.getType()} expression "${t.getType()}"`);let r=s.parse(this,t);return this.parseInfixExpression(r,e)}parseInfixExpression(e,t=0){let s;for(;this.getPrecedence()>t;){s=this.consume();const t=this.infixParselets.get(s.getType());t||console.log(s),e=t.parse(this,e,s)}return e}getPrecedence(){const e=this.infixParselets.get(this.lookAhead(0)?.getType());return e?.precedence??0}getLastConsumed(){return this.lastConsumed}consume(e){const t=this.lookAhead(0);if(e){if(t.getType()!==e)throw new Error(`Expected token "${e}" and found "${t.getType()}"`);this.consume()}return this.lastConsumed=this.readTokens.pop(),this.lastConsumed}match(e,t=!0){return this.lookAhead(0).getType()===e&&(t&&this.consume(),!0)}lookAhead(e){for(;e>=this.readTokens.length;)this.readTokens.push(this.tokenIterator.next());return this.readTokens[e]}registerInfix(e,t){this.infixParselets.set(e,t)}registerPrefix(e,t){this.prefixParselets.set(e,t)}getInfix(e){return this.infixParselets.get(e)}getPrefix(e){return this.prefixParselets.get(e)}}{constructor(e){super(e),this.registerPrefix("NAME",new S),this.registerPrefix("STRING",new L),this.registerPrefix("NUMBER",new f),this.registerPrefix("TRUE",new D(x.PREFIX)),this.registerPrefix("FALSE",new D(x.PREFIX)),this.registerPrefix("RETURN",new T),this.registerPrefix("CONTINUE",new H),this.registerPrefix("BREAK",new z),this.registerPrefix("LOOP",new $),this.registerPrefix("FOR_EACH",new F),this.registerInfix("QUESTION",new R(x.CONDITIONAL)),this.registerPrefix("LEFT_PARENT",new C),this.registerInfix("LEFT_PARENT",new O(x.FUNCTION)),this.registerInfix("ARRAY_LEFT",new k(x.ARRAY_ACCESS)),this.registerPrefix("CURLY_LEFT",new M(x.SCOPE)),this.registerInfix("SEMICOLON",new b(x.STATEMENT)),this.registerPrefix("MINUS",new g(x.PREFIX)),this.registerPrefix("BANG",new g(x.PREFIX)),this.registerInfix("PLUS",new l(x.SUM)),this.registerInfix("MINUS",new l(x.SUM)),this.registerInfix("ASTERISK",new l(x.PRODUCT)),this.registerInfix("SLASH",new l(x.PRODUCT)),this.registerInfix("EQUALS",new l(x.COMPARE)),this.registerInfix("NOT_EQUALS",new l(x.COMPARE)),this.registerInfix("GREATER_OR_EQUALS",new l(x.COMPARE)),this.registerInfix("GREATER",new l(x.COMPARE)),this.registerInfix("SMALLER_OR_EQUALS",new l(x.COMPARE)),this.registerInfix("SMALLER",new l(x.COMPARE)),this.registerInfix("AND",new l(x.AND)),this.registerInfix("OR",new l(x.OR)),this.registerInfix("NULLISH_COALESCING",new l(x.NULLISH_COALESCING)),this.registerInfix("ASSIGN",new l(x.ASSIGNMENT))}}class Q{constructor(e=0){this.precedence=e}parse(e,t){if(e.consume("LEFT_PARENT"),e.match("RIGHT_PARENT"))throw new Error("function() called without arguments");let s,r,i=[];do{const t=e.parseExpression();if(t instanceof y)r?i.push(t.eval()):r=t.eval();else{if(!(t instanceof N||t instanceof v))throw new Error(`Unexpected expresion: found "${t.constructor.name}"`);s=t}}while(e.match("COMMA"));if(e.consume("RIGHT_PARENT"),!r)throw new Error(`Missing function() name (argument 1); found "${r}"`);if(!s)throw new Error(`Missing function() body (argument ${i.length+2})`);return new X(e.functions,r,i,s)}}class X extends c{constructor(e,t,s,r){super(),this.functionBody=r,this.type="CustomFunctionExpression",e.set(t,[s,r instanceof v?r.allExpressions[0].toString():r.toString()])}get allExpressions(){return[this.functionBody]}setExpressionAt(e,t){this.functionBody=t}get isReturn(){return!1}isStatic(){return!0}eval(){return 0}}class K{constructor(e={},t={}){this.config=t,this.expressionCache={},this.totalCacheEntries=0,this.parser=new q({...this.config,tokenizer:void 0}),this.executionEnvironment=new h(e)}updateConfig(e){this.config=Object.assign(this.config,e),e.tokenizer&&this.parser.setTokenizer(e.tokenizer),this.parser.updateConfig({...e,tokenizer:void 0})}updateExecutionEnv(e){this.executionEnvironment=new h(e),this.parser.setExecutionEnvironment(this.executionEnvironment)}clearCache(){this.expressionCache={},this.totalCacheEntries=0}execute(e){this.parser.setExecutionEnvironment(this.executionEnvironment);const t=this.parse(e).eval();return void 0===t?0:"boolean"==typeof t?Number(t):t}executeAndCatch(e){try{return this.execute(e)}catch{return 0}}parse(e){if(this.config.useCache??1){const t=this.expressionCache[e];if(t)return t}this.config.partialResolveOnParse&&this.parser.setExecutionEnvironment(this.executionEnvironment),this.parser.init(e);let t=this.parser.parseExpression();return(this.config.useOptimizer??1)&&t.isStatic()&&(t=new w(t.eval())),(this.config.useCache??1)&&(this.totalCacheEntries>(this.config.maxCacheSize||256)&&this.clearCache(),this.expressionCache[e]=t,this.totalCacheEntries++),t}resolveStatic(e){e.walk(e=>{if(e.isStatic())return new w(e.eval())})}getParser(){return this.parser}}class j extends q{constructor(e){super(e),this.functions=new Map,this.registerPrefix("FUNCTION",new Q)}reset(){this.functions.clear()}}return e.CustomMoLang=class{constructor(e){this.parser=new j({useCache:!1,useOptimizer:!0,useAgressiveStaticOptimizer:!0,keepGroups:!0}),this.parser.setExecutionEnvironment(new h(e)),this.parser.setTokenizer(new i(new Set(["function"])))}get functions(){return this.parser.functions}parse(e){this.parser.init(e);return this.parser.parseExpression()}transform(e){const t=new K({},{useCache:!1,keepGroups:!0,useOptimizer:!0,useAgressiveStaticOptimizer:!0});let s=0,r=t.parse(e),i=!1;r instanceof N&&(i=!0);let n=!1;r=r.walk(e=>{if("FunctionExpression"!==e.type)return;const r=e.name.name.replace(/(f|function)\./g,""),i=e.args;let[o,a]=this.functions.get(r)??[];if(!a||!o)return;a=a.replace(/(a|arg)\.(\w+)/g,(e,t,s)=>(i[o.indexOf(s)]?.toString()??"0").replace(/(t|temp)\./,"outer_temp."));let c=function(e){if(e instanceof A)return new v(e.allExpressions[0],"()");if(!(e instanceof N))return e;if(e.allExpressions.length>1)return e;const t=e.allExpressions[0];return t instanceof A?new v(t.allExpressions[0],"()"):e}(t.parse(a));c instanceof N&&(c=t.parse(`({${a}}+t.return_value)`),n=!0);const u=new Map;return c=c.walk(e=>{if(e instanceof m){const t=e.toString();let r=t.split(".");const i=r.shift(),n=r.join(".");if("t"===i||"temp"===i){let r=u.get(t);r||(r="t.scvar"+s++,u.set(t,r)),e.setName(r)}else"outer_temp"===i&&e.setName("t."+n)}else if(e instanceof A){const t=new m(new h({}),"t.return_value"),s=e.allExpressions[0];return new p(t,s,"=",()=>{t.setPointer(s.eval())})}}),c});const o=t.parse(r.toString());return t.resolveStatic(o),!i&&n?`return ${o.toString()};`:o.toString()}reset(){this.functions.clear()}},e.MoLang=K,e.Tokenizer=i,e}({});
