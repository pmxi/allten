class Rational {
    constructor(numerator, denominator = 1) {
        if (denominator === 0) throw new Error("Denominator must not be zero");
        const gcd = Rational.gcd(Math.abs(numerator), Math.abs(denominator));
        numerator = numerator / gcd;
        denominator = denominator / gcd;
        if (denominator < 0) {
            numerator *= -1;
            denominator *= -1;
        }
        this.numerator = numerator;
        this.denominator = denominator;
    }

    static gcd(a, b) {
        while (b !== 0) {
            const t = b;
            b = a % b;
            a = t;
        }
        return a;
    }

    add(other) {
        const num = this.numerator * other.denominator + other.numerator * this.denominator;
        const den = this.denominator * other.denominator;
        return new Rational(num, den);
    }

    subtract(other) {
        const num = this.numerator * other.denominator - other.numerator * this.denominator;
        const den = this.denominator * other.denominator;
        return new Rational(num, den);
    }

    multiply(other) {
        const num = this.numerator * other.numerator;
        const den = this.denominator * other.denominator;
        return new Rational(num, den);
    }

    divide(other) {
        if (other.numerator === 0) throw new Error("Division by zero");
        const num = this.numerator * other.denominator;
        const den = this.denominator * other.numerator;
        return new Rational(num, den);
    }

    equals(other) {
        return (this.numerator === other.numerator) && (this.denominator === other.denominator);
    }
}

/**
 * 
 * @param {Array<Number>} given Array of 4 numbers in [1,10]
 * @param {Number} target number in [1,10]
 * @returns {String|null} Expression that equals the target or null if no such expression exists
 */
function representTarget(given, target) {
    const initialNumbers = given.map(num => new Rational(num));
    const initialExprs = given.map(num => num.toString());
    const targetRational = new Rational(target);

    function helper(nums, exprs) {
        if (nums.length === 1) {
            return nums[0].equals(targetRational) ? exprs[0] : null;
        }

        for (let i = 0; i < nums.length; i++) {
            for (let j = 0; j < nums.length; j++) {
                if (i === j) continue;
                const a = nums[i];
                const b = nums[j];
                const expA = exprs[i];
                const expB = exprs[j];

                const newNums = nums.filter((_, idx) => idx !== i && idx !== j);
                const newExprs = exprs.filter((_, idx) => idx !== i && idx !== j);

                // Addition
                const addRes = a.add(b);
                const addExpr = `(${expA}+${expB})`;
                let result = helper([...newNums, addRes], [...newExprs, addExpr]);
                if (result) return result;

                // Subtraction a - b
                const subRes = a.subtract(b);
                const subExpr = `(${expA}-${expB})`;
                result = helper([...newNums, subRes], [...newExprs, subExpr]);
                if (result) return result;

                // Subtraction b - a
                const subRevRes = b.subtract(a);
                const subRevExpr = `(${expB}-${expA})`;
                result = helper([...newNums, subRevRes], [...newExprs, subRevExpr]);
                if (result) return result;

                // Multiplication
                const mulRes = a.multiply(b);
                const mulExpr = `(${expA}*${expB})`;
                result = helper([...newNums, mulRes], [...newExprs, mulExpr]);
                if (result) return result;

                // Division a / b
                if (b.numerator !== 0) {
                    try {
                        const divRes = a.divide(b);
                        const divExpr = `(${expA}/${expB})`;
                        result = helper([...newNums, divRes], [...newExprs, divExpr]);
                        if (result) return result;
                    } catch (e) {
                        // Skip division by zero
                    }
                }

                // Division b / a
                if (a.numerator !== 0) {
                    try {
                        const divRevRes = b.divide(a);
                        const divRevExpr = `(${expB}/${expA})`;
                        result = helper([...newNums, divRevRes], [...newExprs, divRevExpr]);
                        if (result) return result;
                    } catch (e) {
                        // Skip division by zero
                    }
                }
            }
        }

        return null;
    }

    return helper(initialNumbers, initialExprs);
}



// on submit event, solve
document.getElementById("givensubmit").addEventListener("click", (e) => {
    e.preventDefault();
    const g1 = Number(document.getElementById("g1").value);
    const g2 = Number(document.getElementById("g2").value);
    const g3 = Number(document.getElementById("g3").value);
    const g4 = Number(document.getElementById("g4").value);
    const givens = [g1, g2, g3, g4];
    console.log(givens);
    const resultElement = document.getElementById("soln");
    resultElement.innerHTML = "";
    for (let target = 1; target <= 10; target++) {
        const expression = representTarget(givens, target);
        if (expression === null) {
            const displaystring = `No solution found for ${target}`;
        }
        else {
            displaystring = `${expression} = ${target}`;
        }
        const expressionElement = document.createElement("p");
        expressionElement.appendChild(document.createTextNode(displaystring));
        resultElement.appendChild(expressionElement);
    }
});