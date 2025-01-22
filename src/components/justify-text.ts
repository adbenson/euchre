/**
 * Given an array of words and a length maxLength, format the text such that each line has exactly
 * maxLength characters and is fully (left and right) justified.
 *
 * - You should pack as many words as you can in each line.
 * - Pad extra spaces ' ' when necessary so that each line has exactly maxLength characters.
 * - Extra spaces between words should be distributed as evenly as possible. If the number of spaces on a
 * line does not divide evenly between words, the remaining spaces should be allocated from left to right.
 * - The last line of text should be left justified (i.e., no extra space is inserted between words). But
 * spaces should be appended to the last word so that the entire line still has maxLength characters.
 *
 * Example 1:
 * Input: words = ['This', 'is', 'an', 'example', 'of', 'text', 'justification.'], maxLength = 16
 * Output: [
 *     'This    is    an',
 *     'example  of text',
 *     'justification.  '
 * ]
 *
 * Example 2:
 * Input: words = ['What', 'must', 'be', 'acknowledgment', 'shall', 'be'], maxLength = 16
 * Output: [
 *     'What   must   be',
 *     'acknowledgment  ',
 *     'shall be        '
 * ]
 *
 * Constraints:
 * - The input array words contains at least one word.
 * - words[i] consists of only English letters and symbols.
 * - words[i].length <= maxLength
 */

/**
 * @param {string[]} words
 * @param {number} maxLength
 * @return {string[]}
 */
 function justifyText(words, maxLength) {
     const lines = [[]];
     let lineIndex = 0;
     
     words.forEach(word => {
         const currentLength = lines[lineIndex].join(" ").length;

         if (currentLength + word.length + 1 > maxLength) {
             lines[lineIndex] = justifyLine(lines[lineIndex], maxLength);
             lineIndex++;
             lines[lineIndex] = [];
         }
         
         lines[lineIndex].push(word);
     });
     
     
     if (lines[lineIndex].length > 0) {
         const joined = lines[lineIndex].join(" ");
        lines[lineIndex] = padRight(joined, maxLength - joined.length); 
     } else {
         delete lines[lineIndex];
     }     
    
     return lines;
 }

function justifyLine(words, maxLength) {
    const spacesNeeded = maxLength - words.join(" ").length;
    
    if (words.length === 1) {
        const word = words[0];
        return padRight(word, spacesNeeded);
    }
    
    let wordIndex = 1;
    for (let spacesLeft = spacesNeeded; spacesLeft > 0; spacesLeft--) {
        words[wordIndex] = " " + words[wordIndex];

        wordIndex = (wordIndex === words.length - 1) ? 1 : wordIndex + 1;
    }
        
    return words.join(" ");
}

function padRight(word, spacesNeeded) {
     return spacesNeeded > 1 ?
         padRight(word + " ", spacesNeeded - 1) :
         word;
}

const justified = justifyText(['What', 'must', 'be', 'acknowledgment', 'shall', 'be'], 16);

function countCharacters(lines) {
    lines.forEach((line, i) => console.log(i, line.length));
}
                  
countCharacters(justified);
