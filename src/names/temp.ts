let maxi = 0;
let ans1 = "";

function hasCharacterParity(str: string) {
	const charArray: Array<string> = Array.from(str);

	const charCount: Record<string, number> = charArray.reduce((counts: Record<string, number>, char: string) => {
		counts[char] = (counts[char] ?? 0) + 1;
		return counts;
	}, {});

	return Object.keys(charCount).every(char => charCount[char] % 2 == 0);
}
 
// Function to find the longest
// concatenated string having
// every character of even frequency
function longestString(arr, index, str) {
  // Checking the string
  if (index == arr.length) {
    return;
  }
 
  // Dont Include the string
  longestString(arr, index + 1, str);
 
  // Include the string
  str += arr[index];
 
  if (hasCharacterParity(str)) {
	maxi = str.length;
	ans1 = str;
  }
  longestString(arr, index + 1, str);
}
 
// Driver code

let A = ["ABAB", "ABF", "CDA", "AD", "CCC"];

// Call the function
longestString(A, 0, "");
 
// Print the answer
document.write(ans1 + " " + ans1.length);
