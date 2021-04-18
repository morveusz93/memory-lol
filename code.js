var amountOfCards = 20; //amount of cards on the board


// create divs with class 'card' and id 'card + number'
function createDivsForCards()
{
    for(let i=0; i<amountOfCards; i++)
    {
        $("#board").append('<div id="card'+ i +'" class="card"></div>');
    }
}

// take array of numbers, duplicate them and crate array with images pairs
function createListOfImages(amount)
{   
    var numbers = drawNumbersWithoutRepeatings(amount/2);
    for(i=0; i<amount/2; i++)
    {
        numbers.push(numbers[i]);
    }
    numbers = shuffle(numbers);
    var images = [];
    numbers.forEach(function(num) {images.push("img/" + num + ".jpg")});
    return images;
}


// create array of numbers withot repeating, we will use it to create names of images
function drawNumbersWithoutRepeatings(amount)
{
    var numbers = [];
    for(i=0; i<amount; i++)
    {
        x = getRandomInt();
        while(x in numbers){x = getRandomInt()}
        numbers[i] = x;
    }
    return numbers;
}

// random int 1-147 included
function getRandomInt() {
    return Math.floor(Math.random() * 147) + 1;
}


// shuffling array of numbers
function shuffle(array) 
{
    array.sort(function() { return Math.random() - .5; });
    return array;
}

// adding listening for click to cards divs
function addCardClickListener()
{
    for(let i = 0; i < amountOfCards; i++) 
    {
        $('#card' + i).click( function(){ revealCard(i); });
    }
}


// timer - in future it will start when first card is clicked
var countTheTime = function() {
    var seconds = $("#seconds").html();
    var minutes = $("#minutes").html();
    var sec = parseInt(seconds);
    var min = parseInt(minutes);
    sec++;
    if (sec > 59)
    {
        min++;
        sec = 0;
    }
    if (min > 9)  $("#minutes").html(min);
    else $("#minutes").html('0'+min);
    if (sec > 9) $("#seconds").html(sec);
    else $("#seconds").html('0'+sec);
}
var timerClock = window.setInterval(countTheTime, 1000); //start timer


var oneCardIsFlipped = false;
var flippedCardNumber; // remember already flipped card to compare it with another
var cardsLeft = amountOfCards; // count how many cards left not paired
var turnCounter = 0;

createDivsForCards(); 
var cardsOnBoard = createListOfImages(amountOfCards);
addCardClickListener(); // listing for a click

$("#score").html("Liczba tur: <br>"+turnCounter);

var locked  = false;
// main function of game
function revealCard(numberOfCard)
{
    if(locked == false)
    {
        locked = true;
        var imgSrc = 'url(' + cardsOnBoard[numberOfCard] + ')';
        $("#card"+numberOfCard).css("background-image", imgSrc);
        $("#card"+numberOfCard).addClass("flippedCard");
        var opacityValue = $("#card" + numberOfCard).css('opacity');
        if (opacityValue != 0)
        {
            if (oneCardIsFlipped == false)
            {
                oneCardIsFlipped = true;
                flippedCardNumber = numberOfCard;
                locked = false;
            }
            else
            {
                window.setTimeout(function() {
                    if(cardsOnBoard[numberOfCard] == cardsOnBoard[flippedCardNumber])
                    {
                        $("#card" + numberOfCard).css("opacity", '0');
                        $("#card" + flippedCardNumber).css("opacity", '0');
                        $("#card" + numberOfCard).css("cursor", 'default');
                        $("#card" + flippedCardNumber).css("cursor", 'default');
                        cardsLeft -= 2;
                        console.log("karta: " + numberOfCard);
                        // win!
                        if (cardsLeft == 0)
                        {
                            clearInterval(timerClock);
                            var endTime = ($("#minutes").text() + ":" + $("#seconds").text());
                            $("#board").html("<h1>Gratulacje! Ilość tur: " + (turnCounter + 1) + 
                            "<br>Twój czas: " + endTime + "</h1>" +
                            '<p id="again" onclick="location.reload()"> Zagraj ponownie </p>');
                        }
                        locked = false;
                    }

                    else
                    {
                        $("#card"+numberOfCard).css("background-image", "url(img/1rewers.jpg)");
                        $("#card"+flippedCardNumber).css("background-image", "url(img/1rewers.jpg)");
                        $("#card"+numberOfCard).removeClass("flippedCard");
                        $("#card"+flippedCardNumber).removeClass("flippedCard");
                        locked = false;
                    }
                    oneCardIsFlipped = false;
                    turnCounter++;
                    $("#score").html("Liczba tur: <br>"+turnCounter);
                }, 1000)
            }
        }
    }
}