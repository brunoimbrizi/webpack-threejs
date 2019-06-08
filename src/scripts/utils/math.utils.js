export const PI = Math.PI;
export const HALF_PI = Math.PI / 2;
export const TWO_PI = Math.PI * 2;
export const QUARTER_PI = Math.PI / 4;
export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

export const clamp = (num, min, max) => {
	if (max < min) {
		const tmax = min;
		min = max;
		max = tmax;
	}

	if (num < min) return min;
	else if (num > max) return max;

	return num;
};

export const lerp = (min, max, amount) => {
	return min + amount * (max - min);
};

export const map = (num, min1, max1, min2, max2, round = false, constrainMin = true, constrainMax = true) => {
	if (constrainMin && num < min1) return min2;
	if (constrainMax && num > max1) return max2;

	const num1 = (num - min1) / (max1 - min1);
	const num2 = (num1 * (max2 - min2)) + min2;
	if (round) return Math.round(num2);
	return num2;
};

export const mod = (n, m) => {
	return ((n % m) + m) % m;
};

export const random = (min, max) => {
	if (Object.prototype.toString.call(min) === '[object Array]') return min[~~(Math.random() * min.length)];

	if (typeof max !== 'number') {
		max = min || 1;
		min = 0;
	}

	return min + Math.random() * (max - min);
};
