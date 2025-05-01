for (let number = 1; number <= 50; number++) {
    // Sjekker om tallet er delelig både med 3 og 5 (fellesnevner)
    if (number % 3 === 0 && number % 5 === 0) {
        console.log("FizzBuzz"); // Skriver "FizzBuzz" hvis betingelsen er oppfylt
    } 
    // Sjekker om tallet kun er delelig med 3
    else if (number % 3 === 0) {
        console.log("Fizz"); // Skriver "Fizz" hvis betingelsen er oppfylt
    } 
    // Sjekker om tallet kun er delelig med 5
    else if (number % 5 === 0) {
        console.log("Buzz"); // Skriver "Buzz" hvis betingelsen er oppfylt
    } 
    // Hvis tallet ikke er delelig verken med 3 eller 5
    else {
        console.log(number); // Skriver tallet som det er
    }
}