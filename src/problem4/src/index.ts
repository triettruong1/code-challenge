// Traditional for loops
function sum_to_n_a(n: number): number {
	let sum = 0
	for (let index = 1; index <= n; index++) {
		sum += index
	}

	return sum
}

// Recursion
function sum_to_n_b(n: number): number {
	if (n === 0) {
		return n
	}

	return sum_to_n_b(n - 1) + n
}

// Equation
function sum_to_n_c(n: number): number {
	return (n * (n + 1)) / 2
}
