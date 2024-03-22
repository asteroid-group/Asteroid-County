var questions = [
    //numbering is for keeping count lol i easily lose place
    //1
    {
        question: "What is another name for asteroids?",
        options: ["Minor planet", "Dwarf Planet", "Cousing Planet", "A silly little guy"],
        correctAnswer: "Minor planet"
    },
    //2
    {
        question: "What is the current asteroid count",
        options: ["Over 1 million", "At Least 10", "Over 1 billion", "10,000"],
        correctAnswer: "Over 1 million"
    },
    //3
    {
        question: "True or False: Asteroids must be at least 10 feet in diameter",
        options: ["True", "False"],
        correctAnswer: "False"
  
    },
    //4
    {
        question: "True or False: Asteroids must all be spherical in shape to be considered an asteroid",
        options: ["True", "False"],
        correctAnswer: "False"
    },    
    //5
    {
        question: "What are asteroids made of?",
        options: ["Ice", "Metal", "Rock", "All of the Above"],
        correctAnswer: "All of the Above"
    },
    //6
    {
        question: "Where is the asteroid belt?",
        options: ["Between Earth and Mars", "Between Mars and Jupiter", "Between the couch cushions ... so many crumbs", "Between Saturn and Jupiter"],
        correctAnswer: "Between Mars and Jupiter"
    },
    //7
    {
        question: "True or False: Asteroids are only found in the asteroid belt",
        options: ["True", "False"],
        correctAnswer: "False"
    },
    //8
    {
        question: "The largest asteroid recorded is ",
        options: ["56 miles long", "223 miles long", "329 miles long", "500 miles.... and i would walk 500 miles long"],
        correctAnswer: "329 miles long"
    },
    //9
    {
        question: "What truly makes an asteroid dangerous to earth?",
        options: ["Mass", "Speed", "Angle", "All of the Above"],
        correctAnswer: "All of the Above"
    },
    //10
    {
        question: "True or False: The whole mass of all asteroids within the asteroid belt is less than the mass of Earth's moon",
        options: ["True", "False"],
        correctAnswer: "True"
    }

];

//to randomize questions
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

var score = 0;
var currentQuestionIndex = 0;
var totalq = questions.length;
var qnum = 1;


function startQuiz() {
    document.getElementById('intro-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    questions = shuffleArray(questions);
    displayQuestion();
}


function displayQuestion() {
    var questionElement = document.getElementById('question');
    var optionsElement = document.getElementById('options');
    var resultElement = document.getElementById('results');
    var qnumElement = document.getElementById('questionNum');
    resultElement.innerHTML =`<h3 id="score-card-t">Current Score: ${score}/${totalq}`;
    qnumElement.textContent = qnum + "/" + totalq;
    questionElement.textContent = questions[currentQuestionIndex].question;
    optionsElement.innerHTML = '';
    questions[currentQuestionIndex].options.forEach(function(option) {
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'answer';
        input.value = option;
        optionsElement.appendChild(input);
        var label = document.createElement('label');
        label.textContent = option;
        optionsElement.appendChild(label);
        optionsElement.appendChild(document.createElement('br'));
    });
}


function nextQuestion() {
   var selectedO = document.querySelector('input[name="answer"]:checked')
    if (selectedO.value === questions[currentQuestionIndex].correctAnswer) {
        score++;
    }

    currentQuestionIndex++;
    qnum++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
       document.getElementById('quiz-container').style.display = 'none';
       document.getElementById('result-container').style.display = 'block'; 
       var fresultElement = document.getElementById('Fresults');
       var messageElement = document.getElementById('message');
       fresultElement.innerHTML = `<h2>Final Score: ${score}/10!</h2>`;
       if (score === 10)
       {
        messageElement.innerHTML = `<p>Hooray!!! You are our new Mayor! Here is the key to the city!</p>`
       }
       else if( 5 < score && score < 10)
       {
        messageElement.innerHTML = `<p>So close!!</p>`
       }
       else
       {
        messageElement.innerHTML = `<p>Better luck next time!</p>`
       }

    }
}

function tryAgain(){
    score = 0;
    currentQuestionIndex = 0;
    qnum = 1;
    startQuiz();
}